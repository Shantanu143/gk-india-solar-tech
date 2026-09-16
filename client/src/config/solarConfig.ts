import type { ProjectType } from "@/types/solarEstimate";

/**
 * Illustrative calculation configuration — stands in for the future `GET /api/solar/config`.
 * Every coefficient here is a rough, published-style rule of thumb (not a guarantee), matching
 * the example figures in the requirements document. Swap these for real tariff/scheme data once
 * the backend config endpoint exists; the calculation service already reads everything from here
 * rather than hardcoding numbers inline.
 */
export const SOLAR_CONFIG = {
  /** ₹ of average monthly bill assumed per kW of recommended capacity. */
  rupeesPerKwMonthlyBill: 1000,
  /** Used only when a bill amount wasn't typed (upload-only path) to still produce a provisional estimate. */
  defaultAssumedMonthlyBill: 4000,
  /** Watts per panel for a modern module. */
  panelWattage: 550,
  /** Share of the current bill assumed to become savings after going solar. */
  monthlySavingRatio: 0.84,
  /** ₹ per kW for a turnkey EPC installation. */
  costPerKw: 70000,
  /** Solar panel system lifetime assumption for the 25-year saving projection. */
  systemLifetimeYears: 25,
  /** PM Surya Ghar-style residential subsidy slabs — ₹/kW, applied progressively up to the cap. */
  subsidy: {
    tier1RatePerKw: 30000, // kW 1
    tier2RatePerKw: 30000, // kW 2
    tier3RatePerKw: 18000, // kW 3
    capacityCapKw: 3,
  },
  /** Illustrative loan terms for the EMI estimate — not a financing offer. */
  loan: {
    annualInterestRate: 8,
    tenureOptionsYears: [3, 5, 7],
    defaultTenureYears: 5,
  },
  /** Recommended-capacity rounding + sane ceilings per project type. */
  capacity: {
    RESIDENTIAL: { roundToKw: 0.5, minKw: 1, maxKw: 15 },
    COMMERCIAL: { roundToKw: 1, minKw: 3, maxKw: 150 },
    INDUSTRIAL: { roundToKw: 5, minKw: 10, maxKw: 1000 },
  } satisfies Record<ProjectType, { roundToKw: number; minKw: number; maxKw: number }>,
};
