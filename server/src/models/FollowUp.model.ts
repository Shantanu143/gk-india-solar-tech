import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const FOLLOW_UP_TYPES = ["CALL", "WHATSAPP", "EMAIL", "MEETING", "OTHER"] as const;
export type FollowUpType = (typeof FOLLOW_UP_TYPES)[number];

export const FOLLOW_UP_STATUSES = ["PENDING", "COMPLETED", "MISSED", "CANCELLED"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export const FOLLOW_UP_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type FollowUpPriority = (typeof FOLLOW_UP_PRIORITIES)[number];

export interface RescheduledFrom {
  date: string;
  time: string;
}

export interface FollowUpAttrs {
  lead: Types.ObjectId;
  customerName: string;
  assignedEmployeeId: Types.ObjectId;
  type: FollowUpType;
  /** ISO date, e.g. "2026-08-15". */
  date: string;
  /** 24-hour "HH:mm". */
  time: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  notes?: string;
  outcome?: string;
  rescheduledFrom?: RescheduledFrom;
  createdBy: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type FollowUpDocument = HydratedDocument<FollowUpAttrs>;

const rescheduledFromSchema = new Schema<RescheduledFrom>({ date: { type: String, required: true }, time: { type: String, required: true } }, { _id: false });

const followUpSchema = new Schema<FollowUpAttrs>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    assignedEmployeeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: FOLLOW_UP_TYPES, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: FOLLOW_UP_STATUSES, required: true, default: "PENDING" },
    priority: { type: String, enum: FOLLOW_UP_PRIORITIES, required: true, default: "MEDIUM" },
    notes: { type: String, trim: true },
    outcome: { type: String, trim: true },
    rescheduledFrom: { type: rescheduledFromSchema },
    createdBy: { type: String, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

followUpSchema.index({ status: 1, date: 1 });

export const FollowUpModel: Model<FollowUpAttrs> = model<FollowUpAttrs>("FollowUp", followUpSchema);
