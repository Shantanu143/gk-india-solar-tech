import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getQuotations, type GetQuotationsParams } from "@/features/quotations/services/quotationService";

export function useQuotations(params: GetQuotationsParams = {}) {
  return useQuery({
    queryKey: queryKeys.quotationsList(params),
    queryFn: () => getQuotations(params),
  });
}
