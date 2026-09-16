import { projectRepository, type ProjectFilters } from "../repository/project.repository";
import { activityService } from "./activity.service";
import { ApiError } from "../util/ApiError";
import { toPublicProject, type PublicProject } from "../util/serializeProject";
import { canTransitionProject, isTerminalProjectStatus, PROJECT_STATUS_LABEL } from "../util/projectWorkflow";
import type { ProjectStatus, ProjectDocumentFile } from "../models/Project.model";
import type { CustomerDocument } from "../models/Customer.model";
import type { QuotationDocument } from "../models/Quotation.model";
import type { Types } from "mongoose";

export const projectService = {
  async getProjects(filters: ProjectFilters): Promise<PublicProject[]> {
    const items = await projectRepository.list(filters);
    return items.map(toPublicProject);
  },

  async getProject(id: string): Promise<PublicProject> {
    const project = await projectRepository.findById(id);
    if (!project) throw ApiError.notFound("Project not found.");
    return toPublicProject(project);
  },

  async getProjectByCustomerId(customerId: string): Promise<PublicProject | null> {
    const project = await projectRepository.findByCustomerId(customerId);
    return project ? toPublicProject(project) : null;
  },

  /** Called alongside `customerService.createFromLead` when a quotation is accepted. Idempotent. */
  async createFromConversion(input: {
    leadId: string | Types.ObjectId;
    customer: CustomerDocument;
    quotation: QuotationDocument;
    systemCapacityKw: number;
  }): Promise<PublicProject> {
    const existing = await projectRepository.findByCustomerId(input.customer._id.toString());
    if (existing) return toPublicProject(existing);

    const projectNumber = await projectRepository.nextProjectNumber();
    const project = await projectRepository.create({
      projectNumber,
      lead: input.leadId,
      customer: input.customer._id,
      quotation: input.quotation._id,
      status: "CREATED",
      systemCapacityKw: input.systemCapacityKw,
      assignedEmployeeId: input.customer.assignedEmployeeId,
    });
    return toPublicProject(project);
  },

  async updateProjectStatus(input: { id: string; status: ProjectStatus; actorName: string }): Promise<PublicProject> {
    const existing = await projectRepository.findById(input.id);
    if (!existing) throw ApiError.notFound("Project not found.");

    if (isTerminalProjectStatus(existing.status)) {
      throw ApiError.badRequest(`This project is already ${PROJECT_STATUS_LABEL[existing.status]}.`);
    }
    if (!canTransitionProject(existing.status, input.status)) {
      throw ApiError.badRequest(`Cannot move a project from ${PROJECT_STATUS_LABEL[existing.status]} to ${PROJECT_STATUS_LABEL[input.status]}.`);
    }

    const project = await projectRepository.updateById(input.id, {
      status: input.status,
      ...(input.status === "COMPLETED" ? { completedAt: new Date() } : {}),
    });
    if (!project) throw ApiError.notFound("Project not found.");

    await activityService.log({
      leadId: project.lead.toString(),
      type: "STATUS_CHANGED",
      actorName: input.actorName,
      description: `Project status changed to ${PROJECT_STATUS_LABEL[input.status]}`,
    });

    return toPublicProject(project);
  },

  async addDocument(input: { id: string; document: Omit<ProjectDocumentFile, "uploadedAt"> }): Promise<PublicProject> {
    const project = await projectRepository.findById(input.id);
    if (!project) throw ApiError.notFound("Project not found.");

    project.documents.push({ ...input.document, uploadedAt: new Date() });
    await project.save();
    return toPublicProject(project);
  },
};
