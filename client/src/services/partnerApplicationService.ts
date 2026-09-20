import { apiRequest } from "./apiClient";
import type { Partner } from "@/features/partners/types/partner";
import type { PartnerApplyRequest } from "@/schemas/partner.schema";

interface PartnerApplyResponse {
  partner: Partner;
}

/** `POST /api/partners/apply` — public, unauthenticated. No login tokens are issued on success. */
export async function applyAsPartner(payload: PartnerApplyRequest): Promise<PartnerApplyResponse> {
  return apiRequest<PartnerApplyResponse>("/partners/apply", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
