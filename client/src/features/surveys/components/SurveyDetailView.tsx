import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useLead } from "@/features/leads/hooks/useLead";
import { FinalConfigurationPanel } from "@/features/surveys/components/FinalConfigurationPanel";
import { StartSurveyPanel } from "@/features/surveys/components/StartSurveyPanel";
import { SurveyForm } from "@/features/surveys/components/SurveyForm";
import { SurveyReport } from "@/features/surveys/components/SurveyReport";
import { SurveyStatusBadge } from "@/features/surveys/components/SurveyStatusBadge";
import { useSurvey } from "@/features/surveys/hooks/useSurvey";

interface SurveyDetailViewProps {
  surveyId: string;
  /** Admins review surveys read-only — starting and filling the on-site form is the engineer's job. */
  variant: "employee" | "admin";
  leadDetailPath: (leadId: string) => string;
}

export function SurveyDetailView({ surveyId, variant, leadDetailPath }: SurveyDetailViewProps) {
  const { data: survey, isLoading, isError, refetch } = useSurvey(surveyId);
  const { data: lead } = useLead(survey?.leadId);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !survey) {
    return <ErrorState title="We couldn't display this survey." description="It may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={survey.customerName}
        description={survey.location.city}
        actions={<SurveyStatusBadge status={survey.status} />}
      />

      {survey.status === "SCHEDULED" &&
        (variant === "employee" && lead ? (
          <StartSurveyPanel survey={survey} lead={lead} leadDetailHref={leadDetailPath(survey.leadId)} />
        ) : (
          <SurveyReport survey={survey} />
        ))}

      {survey.status === "IN_PROGRESS" && (variant === "employee" ? <SurveyForm survey={survey} /> : <SurveyReport survey={survey} />)}

      {survey.status === "COMPLETED" && (
        <>
          <SurveyReport survey={survey} />
          {lead && <FinalConfigurationPanel survey={survey} lead={lead} />}
        </>
      )}
    </div>
  );
}
