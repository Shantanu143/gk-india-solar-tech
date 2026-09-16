import type { LeadStatus } from "@/features/leads/types/lead";

export type StatusTone = "neutral" | "navy" | "orange" | "purple" | "amber" | "green" | "red";

export const TONE_CLASSES: Record<StatusTone, { bg: string; text: string }> = {
  neutral: { bg: "bg-slate-100", text: "text-slate-600" },
  navy: { bg: "bg-navy/10", text: "text-navy" },
  orange: { bg: "bg-orange/10", text: "text-orange-dark" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  green: { bg: "bg-green/10", text: "text-green" },
  red: { bg: "bg-error/10", text: "text-error" },
};

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; tone: StatusTone }> = {
  NEW: { label: "New", tone: "neutral" },
  CONTACTED: { label: "Contacted", tone: "navy" },
  FOLLOW_UP: { label: "Follow-up", tone: "orange" },
  SURVEY_REQUESTED: { label: "Survey Requested", tone: "purple" },
  SURVEY_COMPLETED: { label: "Survey Completed", tone: "purple" },
  QUOTATION_PREPARED: { label: "Quotation Prepared", tone: "amber" },
  QUOTATION_SENT: { label: "Quotation Sent", tone: "amber" },
  NEGOTIATION: { label: "Negotiation", tone: "orange" },
  CONVERTED: { label: "Converted", tone: "green" },
  LOST: { label: "Lost", tone: "red" },
};

/** Fine-grained funnel stages, in order — matches the requirements document's funnel exactly. */
export const LEAD_FUNNEL_STAGES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "SURVEY_REQUESTED",
  "SURVEY_COMPLETED",
  "QUOTATION_SENT",
  "NEGOTIATION",
  "CONVERTED",
  "LOST",
];

export interface PipelineColumn {
  key: string;
  label: string;
  statuses: LeadStatus[];
  /** Status applied when a lead is moved into this column from another. */
  primaryStatus: LeadStatus;
}

/** Broader Kanban columns — some fold two fine-grained statuses into one column (Survey, Quotation). */
export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { key: "NEW", label: "New", statuses: ["NEW"], primaryStatus: "NEW" },
  { key: "CONTACTED", label: "Contacted", statuses: ["CONTACTED"], primaryStatus: "CONTACTED" },
  { key: "FOLLOW_UP", label: "Follow-up", statuses: ["FOLLOW_UP"], primaryStatus: "FOLLOW_UP" },
  {
    key: "SURVEY",
    label: "Survey",
    statuses: ["SURVEY_REQUESTED", "SURVEY_COMPLETED"],
    primaryStatus: "SURVEY_REQUESTED",
  },
  {
    key: "QUOTATION",
    label: "Quotation",
    statuses: ["QUOTATION_PREPARED", "QUOTATION_SENT"],
    primaryStatus: "QUOTATION_PREPARED",
  },
  { key: "NEGOTIATION", label: "Negotiation", statuses: ["NEGOTIATION"], primaryStatus: "NEGOTIATION" },
  { key: "CONVERTED", label: "Converted", statuses: ["CONVERTED"], primaryStatus: "CONVERTED" },
];
