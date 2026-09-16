import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/features/projects/types/project";

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; tone: StatusTone }> = {
  CREATED: { label: PROJECT_STATUS_LABEL.CREATED, tone: "neutral" },
  DOCUMENT_COLLECTION: { label: PROJECT_STATUS_LABEL.DOCUMENT_COLLECTION, tone: "navy" },
  MATERIAL_PLANNING: { label: PROJECT_STATUS_LABEL.MATERIAL_PLANNING, tone: "navy" },
  MATERIAL_DISPATCH: { label: PROJECT_STATUS_LABEL.MATERIAL_DISPATCH, tone: "orange" },
  INSTALLATION: { label: PROJECT_STATUS_LABEL.INSTALLATION, tone: "orange" },
  INSPECTION: { label: PROJECT_STATUS_LABEL.INSPECTION, tone: "amber" },
  NET_METERING: { label: PROJECT_STATUS_LABEL.NET_METERING, tone: "amber" },
  SUBSIDY_PROCESS: { label: PROJECT_STATUS_LABEL.SUBSIDY_PROCESS, tone: "purple" },
  COMPLETED: { label: PROJECT_STATUS_LABEL.COMPLETED, tone: "green" },
};
