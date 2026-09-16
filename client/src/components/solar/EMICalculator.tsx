import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { EstimateDisclaimer } from "@/components/solar/EstimateDisclaimer";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/format";

interface EMICalculatorProps {
  projectCost: number;
  subsidy: number;
  effectiveCost: number;
  tenureOptions: number[];
  selectedTenure: number;
  onTenureChange: (tenure: number) => void;
  emi: number;
}

export function EMICalculator({
  projectCost,
  subsidy,
  effectiveCost,
  tenureOptions,
  selectedTenure,
  onTenureChange,
  emi,
}: EMICalculatorProps) {
  return (
    <Reveal>
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-7">
        <h3 className="text-lg font-bold text-navy">Make Solar Affordable With EMI</h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Project Cost</p>
            <p className="mt-1 text-lg font-bold text-navy">{formatInr(projectCost)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Subsidy</p>
            <p className="mt-1 text-lg font-bold text-green">- {formatInr(subsidy)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Estimated Effective Cost</p>
            <p className="mt-1 text-lg font-bold text-navy">{formatInr(effectiveCost)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Loan Tenure</p>
          <div className="mt-2 flex gap-2">
            {tenureOptions.map((years) => (
              <button
                key={years}
                type="button"
                onClick={() => onTenureChange(years)}
                aria-pressed={selectedTenure === years}
                className={cn(
                  "flex-1 rounded-lg border-2 py-2.5 text-sm font-semibold transition-colors duration-200",
                  selectedTenure === years ? "border-orange bg-orange/5 text-orange" : "border-border text-navy",
                )}
              >
                {years} Years
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center rounded-xl bg-navy-dark px-6 py-6 text-center">
          <span className="text-xs font-semibold tracking-wide text-white/60 uppercase">Estimated EMI</span>
          <motion.span
            key={emi}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1 text-3xl font-extrabold text-white"
          >
            {formatInr(emi)} <span className="text-base font-semibold text-white/60">/ Month</span>
          </motion.span>
        </div>

        <EstimateDisclaimer variant="emi" className="mt-5" />
      </div>
    </Reveal>
  );
}
