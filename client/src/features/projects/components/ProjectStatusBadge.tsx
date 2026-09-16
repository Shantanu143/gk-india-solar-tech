import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { PROJECT_STATUS_CONFIG } from "@/features/projects/utils/projectStatusConfig";
import type { ProjectStatus } from "@/features/projects/types/project";

export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const config = PROJECT_STATUS_CONFIG[status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
