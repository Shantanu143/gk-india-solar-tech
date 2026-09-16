import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getCustomer, getCustomerByLeadId, getCustomers, type GetCustomersParams } from "@/features/customers/services/customerService";

export function useCustomers(params: GetCustomersParams = {}) {
  return useQuery({
    queryKey: queryKeys.customersList(params),
    queryFn: () => getCustomers(params),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.customerDetail(id ?? ""),
    queryFn: () => getCustomer(id as string),
    enabled: !!id,
  });
}

export function useCustomerForLead(leadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.customerForLead(leadId ?? ""),
    queryFn: () => getCustomerByLeadId(leadId as string),
    enabled: !!leadId,
  });
}
