import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { LeadDetailView } from "@/features/leads/components/LeadDetailView";

export function EmployeeLeadDetailPage() {
  const { leadId = "" } = useParams<{ leadId: string }>();

  return (
    <>
      <Seo title="Lead Details | GK India SolarTech CRM" description="Lead detail." path={CRM_ROUTES.employeeLeadDetail(leadId)} noindex />
      <LeadDetailView leadId={leadId} backHref={CRM_ROUTES.employeeLeads} />
    </>
  );
}
