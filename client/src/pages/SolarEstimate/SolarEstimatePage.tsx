import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { CalculationLoader } from "@/components/solar/CalculationLoader";
import { EstimateProgress } from "@/components/solar/EstimateProgress";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { calculateSolarRecommendation } from "@/services/solarCalculationService";
import { useSolarEstimate } from "@/store/solarEstimateContext";
import { SolarEstimateProvider } from "@/store/solarEstimateStore";
import { ElectricityStep } from "./steps/ElectricityStep";
import { LocationStep } from "./steps/LocationStep";
import { ProjectStep } from "./steps/ProjectStep";
import { ResultStep } from "./steps/ResultStep";
import type { ElectricityData, LocationData, ProjectType, SolarCalculationInput } from "@/types/solarEstimate";

const TRUST_ITEMS = [
  { icon: Lock, label: "Secure information" },
  { icon: Sparkles, label: "Free estimate" },
  { icon: ShieldCheck, label: "No obligation" },
];

function CalculationErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertCircle className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-bold text-navy">We couldn't calculate your estimate right now.</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">Please check your connection and try again.</p>
      <Button className="mt-6" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}

function SolarEstimateContent() {
  const [searchParams] = useSearchParams();
  const { state, goToStep, setProjectType, setLocation, setElectricity, setCalculation, reset } = useSolarEstimate();
  const hasAppliedModeParam = useRef(false);
  const lastCalculationInput = useRef<SolarCalculationInput | null>(null);

  useEffect(() => {
    if (!hasAppliedModeParam.current) {
      hasAppliedModeParam.current = true;
      if (searchParams.get("mode") === "bill-upload") {
        setElectricity({ mode: "UPLOAD" });
      }
      analytics.track("solar_estimate_started");
    }
    // Only ever applied once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Defensive: a persisted step index of 3 without a calculation result shouldn't happen, but
  // fall back safely rather than rendering ResultStep with nothing to show.
  useEffect(() => {
    if (state.stepIndex === 3 && !state.calculation) {
      goToStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stepIndex, state.calculation]);

  const calculateMutation = useMutation({
    mutationFn: calculateSolarRecommendation,
    onSuccess: (result) => {
      setCalculation(result);
      goToStep(3);
      analytics.track("solar_calculation_completed", { recommendedCapacity: result.recommendedCapacity });
    },
  });

  function handleProjectSelect(type: ProjectType) {
    setProjectType(type);
    analytics.track("project_type_selected", { projectType: type });
  }

  function handleLocationSubmit(data: LocationData) {
    setLocation(data);
    analytics.track("location_completed");
    goToStep(2);
  }

  function handleCalculate(electricity: ElectricityData) {
    setElectricity(electricity);
    analytics.track(electricity.mode === "BILL" ? "bill_entered" : "bill_uploaded");
    if (!state.projectType || !state.location) return;
    const input: SolarCalculationInput = { projectType: state.projectType, location: state.location, electricity };
    lastCalculationInput.current = input;
    calculateMutation.mutate(input);
  }

  const isResultStep = state.stepIndex === 3;

  return (
    <section className="py-10 sm:py-14">
      <Seo
        title="Free Solar Estimate | GK India SolarTech"
        description="Estimate your solar requirement, potential savings, subsidy and EMI with GK India SolarTech."
        path="/solar-estimate"
      />
      <Container className={cn("mx-auto", isResultStep ? "max-w-4xl" : "max-w-3xl")}>
        {!isResultStep && !calculateMutation.isPending && !calculateMutation.isError && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy sm:text-4xl">Get Your Free Solar Estimate</h1>
          </div>
        )}

        <div className="mt-8">
          <EstimateProgress currentIndex={state.stepIndex} />
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={calculateMutation.isPending ? "loading" : calculateMutation.isError ? "error" : state.stepIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {calculateMutation.isPending ? (
                <CalculationLoader />
              ) : calculateMutation.isError ? (
                <CalculationErrorState
                  onRetry={() => lastCalculationInput.current && calculateMutation.mutate(lastCalculationInput.current)}
                />
              ) : state.stepIndex === 0 ? (
                <ProjectStep selected={state.projectType} onSelect={handleProjectSelect} onContinue={() => goToStep(1)} />
              ) : state.stepIndex === 1 ? (
                <LocationStep defaultValues={state.location} onBack={() => goToStep(0)} onSubmit={handleLocationSubmit} />
              ) : state.stepIndex === 2 ? (
                <ElectricityStep
                  initialMode={state.electricity.mode}
                  initialMonthlyBill={state.electricity.monthlyBill}
                  initialBillMeta={state.electricity.billMeta}
                  onBack={() => goToStep(1)}
                  onCalculate={handleCalculate}
                />
              ) : state.calculation && state.projectType && state.location ? (
                <ResultStep
                  calculation={state.calculation}
                  projectType={state.projectType}
                  location={state.location}
                  onEditEstimate={() => goToStep(0)}
                  onResetAfterSuccess={reset}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {!isResultStep && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-green" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export function SolarEstimatePage() {
  return (
    <SolarEstimateProvider>
      <SolarEstimateContent />
    </SolarEstimateProvider>
  );
}
