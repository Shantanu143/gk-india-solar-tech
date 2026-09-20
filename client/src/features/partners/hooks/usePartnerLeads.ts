import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import {
  getMyPartnerLeadDetail,
  getMyPartnerLeads,
  type GetPartnerLeadsParams,
} from "@/features/partners/services/partnerService";

/** Params are appended onto the shared `partnerLeads` prefix rather than a dedicated key builder —
 * `queryKeys.ts` is shared/off-limits, and TanStack Query still matches this by prefix, so
 * invalidating `queryKeys.partnerLeads` (e.g. after submitting a new lead) invalidates every
 * paginated/filtered variant below it too. */
export function usePartnerLeads(params: GetPartnerLeadsParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.partnerLeads, params] as const,
    queryFn: () => getMyPartnerLeads(params),
  });
}

export function usePartnerLeadDetail(leadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.partnerLeadDetail(leadId ?? ""),
    queryFn: () => getMyPartnerLeadDetail(leadId as string),
    enabled: !!leadId,
  });
}
