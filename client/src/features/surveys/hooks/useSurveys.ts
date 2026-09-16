import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getSurveys, type GetSurveysParams } from "@/features/surveys/services/surveyService";

export function useSurveys(params: GetSurveysParams = {}) {
  return useQuery({
    queryKey: queryKeys.surveysList(params),
    queryFn: () => getSurveys(params),
  });
}
