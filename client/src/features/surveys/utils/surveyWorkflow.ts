import type { SurveyStatus } from "@/features/surveys/types/survey";

/** Configured state graph for the survey lifecycle — mirrors `leadWorkflow.ts`'s pattern. */
export const SURVEY_STATUS_TRANSITIONS: Record<SurveyStatus, SurveyStatus[]> = {
  SCHEDULED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
};

export function getAllowedNextSurveyStatuses(current: SurveyStatus): SurveyStatus[] {
  return SURVEY_STATUS_TRANSITIONS[current];
}

export function canTransitionSurvey(from: SurveyStatus, to: SurveyStatus): boolean {
  return SURVEY_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
