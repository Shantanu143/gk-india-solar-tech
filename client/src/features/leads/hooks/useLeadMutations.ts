import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { addRemark, assignLead, updateLeadStatus } from "@/features/leads/services/leadService";

export function useAssignLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignLead,
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(lead.id) });
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(lead.id) });
    },
  });
}

export function useAddRemark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRemark,
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(lead.id) });
    },
  });
}
