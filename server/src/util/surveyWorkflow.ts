import type { SurveyStatus } from "../models/Survey.model";

/** Mirrors `client/src/features/surveys/utils/surveyWorkflow.ts` exactly. */
export const SURVEY_STATUS_TRANSITIONS: Record<SurveyStatus, SurveyStatus[]> = {
  SCHEDULED: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
};

export function canTransitionSurvey(from: SurveyStatus, to: SurveyStatus): boolean {
  return SURVEY_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
