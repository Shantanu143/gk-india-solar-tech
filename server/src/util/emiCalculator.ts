import type { ProjectType } from "../models/Lead.model";

/** Mirrors `client/src/config/solarConfig.ts`'s `loan`/`subsidy` blocks — illustrative figures, not a financing offer. */
export const LOAN_CONFIG = {
  annualInterestRate: 8,
  defaultTenureYears: 5,
} as const;

const SUBSIDY_CONFIG = {
  tier1RatePerKw: 30000,
  tier2RatePerKw: 30000,
  tier3RatePerKw: 18000,
  capacityCapKw: 3,
} as const;

/** Standard reducing-balance EMI formula — identical to the frontend's `calculateEmi`. */
export function calculateEmi(principal: number, annualInterestRatePercent: number, tenureYears: number): number {
  const monthlyRate = annualInterestRatePercent / 12 / 100;
  const months = tenureYears * 12;
  if (monthlyRate === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

/** PM Surya Ghar-style progressive slab, capped at 3kW and residential-only — identical to the frontend's `calculateSubsidy`. */
export function calculateSubsidy(capacityKw: number, projectType: ProjectType): number {
  if (projectType !== "RESIDENTIAL") return 0;
  const { tier1RatePerKw, tier2RatePerKw, tier3RatePerKw, capacityCapKw } = SUBSIDY_CONFIG;
  const eligibleCapacity = Math.min(capacityKw, capacityCapKw);
  const tier1 = Math.min(eligibleCapacity, 1) * tier1RatePerKw;
  const tier2 = Math.max(0, Math.min(eligibleCapacity, 2) - 1) * tier2RatePerKw;
  const tier3 = Math.max(0, Math.min(eligibleCapacity, 3) - 2) * tier3RatePerKw;
  return Math.round(tier1 + tier2 + tier3);
}
