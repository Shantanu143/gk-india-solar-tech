import { z } from "zod";
import { PARTNER_TYPES } from "@/features/partners/types/partner";
import { COMMISSION_TYPES, PAYMENT_TRIGGERS, type CommissionType } from "@/features/commissions/types/commission";
import { projectTypeSchema } from "@/schemas/projectType.schema";

/**
 * Numeric fields are kept as raw strings here (what a native `<input type="number">` actually produces)
 * rather than coerced with `z.preprocess`/`z.coerce`, which infers an `unknown` input type and breaks
 * `zodResolver`'s generic when `useForm` is also given an explicit (numeric) values type. The
 * string -> number conversion happens explicitly in `CommissionRuleModal`'s submit handler instead.
 */
function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

function isValidNumber(value: string): boolean {
  return value.trim() !== "" && !Number.isNaN(Number(value));
}

/** Mirrors `server/src/validation/commission.validation.ts`'s `requireAmountForType` — client-side is
 * just UX, the server re-validates regardless. */
function requireAmountForType(
  data: { commissionType: CommissionType; percent?: string; fixedAmount?: string },
  ctx: z.RefinementCtx,
) {
  if (data.commissionType === "PERCENTAGE") {
    if (isBlank(data.percent)) {
      ctx.addIssue({ code: "custom", message: "Enter a percent for a percentage-based rule.", path: ["percent"] });
    } else if (!isValidNumber(data.percent!) || Number(data.percent) < 0 || Number(data.percent) > 100) {
      ctx.addIssue({ code: "custom", message: "Percent must be between 0 and 100.", path: ["percent"] });
    }
  }
  if (data.commissionType === "FIXED") {
    if (isBlank(data.fixedAmount)) {
      ctx.addIssue({ code: "custom", message: "Enter a fixed amount for a fixed-amount rule.", path: ["fixedAmount"] });
    } else if (!isValidNumber(data.fixedAmount!) || Number(data.fixedAmount) <= 0) {
      ctx.addIssue({ code: "custom", message: "Fixed amount must be greater than 0.", path: ["fixedAmount"] });
    }
  }
}

/** Used for both create and edit — `partnerType` is shown read-only (disabled) when editing, since the
 * server's update endpoint doesn't accept it, and the field is stripped from the payload before that call. */
export const commissionRuleFormSchema = z
  .object({
    partnerType: z.enum(PARTNER_TYPES, { message: "Select a partner type." }),
    commissionType: z.enum(COMMISSION_TYPES, { message: "Select a commission type." }),
    percent: z.string().optional(),
    fixedAmount: z.string().optional(),
    applicableProjectType: z.union([z.literal(""), projectTypeSchema]).optional(),
    minSystemCapacityKw: z
      .string()
      .optional()
      .refine((v) => isBlank(v) || (isValidNumber(v!) && Number(v) >= 0), { message: "Capacity can't be negative." }),
    paymentTrigger: z.enum(PAYMENT_TRIGGERS, { message: "Select a payment trigger." }),
    active: z.boolean(),
  })
  .superRefine(requireAmountForType);

export type CommissionRuleFormValues = z.infer<typeof commissionRuleFormSchema>;
