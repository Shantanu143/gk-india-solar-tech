import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const ACTIVITY_TYPES = [
  "LEAD_CREATED",
  "LEAD_ASSIGNED",
  "CUSTOMER_CONTACTED",
  "STATUS_CHANGED",
  "REMARK_ADDED",
  "FOLLOW_UP_CREATED",
  "FOLLOW_UP_COMPLETED",
  "FOLLOW_UP_RESCHEDULED",
  "FOLLOW_UP_CANCELLED",
  "SURVEY_REQUESTED",
  "SURVEY_COMPLETED",
  "QUOTATION_CREATED",
  "QUOTATION_SENT",
  "QUOTATION_ACCEPTED",
  "QUOTATION_REJECTED",
  "LEAD_LOST",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface ActivityAttrs {
  lead: Types.ObjectId;
  type: ActivityType;
  actorName: string;
  description: string;
  metadata?: Record<string, string | number>;
  createdAt: Date;
}

export type ActivityDocument = HydratedDocument<ActivityAttrs>;

const activitySchema = new Schema<ActivityAttrs>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    actorName: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityModel: Model<ActivityAttrs> = model<ActivityAttrs>("Activity", activitySchema);
