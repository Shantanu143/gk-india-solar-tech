import { apiRequest } from "@/services/apiClient";
import type { FollowUp, FollowUpFilters, FollowUpPriority, FollowUpType } from "@/features/followups/types/followUp";

function toQueryString(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getFollowUps(filters: FollowUpFilters = {}): Promise<FollowUp[]> {
  const qs = toQueryString({ ...filters });
  return apiRequest<FollowUp[]>(`/follow-ups${qs}`);
}

export async function getFollowUp(id: string): Promise<FollowUp> {
  const { followUp } = await apiRequest<{ followUp: FollowUp }>(`/follow-ups/${id}`);
  return followUp;
}

export interface CreateFollowUpPayload {
  leadId: string;
  customerName: string;
  assignedEmployeeId: string;
  type: FollowUpType;
  date: string;
  time: string;
  priority: FollowUpPriority;
  notes?: string;
  createdBy: string;
}

export async function createFollowUp(payload: CreateFollowUpPayload): Promise<FollowUp> {
  const { followUp } = await apiRequest<{ followUp: FollowUp }>("/follow-ups", {
    method: "POST",
    body: JSON.stringify({ leadId: payload.leadId, type: payload.type, date: payload.date, time: payload.time, priority: payload.priority, notes: payload.notes }),
  });
  return followUp;
}

export interface CompleteFollowUpPayload {
  id: string;
  outcome: string;
  actorName: string;
  scheduleNext?: {
    date: string;
    time: string;
    type: FollowUpType;
    priority: FollowUpPriority;
    notes?: string;
  };
}

export interface CompleteFollowUpResult {
  completed: FollowUp;
  nextFollowUp: FollowUp | null;
}

export async function completeFollowUp(payload: CompleteFollowUpPayload): Promise<CompleteFollowUpResult> {
  return apiRequest<CompleteFollowUpResult>(`/follow-ups/${payload.id}/complete`, {
    method: "POST",
    body: JSON.stringify({
      outcome: payload.outcome,
      scheduleNext: !!payload.scheduleNext,
      nextDate: payload.scheduleNext?.date,
      nextTime: payload.scheduleNext?.time,
      nextType: payload.scheduleNext?.type,
      nextPriority: payload.scheduleNext?.priority,
      nextNotes: payload.scheduleNext?.notes,
    }),
  });
}

export interface RescheduleFollowUpPayload {
  id: string;
  date: string;
  time: string;
  reason?: string;
  actorName: string;
}

export async function rescheduleFollowUp(payload: RescheduleFollowUpPayload): Promise<FollowUp> {
  const { followUp } = await apiRequest<{ followUp: FollowUp }>(`/follow-ups/${payload.id}/reschedule`, {
    method: "POST",
    body: JSON.stringify({ date: payload.date, time: payload.time, reason: payload.reason }),
  });
  return followUp;
}

export interface CancelFollowUpPayload {
  id: string;
  actorName: string;
}

export async function cancelFollowUp(payload: CancelFollowUpPayload): Promise<FollowUp> {
  const { followUp } = await apiRequest<{ followUp: FollowUp }>(`/follow-ups/${payload.id}/cancel`, { method: "POST" });
  return followUp;
}
