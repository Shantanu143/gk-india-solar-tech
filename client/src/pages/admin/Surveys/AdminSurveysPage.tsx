import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { SurveysList } from "@/features/surveys/components/SurveysList";

export function AdminSurveysPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="Site Surveys | GK India SolarTech CRM" description="All site surveys." path={CRM_ROUTES.adminSurveys} noindex />
      <PageHeader title="Site Surveys" description="Every site survey scheduled across the company." />
      <SurveysList detailPath={CRM_ROUTES.adminSurveyDetail} showStartAction={false} initialScope="all" />
    </div>
  );
}
