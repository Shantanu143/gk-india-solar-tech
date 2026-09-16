import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { ProjectDetailView } from "@/features/projects/components/ProjectDetailView";

export function AdminProjectDetailPage() {
  const { projectId = "" } = useParams<{ projectId: string }>();

  return (
    <>
      <Seo title="Project Details | GK India SolarTech CRM" description="Installation project detail." path={CRM_ROUTES.adminProjectDetail(projectId)} noindex />
      <ProjectDetailView projectId={projectId} leadDetailPath={CRM_ROUTES.adminLeadDetail} canManage />
    </>
  );
}
