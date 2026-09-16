import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { ProjectsList } from "@/features/projects/components/ProjectsList";

export function EmployeeProjectsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Projects | GK India SolarTech CRM" description="Installation projects on my leads." path={CRM_ROUTES.employeeProjects} noindex />
      <PageHeader title="My Projects" description="Track installations from document collection through subsidy processing." />
      <ProjectsList detailPath={CRM_ROUTES.employeeProjectDetail} />
    </div>
  );
}
