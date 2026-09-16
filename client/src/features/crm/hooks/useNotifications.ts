import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getNotifications, markNotificationRead } from "@/features/crm/services/notificationService";

export function useNotifications() {
  // No push/websocket layer yet — poll so a newly assigned lead or scheduled survey shows up
  // without the user needing to refresh the page.
  return useQuery({ queryKey: queryKeys.notifications, queryFn: getNotifications, refetchInterval: 30_000 });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications }),
  });
}
