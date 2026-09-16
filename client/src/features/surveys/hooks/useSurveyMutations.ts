import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { completeSurvey, saveSurveyProgress, scheduleSurvey, startSurvey } from "@/features/surveys/services/surveyService";

export function useScheduleSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleSurvey,
    onSuccess: (survey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(survey.leadId) });
    },
  });
}

export function useStartSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startSurvey,
    onSuccess: (survey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys });
      queryClient.invalidateQueries({ queryKey: queryKeys.surveyDetail(survey.id) });
    },
  });
}

export function useSaveSurveyProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSurveyProgress,
    onSuccess: (survey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveyDetail(survey.id) });
    },
  });
}

export function useCompleteSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeSurvey,
    onSuccess: (survey) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.surveys });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities(survey.leadId) });
    },
  });
}
