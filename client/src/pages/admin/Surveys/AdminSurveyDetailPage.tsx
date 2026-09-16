import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { SurveyDetailView } from "@/features/surveys/components/SurveyDetailView";

export function AdminSurveyDetailPage() {
  const { surveyId = "" } = useParams<{ surveyId: string }>();

  return (
    <>
      <Seo title="Survey Details | GK India SolarTech CRM" description="Site survey detail." path={CRM_ROUTES.adminSurveyDetail(surveyId)} noindex />
      <SurveyDetailView surveyId={surveyId} variant="admin" leadDetailPath={CRM_ROUTES.adminLeadDetail} />
    </>
  );
}
