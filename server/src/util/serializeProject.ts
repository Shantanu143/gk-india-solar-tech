import type { ProjectDocument } from "../models/Project.model";

export function toPublicProject(project: ProjectDocument) {
  return {
    id: project._id.toString(),
    projectNumber: project.projectNumber,
    leadId: project.lead.toString(),
    customerId: project.customer.toString(),
    quotationId: project.quotation.toString(),
    status: project.status,
    systemCapacityKw: project.systemCapacityKw,
    assignedEmployeeId: project.assignedEmployeeId ? project.assignedEmployeeId.toString() : null,
    documents: project.documents,
    completedAt: project.completedAt ? project.completedAt.toISOString() : undefined,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export type PublicProject = ReturnType<typeof toPublicProject>;
