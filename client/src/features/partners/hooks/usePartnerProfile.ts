import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMyPartnerProfile } from "@/features/partners/services/partnerService";

export function usePartnerProfile() {
  return useQuery({ queryKey: queryKeys.partnerMe, queryFn: getMyPartnerProfile });
}
