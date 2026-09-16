import { Schema, model, Types, type HydratedDocument, type Model } from "mongoose";

export const NOTIFICATION_TYPES = ["LEAD_ASSIGNED", "FOLLOW_UP_DUE", "FOLLOW_UP_OVERDUE", "SURVEY_SCHEDULED", "QUOTATION_READY"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationAttrs {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  description: string;
  lead: Types.ObjectId | null;
  read: boolean;
  createdAt: Date;
}

export type NotificationDocument = HydratedDocument<NotificationAttrs>;

const notificationSchema = new Schema<NotificationAttrs>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead", default: null },
    read: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export const NotificationModel: Model<NotificationAttrs> = model<NotificationAttrs>("Notification", notificationSchema);
