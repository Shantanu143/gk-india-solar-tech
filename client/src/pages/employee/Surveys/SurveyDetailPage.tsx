import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { SurveyDetailView } from "@/features/surveys/components/SurveyDetailView";

export function SurveyDetailPage() {
  const { surveyId = "" } = useParams<{ surveyId: string }>();

  return (
    <>
      <Seo title="Survey Details | GK India SolarTech CRM" description="Site survey detail." path={CRM_ROUTES.employeeSurveyDetail(surveyId)} noindex />
      <SurveyDetailView surveyId={surveyId} variant="employee" leadDetailPath={CRM_ROUTES.employeeLeadDetail} />
    </>
  );
}
