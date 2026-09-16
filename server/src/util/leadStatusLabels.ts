import type { LeadStatus } from "../models/Lead.model";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  FOLLOW_UP: "Follow-up",
  SURVEY_REQUESTED: "Survey Requested",
  SURVEY_COMPLETED: "Survey Completed",
  QUOTATION_PREPARED: "Quotation Prepared",
  QUOTATION_SENT: "Quotation Sent",
  NEGOTIATION: "Negotiation",
  CONVERTED: "Converted",
  LOST: "Lost",
};
