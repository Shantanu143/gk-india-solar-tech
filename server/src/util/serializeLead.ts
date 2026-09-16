import type { LeadDocument } from "../models/Lead.model";

export function toPublicLead(lead: LeadDocument) {
  return {
    id: lead._id.toString(),
    leadId: lead.leadId,
    customer: lead.customer,
    projectType: lead.projectType,
    location: lead.location,
    monthlyBill: lead.monthlyBill,
    billDocumentName: lead.billDocumentName,
    solarRecommendation: lead.solarRecommendation,
    source: lead.source,
    status: lead.status,
    interest: lead.interest,
    priority: lead.priority,
    assignedEmployeeId: lead.assignedEmployeeId ? lead.assignedEmployeeId.toString() : null,
    lostReason: lead.lostReason,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export type PublicLead = ReturnType<typeof toPublicLead>;
