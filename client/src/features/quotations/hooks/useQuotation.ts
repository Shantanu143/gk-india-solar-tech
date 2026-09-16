import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getQuotation, getQuotationByLeadId } from "@/features/quotations/services/quotationService";

export function useQuotation(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.quotationDetail(id ?? ""),
    queryFn: () => getQuotation(id as string),
    enabled: !!id,
  });
}

export function useQuotationForLead(leadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.quotationForLead(leadId ?? ""),
    queryFn: () => getQuotationByLeadId(leadId as string),
    enabled: !!leadId,
  });
}
