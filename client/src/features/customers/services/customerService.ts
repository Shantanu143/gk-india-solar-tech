import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Customer } from "@/features/customers/types/customer";

export interface GetCustomersParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getCustomers(params: GetCustomersParams = {}): Promise<PaginatedResult<Customer>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize ?? 50));
  if (params.search) search.set("search", params.search);
  return apiRequest<PaginatedResult<Customer>>(`/customers?${search.toString()}`);
}

export async function getCustomer(id: string): Promise<Customer> {
  const { customer } = await apiRequest<{ customer: Customer }>(`/customers/${id}`);
  return customer;
}

export async function getCustomerByLeadId(leadId: string): Promise<Customer | null> {
  const { customer } = await apiRequest<{ customer: Customer | null }>(`/customers/for-lead/${leadId}`);
  return customer;
}
