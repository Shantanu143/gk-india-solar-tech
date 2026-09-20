import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { updateMyPartnerProfile } from "@/features/partners/services/partnerService";

export function useUpdatePartnerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyPartnerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerMe });
    },
  });
}
