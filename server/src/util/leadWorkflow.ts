import type { LeadStatus } from "../models/Lead.model";

/**
 * Mirrors `client/src/features/leads/utils/leadWorkflow.ts` exactly — this is the real enforcement
 * point; the frontend copy is only a UI hint. Keep both in sync.
 */
export const LEAD_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ["CONTACTED"],
  CONTACTED: ["FOLLOW_UP"],
  FOLLOW_UP: ["SURVEY_REQUESTED"],
  SURVEY_REQUESTED: ["SURVEY_COMPLETED"],
  SURVEY_COMPLETED: ["QUOTATION_PREPARED"],
  QUOTATION_PREPARED: ["QUOTATION_SENT"],
  QUOTATION_SENT: ["NEGOTIATION"],
  NEGOTIATION: ["QUOTATION_SENT", "CONVERTED"],
  CONVERTED: [],
  LOST: [],
};

const TERMINAL_STATUSES: LeadStatus[] = ["CONVERTED", "LOST"];

/**
 * Sales follows the pipeline: a quotation is only prepared once the site survey is done, so
 * SURVEY_COMPLETED is the single stage it can start from (see `quotationService.createQuotation`,
 * which also checks the survey and its photos). Mirrored by `QUOTABLE_LEAD_STATUSES` in the client's `leadWorkflow.ts`.
 */
export const QUOTABLE_LEAD_STATUSES: LeadStatus[] = ["SURVEY_COMPLETED"];

/**
 * Admin quotes on the spot (`quotations.createWithoutSurvey`): any stage a lead can be in before it
 * has a quotation. Mirrored by the client's `QUOTABLE_WITHOUT_SURVEY_LEAD_STATUSES`.
 */
export const QUOTABLE_WITHOUT_SURVEY_LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "FOLLOW_UP", "SURVEY_REQUESTED", "SURVEY_COMPLETED"];

/** Stages before the survey is finished — a lead here must complete its site survey before it can be quoted. */
export const AWAITING_SURVEY_LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "FOLLOW_UP", "SURVEY_REQUESTED"];

export function getAllowedNextStatuses(current: LeadStatus): LeadStatus[] {
  if (TERMINAL_STATUSES.includes(current)) return [];
  return [...LEAD_STATUS_TRANSITIONS[current], "LOST"];
}

export function canTransitionLead(from: LeadStatus, to: LeadStatus): boolean {
  if (to === "LOST") return !TERMINAL_STATUSES.includes(from);
  return LEAD_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalLeadStatus(status: LeadStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
