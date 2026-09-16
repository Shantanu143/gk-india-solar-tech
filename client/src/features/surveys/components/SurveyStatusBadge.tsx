import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { SURVEY_STATUS_CONFIG } from "@/features/surveys/utils/surveyStatusConfig";
import type { SurveyStatus } from "@/features/surveys/types/survey";

export function SurveyStatusBadge({ status, className }: { status: SurveyStatus; className?: string }) {
  const config = SURVEY_STATUS_CONFIG[status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
