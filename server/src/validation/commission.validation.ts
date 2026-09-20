import { z } from "zod";
import { COMMISSION_TYPES, PAYMENT_TRIGGERS } from "../models/CommissionRule.model";
import { COMMISSION_STATUSES } from "../models/Commission.model";
import { PARTNER_TYPES } from "../models/Partner.model";
import { PROJECT_TYPES } from "../models/Lead.model";

/** Cross-field rule: PERCENTAGE rules need `percent`, FIXED rules need `fixedAmount`. */
function requireAmountForType<T extends { commissionType?: string; percent?: number; fixedAmount?: number }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (data.commissionType === "PERCENTAGE" && data.percent === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Percent is required for a PERCENTAGE commission rule.", path: ["percent"] });
  }
  if (data.commissionType === "FIXED" && data.fixedAmount === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Fixed amount is required for a FIXED commission rule.", path: ["fixedAmount"] });
  }
}

export const createCommissionRuleSchema = z
  .object({
    partnerType: z.enum(PARTNER_TYPES, { message: "Select a valid partner type." }),
    commissionType: z.enum(COMMISSION_TYPES, { message: "Select a valid commission type." }),
    percent: z.coerce.number().min(0, "Percent must be at least 0.").max(100, "Percent cannot exceed 100.").optional(),
    fixedAmount: z.coerce.number().positive("Fixed amount must be greater than 0.").optional(),
    applicableProjectType: z.enum(PROJECT_TYPES).optional(),
    minSystemCapacityKw: z.coerce.number().min(0).optional(),
    paymentTrigger: z.enum(PAYMENT_TRIGGERS, { message: "Select a valid payment trigger." }),
    active: z.boolean().optional(),
  })
  .superRefine(requireAmountForType);
export type CreateCommissionRuleInput = z.infer<typeof createCommissionRuleSchema>;

/** Partial update — e.g. toggling `active`, or adjusting `percent`/`fixedAmount`. Only re-validates the
 * percent/fixedAmount requirement when `commissionType` is part of this particular update. */
export const updateCommissionRuleSchema = z
  .object({
    commissionType: z.enum(COMMISSION_TYPES).optional(),
    percent: z.coerce.number().min(0, "Percent must be at least 0.").max(100, "Percent cannot exceed 100.").optional(),
    fixedAmount: z.coerce.number().positive("Fixed amount must be greater than 0.").optional(),
    applicableProjectType: z.enum(PROJECT_TYPES).optional(),
    minSystemCapacityKw: z.coerce.number().min(0).optional(),
    paymentTrigger: z.enum(PAYMENT_TRIGGERS).optional(),
    active: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.commissionType) requireAmountForType(data, ctx);
  });
export type UpdateCommissionRuleInput = z.infer<typeof updateCommissionRuleSchema>;

/** Admin ledger listing — filterable by partner and status, paginated. */
export const listCommissionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
  partnerId: z.string().trim().optional(),
  status: z.enum(COMMISSION_STATUSES).optional(),
});
export type ListCommissionsQuery = z.infer<typeof listCommissionsQuerySchema>;

/** Used by GET /me — a partner's own commissions, paginated with no admin-only filters. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(500).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const updateCommissionStatusSchema = z.object({
  status: z.enum(COMMISSION_STATUSES, { message: "Select a valid commission status." }),
  paymentDate: z.coerce.date().optional(),
  paymentReference: z.string().trim().optional(),
});
export type UpdateCommissionStatusInput = z.infer<typeof updateCommissionStatusSchema>;
