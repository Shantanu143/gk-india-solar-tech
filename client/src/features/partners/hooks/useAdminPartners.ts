import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getAdminPartner, getAdminPartners, type GetAdminPartnersParams } from "@/features/partners/services/adminPartnerService";

/** Filtered/paginated partner list keeps `queryKeys.partners` as its cache root, params appended —
 * same spread-key pattern `useLeadTrend` uses for `dashboardTrend`. */
export function useAdminPartners(params: GetAdminPartnersParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.partners, params],
    queryFn: () => getAdminPartners(params),
  });
}

export function useAdminPartner(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.partnerDetail(id ?? ""),
    queryFn: () => getAdminPartner(id as string),
    enabled: !!id,
  });
}
