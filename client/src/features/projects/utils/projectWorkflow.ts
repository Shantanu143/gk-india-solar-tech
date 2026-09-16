import { PROJECT_STATUSES, type ProjectStatus } from "@/features/projects/types/project";

/** Mirrors `server/src/util/projectWorkflow.ts` exactly — a strict linear pipeline, no branches. */
export const PROJECT_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  CREATED: ["DOCUMENT_COLLECTION"],
  DOCUMENT_COLLECTION: ["MATERIAL_PLANNING"],
  MATERIAL_PLANNING: ["MATERIAL_DISPATCH"],
  MATERIAL_DISPATCH: ["INSTALLATION"],
  INSTALLATION: ["INSPECTION"],
  INSPECTION: ["NET_METERING"],
  NET_METERING: ["SUBSIDY_PROCESS"],
  SUBSIDY_PROCESS: ["COMPLETED"],
  COMPLETED: [],
};

export function getAllowedNextProjectStatuses(current: ProjectStatus): ProjectStatus[] {
  return PROJECT_STATUS_TRANSITIONS[current] ?? [];
}

export function isTerminalProjectStatus(status: ProjectStatus): boolean {
  return status === "COMPLETED";
}

/** Position in the pipeline, 0-based — drives the progress bar. */
export function projectStatusIndex(status: ProjectStatus): number {
  return PROJECT_STATUSES.indexOf(status);
}
