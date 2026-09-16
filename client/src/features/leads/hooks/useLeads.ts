import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getLeads, type GetLeadsParams } from "@/features/leads/services/leadService";

export function useLeads(params: GetLeadsParams = {}) {
  return useQuery({
    queryKey: queryKeys.leadsList(params),
    queryFn: () => getLeads(params),
    placeholderData: (previousData) => previousData,
  });
}
