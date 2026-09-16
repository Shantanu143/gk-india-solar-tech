export type NotificationType =
  | "LEAD_ASSIGNED"
  | "FOLLOW_UP_DUE"
  | "FOLLOW_UP_OVERDUE"
  | "SURVEY_SCHEDULED"
  | "QUOTATION_READY";

export interface CrmNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  leadId?: string;
  createdAt: string;
  read: boolean;
}
