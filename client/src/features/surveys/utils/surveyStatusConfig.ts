import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import type { SurveyStatus } from "@/features/surveys/types/survey";

export const SURVEY_STATUS_CONFIG: Record<SurveyStatus, { label: string; tone: StatusTone }> = {
  SCHEDULED: { label: "Scheduled", tone: "navy" },
  IN_PROGRESS: { label: "In Progress", tone: "orange" },
  COMPLETED: { label: "Completed", tone: "green" },
};
