import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { submitPartnerLead } from "@/features/partners/services/partnerService";

export function useSubmitPartnerLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitPartnerLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerLeads });
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerDashboard });
    },
  });
}
