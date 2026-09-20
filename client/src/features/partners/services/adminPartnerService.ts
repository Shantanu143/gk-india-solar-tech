import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Partner, PartnerApplicationStatus, PartnerType } from "@/features/partners/types/partner";
import type { PartnerApplyRequest } from "@/schemas/partner.schema";

/**
 * Admin-only partner-management calls (list/review/approve/reject/suspend). Kept separate from the
 * other engineer's `partnerService.ts`, which is a PARTNER's own self-service calls (`/partners/me*`).
 */
export interface GetAdminPartnersParams {
  status?: PartnerApplicationStatus;
  type?: PartnerType;
  search?: string;
  page?: number;
  pageSize?: number;
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getAdminPartners(params: GetAdminPartnersParams = {}): Promise<PaginatedResult<Partner>> {
  const qs = toQueryString({ ...params });
  return apiRequest<PaginatedResult<Partner>>(`/partners${qs}`);
}

export async function getAdminPartner(id: string): Promise<Partner> {
  const { partner } = await apiRequest<{ partner: Partner }>(`/partners/${id}`);
  return partner;
}

/** Admin creates a partner directly — pre-approved immediately, same fields as public self-registration. */
export async function createPartnerByAdmin(payload: PartnerApplyRequest): Promise<Partner> {
  const { partner } = await apiRequest<{ partner: Partner }>("/partners", { method: "POST", body: JSON.stringify(payload) });
  return partner;
}

export interface SetPartnerStatusPayload {
  id: string;
  status: Extract<PartnerApplicationStatus, "APPROVED" | "REJECTED" | "SUSPENDED">;
  rejectionReason?: string;
}

export async function setPartnerStatus(payload: SetPartnerStatusPayload): Promise<Partner> {
  const { id, ...body } = payload;
  const { partner } = await apiRequest<{ partner: Partner }>(`/partners/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return partner;
}
