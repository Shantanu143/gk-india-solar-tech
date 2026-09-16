import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getSurvey, getSurveyByLeadId } from "@/features/surveys/services/surveyService";

export function useSurvey(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.surveyDetail(id ?? ""),
    queryFn: () => getSurvey(id as string),
    enabled: !!id,
  });
}

export function useSurveyForLead(leadId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.surveyForLead(leadId ?? ""),
    queryFn: () => getSurveyByLeadId(leadId as string),
    enabled: !!leadId,
  });
}
