import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import {
  acceptQuotation,
  createQuotation,
  rejectQuotation,
  sendQuotation,
  updateQuotationItems,
} from "@/features/quotations/services/quotationService";

function invalidateAllFor(queryClient: ReturnType<typeof useQueryClient>, quotation: { id: string; leadId: string }) {
  queryClient.invalidateQueries({ queryKey: queryKeys.quotations });
  queryClient.invalidateQueries({ queryKey: queryKeys.quotationDetail(quotation.id) });
  queryClient.invalidateQueries({ queryKey: queryKeys.quotationForLead(quotation.leadId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.leads });
  queryClient.invalidateQueries({ queryKey: queryKeys.leadDetail(quotation.leadId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.activities(quotation.leadId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuotation,
    onSuccess: (quotation) => invalidateAllFor(queryClient, quotation),
  });
}

export function useUpdateQuotationItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuotationItems,
    onSuccess: (quotation) => invalidateAllFor(queryClient, quotation),
  });
}

export function useSendQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendQuotation,
    onSuccess: (quotation) => invalidateAllFor(queryClient, quotation),
  });
}

export function useAcceptQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptQuotation,
    onSuccess: (quotation) => invalidateAllFor(queryClient, quotation),
  });
}

export function useRejectQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectQuotation,
    onSuccess: (quotation) => invalidateAllFor(queryClient, quotation),
  });
}
