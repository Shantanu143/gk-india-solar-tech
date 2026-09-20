import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { updateCommissionStatus } from "@/features/commissions/services/commissionService";

export function useUpdateCommissionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCommissionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.commissionsMe });
    },
  });
}
