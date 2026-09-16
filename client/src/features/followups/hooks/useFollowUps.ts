import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getFollowUps } from "@/features/followups/services/followUpService";
import type { FollowUpFilters } from "@/features/followups/types/followUp";

export function useFollowUps(filters: FollowUpFilters = {}) {
  return useQuery({
    queryKey: queryKeys.followUpsList(filters),
    queryFn: () => getFollowUps(filters),
  });
}
