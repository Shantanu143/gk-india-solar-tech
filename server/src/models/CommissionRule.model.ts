import { Schema, model, type HydratedDocument, type Model } from "mongoose";
import { PARTNER_TYPES, type PartnerType } from "./Partner.model";
import { PROJECT_TYPES, type ProjectType } from "./Lead.model";

export const COMMISSION_TYPES = ["PERCENTAGE", "FIXED"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

export const PAYMENT_TRIGGERS = ["ON_BOOKING", "ON_PROJECT_COMPLETED"] as const;
export type PaymentTrigger = (typeof PAYMENT_TRIGGERS)[number];

export interface CommissionRuleAttrs {
  partnerType: PartnerType;
  commissionType: CommissionType;
  /** Required (0-100) when commissionType === "PERCENTAGE" — enforced in zod validation, not here. */
  percent?: number;
  /** Required (>0) when commissionType === "FIXED" — enforced in zod validation, not here. */
  fixedAmount?: number;
  /** Omitted = applies to every project type. */
  applicableProjectType?: ProjectType;
  minSystemCapacityKw?: number;
  paymentTrigger: PaymentTrigger;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CommissionRuleDocument = HydratedDocument<CommissionRuleAttrs>;

const commissionRuleSchema = new Schema<CommissionRuleAttrs>(
  {
    partnerType: { type: String, enum: PARTNER_TYPES, required: true },
    commissionType: { type: String, enum: COMMISSION_TYPES, required: true },
    percent: { type: Number, min: 0, max: 100 },
    fixedAmount: { type: Number, min: 0 },
    applicableProjectType: { type: String, enum: PROJECT_TYPES },
    minSystemCapacityKw: { type: Number, min: 0 },
    paymentTrigger: { type: String, enum: PAYMENT_TRIGGERS, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

commissionRuleSchema.index({ partnerType: 1, paymentTrigger: 1, active: 1 });

export const CommissionRuleModel: Model<CommissionRuleAttrs> = model<CommissionRuleAttrs>(
  "CommissionRule",
  commissionRuleSchema,
);
