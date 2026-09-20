import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";
import { COMMISSION_TYPES, type CommissionType } from "./CommissionRule.model";

export const COMMISSION_STATUSES = ["PENDING", "APPROVED", "PROCESSING", "PAID", "ON_HOLD", "CANCELLED"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export interface CommissionAttrs {
  partnerId: Types.ObjectId;
  leadId: Types.ObjectId;
  projectId?: Types.ObjectId | null;
  commissionRuleId: Types.ObjectId;
  systemCapacityKw: number;
  bookingAmount: number;
  // Snapshot of the matched rule's terms at creation time, so a later rule edit never
  // retroactively changes a historical commission.
  commissionType: CommissionType;
  percent?: number;
  fixedAmount?: number;
  commissionAmount: number;
  status: CommissionStatus;
  paymentDate?: Date;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CommissionDocument = HydratedDocument<CommissionAttrs>;

const commissionSchema = new Schema<CommissionAttrs>(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true },
    // A lead should only ever produce one Commission record — this also makes
    // commissionService.evaluateForLead naturally idempotent.
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, unique: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    commissionRuleId: { type: Schema.Types.ObjectId, ref: "CommissionRule", required: true },
    systemCapacityKw: { type: Number, required: true, min: 0 },
    bookingAmount: { type: Number, required: true, min: 0 },
    commissionType: { type: String, enum: COMMISSION_TYPES, required: true },
    percent: { type: Number, min: 0, max: 100 },
    fixedAmount: { type: Number, min: 0 },
    commissionAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: COMMISSION_STATUSES, required: true, default: "PENDING" },
    paymentDate: { type: Date },
    paymentReference: { type: String, trim: true },
  },
  { timestamps: true },
);

commissionSchema.index({ partnerId: 1, status: 1 });

export const CommissionModel: Model<CommissionAttrs> = model<CommissionAttrs>("Commission", commissionSchema);
