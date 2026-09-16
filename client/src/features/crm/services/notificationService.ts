import { apiRequest } from "@/services/apiClient";
import type { CrmNotification } from "@/features/crm/types/notification";

export async function getNotifications(): Promise<CrmNotification[]> {
  return apiRequest<CrmNotification[]>("/notifications");
}

export async function markNotificationRead(id: string): Promise<CrmNotification> {
  return apiRequest<CrmNotification>(`/notifications/${id}/read`, { method: "PATCH" });
}
