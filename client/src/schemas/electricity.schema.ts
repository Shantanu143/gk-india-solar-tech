import { z } from "zod";
import type { ElectricityData } from "@/types/solarEstimate";

/** Validates just the "Enter Bill Amount" mode's numeric field. */
export const monthlyBillSchema = z.object({
  monthlyBill: z
    .number({ error: "Please enter your monthly electricity bill." })
    .positive("Enter an amount greater than zero.")
    .max(1_000_000, "That amount looks too high — please check and re-enter."),
});

export type MonthlyBillFormValues = z.infer<typeof monthlyBillSchema>;

/**
 * Cross-mode readiness check for the Electricity step's Continue/Calculate button — centralized
 * here instead of scattered inline conditionals in the step component.
 */
export function isElectricityStepComplete(data: ElectricityData): boolean {
  if (data.mode === "BILL") return typeof data.monthlyBill === "number" && data.monthlyBill > 0;
  return data.billMeta !== null;
}
