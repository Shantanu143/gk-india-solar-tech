import { apiRequest } from "@/services/apiClient";
import type { Activity } from "@/features/crm/types/activity";

export async function getLeadActivities(leadId: string): Promise<Activity[]> {
  return apiRequest<Activity[]>(`/leads/${leadId}/activities`);
}
