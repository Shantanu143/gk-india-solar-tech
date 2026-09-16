import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getFinalConfigurationForSurvey, prepareFinalConfiguration } from "@/features/surveys/services/finalConfigurationService";

export function useFinalConfiguration(surveyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.finalConfiguration(surveyId ?? ""),
    queryFn: () => getFinalConfigurationForSurvey(surveyId as string),
    enabled: !!surveyId,
  });
}

export function usePrepareFinalConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prepareFinalConfiguration,
    onSuccess: (config) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.finalConfiguration(config.surveyId) });
    },
  });
}
