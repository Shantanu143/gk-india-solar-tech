/**
 * Solar Estimate Wizard domain types (Features 2 & 3).
 * Deliberately separate from the lowercase `SolarProjectType` in `types/solar.ts`, which belongs
 * to the Feature 1 marketing pages and is not part of this wizard's data model.
 */

export type ProjectType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";

export type ElectricityInputMode = "BILL" | "UPLOAD";

export type BillUploadStatus = "idle" | "uploading" | "uploaded" | "error";

export interface LocationData {
  pincode: string;
  city: string;
  address: string;
}

/** Lightweight, storage-safe stand-in for an uploaded bill — never the raw File. */
export interface UploadedBillMeta {
  fileName: string;
  fileSizeBytes: number;
  fileType: string;
}

export interface ElectricityData {
  mode: ElectricityInputMode;
  monthlyBill: number | null;
  billMeta: UploadedBillMeta | null;
}

export interface SolarCalculationInput {
  projectType: ProjectType;
  location: LocationData;
  electricity: ElectricityData;
}

export interface SolarRecommendation {
  recommendedCapacity: number;
  estimatedPanels: number;
  panelCapacity: number;
  recommendedInverter: number;
}

export interface SubsidyEstimate {
  eligibleCapacity: number;
  estimatedSubsidy: number;
}

export interface EMIEstimate {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  monthlyEmi: number;
}

/**
 * Full calculation result. Field names intentionally match the requirements document's example
 * shape (recommendedCapacity ... loanTenureOptions) so this type reads as the literal contract
 * `POST /api/solar/calculate` will return once the backend exists.
 */
export interface SolarCalculationResult {
  recommendedCapacity: number;
  estimatedPanels: number;
  panelCapacity: number;
  recommendedInverter: number;
  monthlySaving: number;
  annualSaving: number;
  lifetimeSaving: number;
  estimatedProjectCost: number;
  estimatedSubsidy: number;
  estimatedEffectiveCost: number;
  subsidyEligibleCapacity: number;
  annualInterestRate: number;
  defaultLoanTenureYears: number;
  loanTenureOptions: number[];
  emi: number;
  /** The bill figure actually used for this calculation (typed by the customer, or assumed). */
  inputMonthlyBill: number;
  /** True when no bill amount was typed (upload-only path) and a typical-usage assumption stood in for it. */
  usedAssumedBill: boolean;
}
