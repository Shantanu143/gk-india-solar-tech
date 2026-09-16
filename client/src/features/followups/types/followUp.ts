import type { Priority } from "@/features/crm/utils/priorityConfig";

export type FollowUpType = "CALL" | "WHATSAPP" | "EMAIL" | "MEETING" | "OTHER";
export type FollowUpStatus = "PENDING" | "COMPLETED" | "MISSED" | "CANCELLED";
export type FollowUpPriority = Priority;

export interface FollowUp {
  id: string;
  leadId: string;
  /** Denormalized for list/table display without a join — the lead remains the source of truth. */
  customerName: string;
  assignedEmployeeId: string;
  type: FollowUpType;
  /** ISO date, e.g. "2026-07-15". */
  date: string;
  /** 24-hour "HH:mm", e.g. "11:00". */
  time: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  notes?: string;
  outcome?: string;
  completedAt?: string;
  rescheduledFrom?: { date: string; time: string };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpFilters {
  leadId?: string;
  assignedEmployeeId?: string;
  status?: FollowUpStatus;
  type?: FollowUpType;
  scope?: "today" | "overdue" | "upcoming" | "completed";
}

export const FOLLOW_UP_TYPE_LABEL: Record<FollowUpType, string> = {
  CALL: "Call",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  MEETING: "Meeting",
  OTHER: "Other",
};

/** Combines the separate date/time fields (stored as plain IST wall-clock values) into a comparable Date. */
export function getFollowUpDateTime(followUp: Pick<FollowUp, "date" | "time">): Date {
  return new Date(`${followUp.date}T${followUp.time}:00+05:30`);
}

export function isFollowUpOverdue(followUp: Pick<FollowUp, "date" | "time" | "status">): boolean {
  return followUp.status === "PENDING" && getFollowUpDateTime(followUp).getTime() < Date.now();
}
