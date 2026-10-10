import { ErrorState } from "@/features/crm/components/ErrorState";
import { useAuth } from "@/features/crm/hooks/authContext";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useLead } from "@/features/leads/hooks/useLead";
import { FinalConfigurationPanel } from "@/features/surveys/components/FinalConfigurationPanel";
import { StartSurveyPanel } from "@/features/surveys/components/StartSurveyPanel";
import { SurveyForm } from "@/features/surveys/components/SurveyForm";
import { SurveyPhotosPanel } from "@/features/surveys/components/SurveyPhotosPanel";
import { SurveyReport } from "@/features/surveys/components/SurveyReport";
import { SurveyStatusBadge } from "@/features/surveys/components/SurveyStatusBadge";
import { useSurvey } from "@/features/surveys/hooks/useSurvey";

interface SurveyDetailViewProps {
  surveyId: string;
  leadDetailPath: (leadId: string) => string;
}

export function SurveyDetailView({ surveyId, leadDetailPath }: SurveyDetailViewProps) {
  const { user } = useAuth();
  const { data: survey, isLoading, isError, refetch } = useSurvey(surveyId);
  const { data: lead } = useLead(survey?.leadId);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !survey) {
    return <ErrorState title="We couldn't display this survey." description="It may have been removed or the link is incorrect." onRetry={() => refetch()} />;
  }

  // Fieldwork — starting, filling in, uploading photos, completing — is the assigned site engineer's job, and an admin can
  // do it for anyone (the server enforces the same rule). Everyone else sees the report read-only.
  const canPerform = !!user && (user.role === "ADMIN" || user.id === survey.engineerId);
  const engineerName = getEmployeeById(survey.engineerId)?.name ?? "the site engineer";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={survey.customerName}
        description={survey.location.city}
        actions={<SurveyStatusBadge status={survey.status} />}
      />

      {survey.status === "SCHEDULED" &&
        (canPerform && lead ? (
          <StartSurveyPanel survey={survey} lead={lead} leadDetailHref={leadDetailPath(survey.leadId)} />
        ) : (
          <>
            <SurveyReport survey={survey} />
            {!canPerform && <p className="text-sm text-muted-foreground">Waiting for {engineerName} to start this survey.</p>}
          </>
        ))}

      {survey.status === "IN_PROGRESS" &&
        (canPerform ? (
          <SurveyForm survey={survey} />
        ) : (
          <>
            <SurveyReport survey={survey} />
            <p className="text-sm text-muted-foreground">{engineerName} is carrying out this survey.</p>
          </>
        ))}

      {survey.status === "COMPLETED" && (
        <>
          <SurveyReport survey={survey} hidePhotos={canPerform} />
          {canPerform && <SurveyPhotosPanel survey={survey} />}
          {lead && <FinalConfigurationPanel survey={survey} lead={lead} />}
        </>
      )}
    </div>
  );
}
