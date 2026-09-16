import { Link, useLocation } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { Lead } from "@/features/leads/types/lead";
import { FinalConfigurationPanel } from "@/features/surveys/components/FinalConfigurationPanel";
import { SurveyReport } from "@/features/surveys/components/SurveyReport";
import { SurveyStatusBadge } from "@/features/surveys/components/SurveyStatusBadge";
import { useSurveyForLead } from "@/features/surveys/hooks/useSurvey";
import { formatDate, formatTime } from "@/lib/format";

export function LeadSurveyTab({ lead }: { lead: Lead }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { data: survey, isLoading } = useSurveyForLead(lead.id);

  if (isLoading) return <SkeletonRows rows={4} />;

  if (!survey) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No site survey yet"
        description="Schedule a site survey from the actions above once this lead has been followed up."
      />
    );
  }

  const detailHref = isAdmin ? CRM_ROUTES.adminSurveyDetail(survey.id) : CRM_ROUTES.employeeSurveyDetail(survey.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(`${survey.date}T00:00:00`)} · {formatTime(`${survey.date}T${survey.time}:00`)}
          </p>
          <div className="mt-1">
            <SurveyStatusBadge status={survey.status} />
          </div>
        </div>
        <Link to={detailHref} className="text-sm font-semibold text-navy hover:text-orange">
          View Survey Details
        </Link>
      </div>

      {survey.status === "COMPLETED" && (
        <>
          <SurveyReport survey={survey} />
          <FinalConfigurationPanel survey={survey} lead={lead} />
        </>
      )}
    </div>
  );
}
