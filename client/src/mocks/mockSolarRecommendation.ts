import type { SolarCalculationResult } from "@/types/solarEstimate";

/**
 * DEV-ONLY reference example — the exact illustrative figures from the requirements document.
 * Not used by the live calculation path (`solarCalculationService.ts` computes results from
 * actual customer input); kept here for local reference/testing only.
 */
export const mockSolarRecommendation: SolarCalculationResult = {
  recommendedCapacity: 5,
  estimatedPanels: 10,
  panelCapacity: 550,
  recommendedInverter: 5,
  monthlySaving: 4200,
  annualSaving: 50400,
  lifetimeSaving: 1260000,
  estimatedProjectCost: 350000,
  estimatedSubsidy: 78000,
  estimatedEffectiveCost: 272000,
  subsidyEligibleCapacity: 3,
  annualInterestRate: 8,
  defaultLoanTenureYears: 5,
  loanTenureOptions: [3, 5, 7],
  emi: 5515,
  inputMonthlyBill: 5000,
  usedAssumedBill: false,
};
