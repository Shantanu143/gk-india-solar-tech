import { leadRepository, type GetLeadsParams } from "../repository/lead.repository";
import { activityService } from "./activity.service";
import { notificationService } from "./notification.service";
import { ApiError } from "../util/ApiError";
import { toPublicLead, type PublicLead } from "../util/serializeLead";
import { canTransitionLead, isTerminalLeadStatus } from "../util/leadWorkflow";
import { LEAD_STATUS_LABEL } from "../util/leadStatusLabels";
import type { LeadCustomer, LeadInterest, LeadLocation, LeadPriority, LeadSource, LeadStatus, LostReason, ProjectType, SolarRecommendation } from "../models/Lead.model";

export interface PaginatedLeads {
  items: PublicLead[];
  total: number;
  page: number;
  pageSize: number;
}

export const leadService = {
  async getLeads(params: GetLeadsParams): Promise<PaginatedLeads> {
    const { items, total } = await leadRepository.list(params);
    return { items: items.map(toPublicLead), total, page: params.page, pageSize: params.pageSize };
  },

  async getLead(id: string): Promise<PublicLead> {
    const lead = await leadRepository.findById(id);
    if (!lead) throw ApiError.notFound("Lead not found.");
    return toPublicLead(lead);
  },

  async createLead(input: {
    customer: LeadCustomer;
    projectType: ProjectType;
    location: LeadLocation;
    monthlyBill: number;
    billDocumentName?: string;
    solarRecommendation: SolarRecommendation;
    source: LeadSource;
  }): Promise<PublicLead> {
    const leadId = await leadRepository.nextLeadId();
    const lead = await leadRepository.create({
      leadId,
      customer: input.customer,
      projectType: input.projectType,
      location: input.location,
      monthlyBill: input.monthlyBill,
      billDocumentName: input.billDocumentName,
      solarRecommendation: input.solarRecommendation,
      source: input.source,
      status: "NEW",
      interest: "MEDIUM",
      priority: "MEDIUM",
      assignedEmployeeId: null,
    });
    await activityService.log({
      leadId: lead._id.toString(),
      type: "LEAD_CREATED",
      actorName: "System",
      description: "Lead created from website solar estimate",
    });
    return toPublicLead(lead);
  },

  async assignLead(input: { leadId: string; employeeId: string; priority?: LeadPriority; actorName: string; employeeName: string }): Promise<PublicLead> {
    const lead = await leadRepository.updateById(input.leadId, {
      assignedEmployeeId: input.employeeId,
      ...(input.priority ? { priority: input.priority } : {}),
    });
    if (!lead) throw ApiError.notFound("Lead not found.");

    await activityService.log({
      leadId: lead._id.toString(),
      type: "LEAD_ASSIGNED",
      actorName: input.actorName,
      description: `Lead assigned to ${input.employeeName}`,
    });
    await notificationService.notify({
      recipient: input.employeeId,
      type: "LEAD_ASSIGNED",
      title: "New Lead Assigned",
      description: `${lead.customer.fullName} — ${lead.projectType} · ${lead.solarRecommendation.recommendedCapacity} kW`,
      lead: lead._id,
    });
    return toPublicLead(lead);
  },

  async updateLeadStatus(input: { leadId: string; status: LeadStatus; actorName: string; lostReason?: LostReason }): Promise<PublicLead> {
    const existing = await leadRepository.findById(input.leadId);
    if (!existing) throw ApiError.notFound("Lead not found.");

    if (isTerminalLeadStatus(existing.status)) {
      throw ApiError.badRequest(`This lead is already ${LEAD_STATUS_LABEL[existing.status]} and cannot change status further.`);
    }
    if (!canTransitionLead(existing.status, input.status)) {
      throw ApiError.badRequest(`Cannot move a lead from ${LEAD_STATUS_LABEL[existing.status]} to ${LEAD_STATUS_LABEL[input.status]}.`);
    }

    const previousStatus = existing.status;
    const lead = await leadRepository.updateById(input.leadId, {
      status: input.status,
      ...(input.status === "LOST" ? { lostReason: input.lostReason } : {}),
    });
    if (!lead) throw ApiError.notFound("Lead not found.");

    await activityService.log({
      leadId: lead._id.toString(),
      type: "STATUS_CHANGED",
      actorName: input.actorName,
      description: `Status changed from ${LEAD_STATUS_LABEL[previousStatus]} to ${LEAD_STATUS_LABEL[input.status]}`,
    });
    if (input.status === "LOST" && input.lostReason) {
      await activityService.log({
        leadId: lead._id.toString(),
        type: "LEAD_LOST",
        actorName: input.actorName,
        description: `Lead marked Lost — Reason: ${input.lostReason}`,
      });
    }
    return toPublicLead(lead);
  },

  async addRemark(input: { leadId: string; remark: string; actorName: string; interest?: LeadInterest }): Promise<PublicLead> {
    const lead = await leadRepository.updateById(input.leadId, input.interest ? { interest: input.interest } : {});
    if (!lead) throw ApiError.notFound("Lead not found.");

    await activityService.log({ leadId: lead._id.toString(), type: "REMARK_ADDED", actorName: input.actorName, description: input.remark });
    return toPublicLead(lead);
  },

  /** Internal — called by surveyService/quotationService to advance a lead's status as a side effect, without the caller needing to re-validate the transition graph itself. */
  async advanceStatusInternal(leadId: string, status: LeadStatus, actorName: string): Promise<PublicLead> {
    return leadService.updateLeadStatus({ leadId, status, actorName });
  },
};
