import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMyPartnerDashboard } from "@/features/partners/services/partnerService";

export function usePartnerDashboard() {
  return useQuery({ queryKey: queryKeys.partnerDashboard, queryFn: getMyPartnerDashboard });
}
