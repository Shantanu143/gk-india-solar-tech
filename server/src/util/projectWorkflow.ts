import type { ProjectStatus } from "../models/Project.model";

/** Mirrors `client/src/features/projects/utils/projectWorkflow.ts` exactly — a strict linear pipeline, no branches. */
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

export function canTransitionProject(from: ProjectStatus, to: ProjectStatus): boolean {
  return PROJECT_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedNextProjectStatuses(current: ProjectStatus): ProjectStatus[] {
  return PROJECT_STATUS_TRANSITIONS[current] ?? [];
}

export function isTerminalProjectStatus(status: ProjectStatus): boolean {
  return status === "COMPLETED";
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  CREATED: "Created",
  DOCUMENT_COLLECTION: "Document Collection",
  MATERIAL_PLANNING: "Material Planning",
  MATERIAL_DISPATCH: "Material Dispatch",
  INSTALLATION: "Installation",
  INSPECTION: "Inspection",
  NET_METERING: "Net Metering",
  SUBSIDY_PROCESS: "Subsidy Process",
  COMPLETED: "Completed",
};
