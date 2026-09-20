import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getCommissionRules } from "@/features/commissions/services/commissionService";

export function useCommissionRules() {
  return useQuery({ queryKey: queryKeys.commissionRules, queryFn: getCommissionRules });
}
