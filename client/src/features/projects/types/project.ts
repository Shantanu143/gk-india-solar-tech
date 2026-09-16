export const PROJECT_STATUSES = [
  "CREATED",
  "DOCUMENT_COLLECTION",
  "MATERIAL_PLANNING",
  "MATERIAL_DISPATCH",
  "INSTALLATION",
  "INSPECTION",
  "NET_METERING",
  "SUBSIDY_PROCESS",
  "COMPLETED",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectDocumentFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  leadId: string;
  customerId: string;
  quotationId: string;
  status: ProjectStatus;
  systemCapacityKw: number;
  assignedEmployeeId: string | null;
  documents: ProjectDocumentFile[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
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
