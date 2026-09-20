import { Types } from "mongoose";
import { projectRepository, type ProjectFilters } from "../repository/project.repository";
import { leadRepository } from "../repository/lead.repository";
import { quotationRepository } from "../repository/quotation.repository";
import { activityService } from "./activity.service";
import { commissionService } from "./commission.service";
import { notificationService } from "./notification.service";
import { PartnerModel } from "../models/Partner.model";
import { ApiError } from "../util/ApiError";
import { toPublicProject, type PublicProject } from "../util/serializeProject";
import { canTransitionProject, isTerminalProjectStatus, PROJECT_STATUS_LABEL } from "../util/projectWorkflow";
import type { ProjectStatus, ProjectDocumentFile } from "../models/Project.model";
import type { CustomerDocument } from "../models/Customer.model";
import type { QuotationDocument } from "../models/Quotation.model";

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

    // Project completion is the "ON_PROJECT_COMPLETED" commission trigger for a partner-sourced
    // lead — evaluateForLead is idempotent, so a lead already paid out on booking is a safe no-op.
    if (input.status === "COMPLETED") {
      const lead = await leadRepository.findById(project.lead.toString());
      if (lead?.partnerId) {
        const [partner, quotation] = await Promise.all([
          PartnerModel.findById(lead.partnerId),
          quotationRepository.findById(project.quotation.toString()),
        ]);
        if (partner && quotation) {
          await commissionService.evaluateForLead({
            leadId: project.lead.toString(),
            partnerId: lead.partnerId.toString(),
            partnerType: partner.type,
            projectType: lead.projectType,
            systemCapacityKw: project.systemCapacityKw,
            bookingAmount: quotation.totalAmount,
            trigger: "ON_PROJECT_COMPLETED",
            projectId: project._id.toString(),
          });
        }
      }
    }

    return toPublicProject(project);
  },

  async addDocument(input: { id: string; document: Omit<ProjectDocumentFile, "uploadedAt"> }): Promise<PublicProject> {
    const project = await projectRepository.findById(input.id);
    if (!project) throw ApiError.notFound("Project not found.");

    project.documents.push({ ...input.document, uploadedAt: new Date() });
    await project.save();
    return toPublicProject(project);
  },

  /** Assigns (or unassigns, with `partnerId: null`) an Installation/Service or EPC partner to execute this project. */
  async assignToPartner(input: { id: string; partnerId: string | null; actorName: string }): Promise<PublicProject> {
    const partner = input.partnerId ? await PartnerModel.findById(input.partnerId) : null;
    if (input.partnerId && !partner) throw ApiError.notFound("Partner not found.");

    const project = await projectRepository.updateById(input.id, {
      assignedPartnerId: input.partnerId ? new Types.ObjectId(input.partnerId) : null,
    });
    if (!project) throw ApiError.notFound("Project not found.");

    await activityService.log({
      leadId: project.lead.toString(),
      type: "STATUS_CHANGED",
      actorName: input.actorName,
      description: partner ? `Project assigned to partner ${partner.name}${partner.partnerId ? ` (${partner.partnerId})` : ""}` : "Project unassigned from partner",
    });

    if (partner) {
      await notificationService.notify({
        recipient: partner.user.toString(),
        type: "PARTNER_PROJECT_ASSIGNED",
        title: "Project Assigned",
        description: `Project ${project.projectNumber} (${project.systemCapacityKw} kW) has been assigned to you.`,
      });
    }

    return toPublicProject(project);
  },

  async getProjectsForPartner(partnerId: string): Promise<PublicProject[]> {
    const items = await projectRepository.list({ assignedPartnerId: partnerId });
    return items.map(toPublicProject);
  },
};
