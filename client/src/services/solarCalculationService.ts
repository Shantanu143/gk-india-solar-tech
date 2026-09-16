import { mockDelay } from "./apiClient";
import { SOLAR_CONFIG } from "@/config/solarConfig";
import type { ProjectType, SolarCalculationInput, SolarCalculationResult } from "@/types/solarEstimate";

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function calculateRecommendedCapacity(monthlyBill: number, projectType: ProjectType): number {
  const { roundToKw, minKw, maxKw } = SOLAR_CONFIG.capacity[projectType];
  const raw = monthlyBill / SOLAR_CONFIG.rupeesPerKwMonthlyBill;
  const rounded = roundToStep(raw, roundToKw);
  return Math.min(Math.max(rounded, minKw), maxKw);
}

/** PM Surya Ghar-style progressive slab, capped at `capacityCapKw` and residential-only. */
function calculateSubsidy(capacityKw: number, projectType: ProjectType): { eligibleCapacity: number; estimatedSubsidy: number } {
  if (projectType !== "RESIDENTIAL") {
    return { eligibleCapacity: 0, estimatedSubsidy: 0 };
  }
  const { tier1RatePerKw, tier2RatePerKw, tier3RatePerKw, capacityCapKw } = SOLAR_CONFIG.subsidy;
  const eligibleCapacity = Math.min(capacityKw, capacityCapKw);
  const tier1 = Math.min(eligibleCapacity, 1) * tier1RatePerKw;
  const tier2 = Math.max(0, Math.min(eligibleCapacity, 2) - 1) * tier2RatePerKw;
  const tier3 = Math.max(0, Math.min(eligibleCapacity, 3) - 2) * tier3RatePerKw;
  return { eligibleCapacity, estimatedSubsidy: Math.round(tier1 + tier2 + tier3) };
}

/** Standard reducing-balance EMI formula. Exported so the UI can recompute live as the tenure changes. */
export function calculateEmi(principal: number, annualInterestRatePercent: number, tenureYears: number): number {
  const monthlyRate = annualInterestRatePercent / 12 / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

/**
 * TODO(backend): replace this body with `apiRequest<SolarCalculationResult>("/solar/calculate", { method: "POST", body: ... })`.
 * The formulas below are illustrative rules of thumb (see SOLAR_CONFIG), not certified engineering
 * output — every result field is presented to the customer as an estimate, never a final figure.
 */
export async function calculateSolarRecommendation(input: SolarCalculationInput): Promise<SolarCalculationResult> {
  const usedAssumedBill = input.electricity.mode === "UPLOAD";
  const inputMonthlyBill = usedAssumedBill
    ? SOLAR_CONFIG.defaultAssumedMonthlyBill
    : (input.electricity.monthlyBill ?? SOLAR_CONFIG.defaultAssumedMonthlyBill);

  const recommendedCapacity = calculateRecommendedCapacity(inputMonthlyBill, input.projectType);
  const estimatedPanels = Math.ceil((recommendedCapacity * 1000) / SOLAR_CONFIG.panelWattage);
  const recommendedInverter = recommendedCapacity;

  const monthlySaving = Math.round(inputMonthlyBill * SOLAR_CONFIG.monthlySavingRatio);
  const annualSaving = monthlySaving * 12;
  const lifetimeSaving = annualSaving * SOLAR_CONFIG.systemLifetimeYears;

  const estimatedProjectCost = Math.round(recommendedCapacity * SOLAR_CONFIG.costPerKw);
  const { eligibleCapacity, estimatedSubsidy } = calculateSubsidy(recommendedCapacity, input.projectType);
  const estimatedEffectiveCost = estimatedProjectCost - estimatedSubsidy;

  const { annualInterestRate, defaultTenureYears, tenureOptionsYears } = SOLAR_CONFIG.loan;
  const emi = calculateEmi(estimatedEffectiveCost, annualInterestRate, defaultTenureYears);

  const result: SolarCalculationResult = {
    recommendedCapacity,
    estimatedPanels,
    panelCapacity: SOLAR_CONFIG.panelWattage,
    recommendedInverter,
    monthlySaving,
    annualSaving,
    lifetimeSaving,
    estimatedProjectCost,
    estimatedSubsidy,
    estimatedEffectiveCost,
    subsidyEligibleCapacity: eligibleCapacity,
    annualInterestRate,
    defaultLoanTenureYears: defaultTenureYears,
    loanTenureOptions: tenureOptionsYears,
    emi,
    inputMonthlyBill,
    usedAssumedBill,
  };

  // Simulated network latency + a few staged status messages (see CalculationLoader) stand in for the future API call.
  return mockDelay(result, 1400);
}
