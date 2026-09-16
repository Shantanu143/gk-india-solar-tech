import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { SurveysList } from "@/features/surveys/components/SurveysList";

export function EmployeeSurveysPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Surveys | GK India SolarTech CRM" description="My site surveys." path={CRM_ROUTES.employeeSurveys} noindex />
      <PageHeader title="My Surveys" description="Site surveys assigned to you or scheduled on your leads." />
      <SurveysList relevantToEmployeeId={user?.id} detailPath={CRM_ROUTES.employeeSurveyDetail} />
    </div>
  );
}
