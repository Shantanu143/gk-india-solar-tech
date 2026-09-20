import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMyCommissions, type GetMyCommissionsParams } from "@/features/commissions/services/commissionService";

export function useMyCommissions(params: GetMyCommissionsParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.commissionsMe, params] as const,
    queryFn: () => getMyCommissions(params),
  });
}
