import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { createPartnerByAdmin, setPartnerStatus } from "@/features/partners/services/adminPartnerService";

export function useSetPartnerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setPartnerStatus,
    onSuccess: (partner) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerDetail(partner.id) });
    },
  });
}

export function useCreatePartnerByAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partners });
    },
  });
}
