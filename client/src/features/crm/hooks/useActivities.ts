import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getLeadActivities } from "@/features/crm/services/activityService";

export function useActivities(leadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activities(leadId ?? ""),
    queryFn: () => getLeadActivities(leadId as string),
    enabled: !!leadId,
  });
}
