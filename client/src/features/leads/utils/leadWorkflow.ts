import type { LeadStatus } from "@/features/leads/types/lead";

/**
 * The lead pipeline as a configured state graph rather than scattered if/else checks — the UI
 * only ever offers transitions defined here. LOST is reachable from any non-terminal state (with
 * a required reason, handled by the caller) and is intentionally left out of this graph so it
 * doesn't have to be repeated on every entry.
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
 * Every stage a lead can be in while it has no quotation yet. A quotation can be created from any
 * of them — the site survey is optional. Mirrors `QUOTABLE_LEAD_STATUSES` in the server's
 * `leadWorkflow.ts`; keep both in sync.
 */
export const QUOTABLE_LEAD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "FOLLOW_UP", "SURVEY_REQUESTED", "SURVEY_COMPLETED"];

export function canCreateQuotation(status: LeadStatus): boolean {
  return QUOTABLE_LEAD_STATUSES.includes(status);
}

/** Statuses this lead could move to next — LOST is appended for every non-terminal status. */
export function getAllowedNextStatuses(current: LeadStatus): LeadStatus[] {
  if (TERMINAL_STATUSES.includes(current)) return [];
  return [...LEAD_STATUS_TRANSITIONS[current], "LOST"];
}

export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  if (to === "LOST") return !TERMINAL_STATUSES.includes(from);
  return LEAD_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalStatus(status: LeadStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
