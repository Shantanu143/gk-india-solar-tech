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
