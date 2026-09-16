import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { ProjectsList } from "@/features/projects/components/ProjectsList";

export function AdminProjectsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="Projects | GK India SolarTech CRM" description="Installation projects for converted customers." path={CRM_ROUTES.adminProjects} noindex />
      <PageHeader title="Projects" description="Track every installation from document collection through subsidy processing." />
      <ProjectsList detailPath={CRM_ROUTES.adminProjectDetail} />
    </div>
  );
}
