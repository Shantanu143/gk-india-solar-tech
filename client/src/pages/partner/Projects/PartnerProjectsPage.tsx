import { Seo } from "@/components/layout/Seo";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { usePartnerProjects } from "@/features/partners/hooks/usePartnerProjects";
import { formatDate } from "@/lib/format";
import { FolderKanban } from "lucide-react";

export function PartnerProjectsPage() {
  const { data: projects = [], isLoading, isError, refetch } = usePartnerProjects();

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title="My Projects | Partner Portal | GK India SolarTech"
        description="Installation and EPC projects assigned to you."
        path={CRM_ROUTES.partnerProjects}
        noindex
      />
      <PageHeader title="My Projects" description="Projects GK India SolarTech has assigned to you for execution." />

      {isLoading ? (
        <Card className="p-2 sm:p-4">
          <SkeletonRows rows={4} className="p-4" />
        </Card>
      ) : isError ? (
        <ErrorState title="Couldn't load your projects." onRetry={() => refetch()} />
      ) : projects.length === 0 ? (
        <Card className="p-2 sm:p-4">
          <EmptyState
            icon={FolderKanban}
            title="No projects assigned yet"
            description="Sales/Referral partners don't receive project assignments — this fills up once GK India SolarTech assigns you an installation or EPC project to execute."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col gap-3 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-xs font-semibold text-muted-foreground">{project.projectNumber}</p>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="text-lg font-bold text-navy">{project.systemCapacityKw} kW System</p>
              <dl className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <dt>Started</dt>
                  <dd className="text-foreground/80">{formatDate(project.createdAt)}</dd>
                </div>
                {project.completedAt && (
                  <div className="flex items-center justify-between">
                    <dt>Completed</dt>
                    <dd className="text-foreground/80">{formatDate(project.completedAt)}</dd>
                  </div>
                )}
              </dl>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
