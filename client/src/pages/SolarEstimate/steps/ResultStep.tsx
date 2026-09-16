import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BillVsEMICard } from "@/components/solar/BillVsEMICard";
import { EMICalculator } from "@/components/solar/EMICalculator";
import { EstimateDisclaimer } from "@/components/solar/EstimateDisclaimer";
import { ProposalCTA } from "@/components/solar/ProposalCTA";
import { RecommendationHero } from "@/components/solar/RecommendationHero";
import { SavingsCards } from "@/components/solar/SavingsCards";
import { SavingsChart } from "@/components/solar/SavingsChart";
import { SubsidyCard } from "@/components/solar/SubsidyCard";
import { SystemRecommendationCard } from "@/components/solar/SystemRecommendationCard";
import { LeadCaptureForm } from "@/components/leads/LeadCaptureForm";
import { LeadSummary } from "@/components/leads/LeadSummary";
import { analytics } from "@/lib/analytics";
import { calculateEmi } from "@/services/solarCalculationService";
import { submitLead } from "@/services/leadService";
import { ROUTES } from "@/constant/routes";
import type { LeadFormValues } from "@/schemas/lead.schema";
import type { CreateLeadRequest } from "@/types/leadCapture";
import type { LocationData, ProjectType, SolarCalculationResult } from "@/types/solarEstimate";

interface ResultStepProps {
  calculation: SolarCalculationResult;
  projectType: ProjectType;
  location: LocationData;
  onEditEstimate: () => void;
  onResetAfterSuccess: () => void;
}

export function ResultStep({ calculation, projectType, location, onEditEstimate, onResetAfterSuccess }: ResultStepProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedTenure, setSelectedTenure] = useState(calculation.defaultLoanTenureYears);
  const leadHeadingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (showLeadForm) leadHeadingRef.current?.focus();
  }, [showLeadForm]);

  useEffect(() => {
    analytics.track("recommendation_viewed", { recommendedCapacity: calculation.recommendedCapacity });
  }, [calculation.recommendedCapacity]);

  const liveEmi = useMemo(
    () => calculateEmi(calculation.estimatedEffectiveCost, calculation.annualInterestRate, selectedTenure),
    [calculation.estimatedEffectiveCost, calculation.annualInterestRate, selectedTenure],
  );

  const leadDraftName = useRef("there");

  const leadMutation = useMutation({
    mutationFn: submitLead,
    onSuccess: (response) => {
      analytics.track("lead_created", { leadId: response.leadId });
      onResetAfterSuccess();
      navigate(ROUTES.solarEstimateSuccess, {
        state: {
          leadId: response.leadId,
          fullName: leadDraftName.current,
          projectType,
          city: location.city,
          recommendedCapacity: calculation.recommendedCapacity,
          monthlySaving: calculation.monthlySaving,
        },
      });
    },
  });

  function handleGetProposal() {
    analytics.track("proposal_form_started");
    setShowLeadForm(true);
  }

  function handleLeadSubmit(values: LeadFormValues) {
    leadDraftName.current = values.fullName.trim().split(/\s+/)[0] || "there";
    const request: CreateLeadRequest = {
      customer: {
        fullName: values.fullName,
        mobile: values.mobile,
        whatsapp: values.sameAsMobile ? values.mobile : values.whatsapp || values.mobile,
        email: values.email || undefined,
        address: values.address,
      },
      project: {
        projectType,
        city: location.city,
        pincode: location.pincode,
        monthlyBill: calculation.inputMonthlyBill,
      },
      solarRecommendation: {
        recommendedCapacity: calculation.recommendedCapacity,
        estimatedPanels: calculation.estimatedPanels,
        panelCapacity: calculation.panelCapacity,
        recommendedInverter: calculation.recommendedInverter,
      },
      source: {
        utmSource: searchParams.get("utm_source") ?? undefined,
        utmMedium: searchParams.get("utm_medium") ?? undefined,
        utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      },
    };
    analytics.track("lead_form_submitted");
    leadMutation.mutate(request);
  }

  if (showLeadForm) {
    return (
      <div>
        <h2 ref={leadHeadingRef} tabIndex={-1} className="text-xl font-bold text-navy outline-none sm:text-2xl">
          Get Your Detailed Solar Proposal
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your details and our solar expert will contact you soon.
        </p>

        <div className="mt-6 flex flex-col gap-6">
          <LeadSummary
            projectType={projectType}
            location={location}
            monthlyBill={calculation.inputMonthlyBill}
            recommendedCapacity={calculation.recommendedCapacity}
            onEdit={onEditEstimate}
          />
          <LeadCaptureForm
            defaultAddress={location.address}
            isSubmitting={leadMutation.isPending}
            submitError={leadMutation.isError}
            onSubmit={handleLeadSubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <RecommendationHero capacityKw={calculation.recommendedCapacity} />

      <SystemRecommendationCard
        recommendation={{
          recommendedCapacity: calculation.recommendedCapacity,
          estimatedPanels: calculation.estimatedPanels,
          panelCapacity: calculation.panelCapacity,
          recommendedInverter: calculation.recommendedInverter,
        }}
      />

      <section>
        <h3 className="text-lg font-bold text-navy">Your Estimated Solar Savings</h3>
        <div className="mt-4">
          <SavingsCards
            monthlySaving={calculation.monthlySaving}
            annualSaving={calculation.annualSaving}
            lifetimeSaving={calculation.lifetimeSaving}
          />
        </div>
        <div className="mt-4">
          <SavingsChart
            monthlySaving={calculation.monthlySaving}
            annualSaving={calculation.annualSaving}
            lifetimeSaving={calculation.lifetimeSaving}
          />
        </div>
        <EstimateDisclaimer variant="calculation" className="mt-4" />
        {calculation.usedAssumedBill && (
          <p className="mt-3 text-xs text-muted-foreground">
            This estimate uses a typical usage assumption since a bill amount wasn't entered — we'll
            refine it after reviewing your uploaded bill.
          </p>
        )}
      </section>

      <SubsidyCard subsidy={{ eligibleCapacity: calculation.subsidyEligibleCapacity, estimatedSubsidy: calculation.estimatedSubsidy }} />

      <EMICalculator
        projectCost={calculation.estimatedProjectCost}
        subsidy={calculation.estimatedSubsidy}
        effectiveCost={calculation.estimatedEffectiveCost}
        tenureOptions={calculation.loanTenureOptions}
        selectedTenure={selectedTenure}
        onTenureChange={(years) => {
          setSelectedTenure(years);
          analytics.track("emi_calculated", { tenureYears: years });
        }}
        emi={liveEmi}
      />

      <BillVsEMICard currentBill={calculation.inputMonthlyBill} emi={liveEmi} />

      <ProposalCTA onGetProposal={handleGetProposal} />
    </div>
  );
}
