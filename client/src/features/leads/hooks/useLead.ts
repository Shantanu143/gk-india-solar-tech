import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getLead } from "@/features/leads/services/leadService";

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.leadDetail(id ?? ""),
    queryFn: () => getLead(id as string),
    enabled: !!id,
  });
}
