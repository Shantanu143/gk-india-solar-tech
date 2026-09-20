import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { createCommissionRule, updateCommissionRule } from "@/features/commissions/services/commissionService";

export function useCreateCommissionRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommissionRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.commissionRules }),
  });
}

export function useUpdateCommissionRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCommissionRule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.commissionRules }),
  });
}
