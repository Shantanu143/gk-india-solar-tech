import { apiRequest } from "@/services/apiClient";
import type { Lead, LeadFilters, LeadInterest, LeadPriority, LeadStatus, LostReason } from "@/features/leads/types/lead";
import type { PaginatedResult } from "@/features/crm/types/api";

export interface GetLeadsParams extends LeadFilters {
  page?: number;
  pageSize?: number;
  sortDirection?: "asc" | "desc";
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getLeads(params: GetLeadsParams = {}): Promise<PaginatedResult<Lead>> {
  const qs = toQueryString({ ...params });
  return apiRequest<PaginatedResult<Lead>>(`/leads${qs}`);
}

export async function getLead(id: string): Promise<Lead> {
  const { lead } = await apiRequest<{ lead: Lead }>(`/leads/${id}`);
  return lead;
}

export interface AssignLeadPayload {
  leadId: string;
  employeeId: string;
  priority?: LeadPriority;
  actorName: string;
}

export async function assignLead(payload: AssignLeadPayload): Promise<Lead> {
  const { lead } = await apiRequest<{ lead: Lead }>(`/leads/${payload.leadId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ employeeId: payload.employeeId, priority: payload.priority }),
  });
  return lead;
}

export interface UpdateLeadStatusPayload {
  leadId: string;
  status: LeadStatus;
  actorName: string;
  lostReason?: LostReason;
}

export async function updateLeadStatus(payload: UpdateLeadStatusPayload): Promise<Lead> {
  const { lead } = await apiRequest<{ lead: Lead }>(`/leads/${payload.leadId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status, lostReason: payload.lostReason }),
  });
  return lead;
}

export interface AddRemarkPayload {
  leadId: string;
  remark: string;
  actorName: string;
  interest?: LeadInterest;
}

export async function addRemark(payload: AddRemarkPayload): Promise<Lead> {
  const { lead } = await apiRequest<{ lead: Lead }>(`/leads/${payload.leadId}`, {
    method: "PATCH",
    body: JSON.stringify({ remark: payload.remark, interest: payload.interest }),
  });
  return lead;
}
