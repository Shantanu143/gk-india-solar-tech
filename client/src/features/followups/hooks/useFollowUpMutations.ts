import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import {
  cancelFollowUp,
  completeFollowUp,
  createFollowUp,
  rescheduleFollowUp,
} from "@/features/followups/services/followUpService";

export function useCreateFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFollowUp,
    onSuccess: (followUp) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.followUps });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(followUp.leadId) });
    },
  });
}

export function useCompleteFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeFollowUp,
    onSuccess: ({ completed }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.followUps });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(completed.leadId) });
    },
  });
}

export function useRescheduleFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleFollowUp,
    onSuccess: (followUp) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.followUps });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(followUp.leadId) });
    },
  });
}

export function useCancelFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelFollowUp,
    onSuccess: (followUp) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.followUps });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(followUp.leadId) });
    },
  });
}
