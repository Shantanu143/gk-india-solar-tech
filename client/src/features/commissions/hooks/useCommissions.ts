import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getCommissions, type GetCommissionsParams } from "@/features/commissions/services/commissionService";

/** Admin ledger listing — `queryKeys.commissions` is the shared prefix, so mutations that
 * invalidate it also invalidate every params variant of this list. */
export function useCommissions(params: GetCommissionsParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.commissions, "list", params] as const,
    queryFn: () => getCommissions(params),
  });
}
