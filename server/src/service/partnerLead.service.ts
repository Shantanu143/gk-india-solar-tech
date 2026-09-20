import { PartnerModel, type PartnerDocument } from "../models/Partner.model";
import { CustomerModel } from "../models/Customer.model";
import { ProjectModel } from "../models/Project.model";
import { leadService, type PaginatedLeads } from "./lead.service";
import { notificationService } from "./notification.service";
import { ApiError } from "../util/ApiError";
import { toPublicProject, type PublicProject } from "../util/serializeProject";
import type { PublicLead } from "../util/serializeLead";
import type { CreatePartnerLeadInput, ListPartnerLeadsQuery } from "../validation/partnerLead.validation";

/**
 * There's no shared "resolve the logged-in Partner" helper yet — another engineer is building the
 * full Partner CRUD layer in parallel. Resolving it directly here (rather than depending on their
 * in-flight work) is a small, intentional amount of duplication that keeps the two efforts decoupled.
 */
async function resolvePartner(userId: string): Promise<PartnerDocument> {
  const partner = await PartnerModel.findOne({ user: userId });
  if (!partner) throw ApiError.notFound("Partner profile not found.");
  return partner;
}

function assertApproved(partner: PartnerDocument): void {
  if (partner.applicationStatus !== "APPROVED") {
    throw ApiError.forbidden("Your partner application is still under review.");
  }
}

export const partnerLeadService = {
  async submitLead(userId: string, input: CreatePartnerLeadInput): Promise<PublicLead> {
    const partner = await resolvePartner(userId);
    assertApproved(partner);

    const lead = await leadService.createLead({
      customer: input.customer,
      projectType: input.projectType,
      location: input.location,
      monthlyBill: input.monthlyBill,
      billDocumentName: input.billDocumentName,
      solarRecommendation: input.solarRecommendation,
      source: "REFERRAL",
      partnerId: partner._id.toString(),
      partnerNote: {
        requirement: input.requirement,
        preferredContactTime: input.preferredContactTime,
        remarks: input.remarks,
      },
      actorName: partner.name,
      activityDescription: `Lead submitted by partner ${partner.name}${partner.partnerId ? ` (${partner.partnerId})` : ""}`,
    });

    await notificationService.notifyRoles(["ADMIN", "SALES_MANAGER"], {
      type: "PARTNER_LEAD_SUBMITTED",
      title: "New Partner Lead",
      description: `${lead.customer.fullName} — submitted by ${partner.name}`,
      lead: lead.id,
    });

    return lead;
  },

  async listMyLeads(userId: string, params: ListPartnerLeadsQuery): Promise<PaginatedLeads> {
    const partner = await resolvePartner(userId);
    return leadService.getLeads({ ...params, partnerId: partner._id.toString() });
  },

  async getMyLead(userId: string, leadId: string): Promise<{ lead: PublicLead; project: PublicProject | null }> {
    const partner = await resolvePartner(userId);
    const lead = await leadService.getLead(leadId);

    // Never confirm another partner's lead exists by distinguishing "not yours" from "no such lead".
    if (lead.partnerId !== partner._id.toString()) {
      throw ApiError.notFound("Lead not found.");
    }

    const customer = await CustomerModel.findOne({ lead: leadId });
    const project = customer ? await ProjectModel.findOne({ customer: customer._id }) : null;

    return { lead, project: project ? toPublicProject(project) : null };
  },
};
