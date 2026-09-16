export type ActivityType =
  | "LEAD_CREATED"
  | "LEAD_ASSIGNED"
  | "CUSTOMER_CONTACTED"
  | "STATUS_CHANGED"
  | "REMARK_ADDED"
  | "FOLLOW_UP_CREATED"
  | "FOLLOW_UP_COMPLETED"
  | "FOLLOW_UP_RESCHEDULED"
  | "FOLLOW_UP_CANCELLED"
  | "SURVEY_REQUESTED"
  | "SURVEY_COMPLETED"
  | "QUOTATION_CREATED"
  | "QUOTATION_SENT"
  | "LEAD_LOST";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  actorName: string;
  description: string;
  metadata?: Record<string, string | number>;
  createdAt: string;
}
