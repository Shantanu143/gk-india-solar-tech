import { useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import {
  loadPersisted,
  solarEstimateReducer,
  SolarEstimateContext,
  STORAGE_KEY,
  type SolarEstimateContextValue,
} from "./solarEstimateContext";

export function SolarEstimateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(solarEstimateReducer, undefined, loadPersisted);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage can be unavailable (private mode, quota) — wizard still works in-memory.
    }
  }, [state]);

  const value = useMemo<SolarEstimateContextValue>(
    () => ({
      state,
      goToStep: (stepIndex) => dispatch({ type: "SET_STEP", stepIndex }),
      setProjectType: (projectType) => dispatch({ type: "SET_PROJECT_TYPE", projectType }),
      setLocation: (location) => dispatch({ type: "SET_LOCATION", location }),
      setElectricity: (electricity) => dispatch({ type: "SET_ELECTRICITY", electricity }),
      setCalculation: (calculation) => dispatch({ type: "SET_CALCULATION", calculation }),
      reset: () => {
        dispatch({ type: "RESET" });
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      },
    }),
    [state],
  );

  return <SolarEstimateContext.Provider value={value}>{children}</SolarEstimateContext.Provider>;
}
