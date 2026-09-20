import { apiRequest } from "@/services/apiClient";
import type { CustomerInquiry } from "@/features/customerInquiries/types/inquiry";

export async function getMyInquiries(): Promise<CustomerInquiry[]> {
  const { items } = await apiRequest<{ items: CustomerInquiry[] }>("/leads/me");
  return items;
}
