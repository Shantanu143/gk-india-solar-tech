import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMyPartnerProjects } from "@/features/partners/services/partnerService";

export function usePartnerProjects() {
  return useQuery({ queryKey: queryKeys.partnerProjects, queryFn: getMyPartnerProjects });
}
