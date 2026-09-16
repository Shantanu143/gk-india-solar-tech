import { createContext, useContext } from "react";
import type {
  ElectricityData,
  LocationData,
  ProjectType,
  SolarCalculationResult,
} from "@/types/solarEstimate";

export interface SolarEstimateState {
  stepIndex: number;
  projectType: ProjectType | null;
  location: LocationData | null;
  electricity: ElectricityData;
  calculation: SolarCalculationResult | null;
}

export const initialElectricity: ElectricityData = { mode: "BILL", monthlyBill: null, billMeta: null };

export const initialState: SolarEstimateState = {
  stepIndex: 0,
  projectType: null,
  location: null,
  electricity: initialElectricity,
  calculation: null,
};

/**
 * Session-only persistence for wizard progress (survives refresh/back-nav within the tab).
 * Everything stored here is either non-sensitive (project type, install city/address, calculation
 * result) or already stripped of anything sensitive (uploaded-bill metadata only, never the file
 * itself). Lead-form personal details deliberately never pass through this store — see
 * `LeadCaptureForm`.
 */
export const STORAGE_KEY = "gk-solar-estimate-v1";

export function loadPersisted(): SolarEstimateState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<SolarEstimateState>;
    return { ...initialState, ...parsed, electricity: { ...initialElectricity, ...parsed.electricity } };
  } catch {
    return initialState;
  }
}

export type SolarEstimateAction =
  | { type: "SET_STEP"; stepIndex: number }
  | { type: "SET_PROJECT_TYPE"; projectType: ProjectType }
  | { type: "SET_LOCATION"; location: LocationData }
  | { type: "SET_ELECTRICITY"; electricity: Partial<ElectricityData> }
  | { type: "SET_CALCULATION"; calculation: SolarCalculationResult }
  | { type: "RESET" };

export function solarEstimateReducer(state: SolarEstimateState, action: SolarEstimateAction): SolarEstimateState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, stepIndex: action.stepIndex };
    case "SET_PROJECT_TYPE":
      return { ...state, projectType: action.projectType };
    case "SET_LOCATION":
      return { ...state, location: action.location };
    case "SET_ELECTRICITY":
      return { ...state, electricity: { ...state.electricity, ...action.electricity } };
    case "SET_CALCULATION":
      return { ...state, calculation: action.calculation };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export interface SolarEstimateContextValue {
  state: SolarEstimateState;
  goToStep: (stepIndex: number) => void;
  setProjectType: (projectType: ProjectType) => void;
  setLocation: (location: LocationData) => void;
  setElectricity: (electricity: Partial<ElectricityData>) => void;
  setCalculation: (calculation: SolarCalculationResult) => void;
  reset: () => void;
}

export const SolarEstimateContext = createContext<SolarEstimateContextValue | null>(null);

export function useSolarEstimate(): SolarEstimateContextValue {
  const ctx = useContext(SolarEstimateContext);
  if (!ctx) throw new Error("useSolarEstimate must be used within a SolarEstimateProvider");
  return ctx;
}
