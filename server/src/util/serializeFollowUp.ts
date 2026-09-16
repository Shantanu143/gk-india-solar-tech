import type { FollowUpDocument } from "../models/FollowUp.model";

export function toPublicFollowUp(followUp: FollowUpDocument) {
  return {
    id: followUp._id.toString(),
    leadId: followUp.lead.toString(),
    customerName: followUp.customerName,
    assignedEmployeeId: followUp.assignedEmployeeId.toString(),
    type: followUp.type,
    date: followUp.date,
    time: followUp.time,
    status: followUp.status,
    priority: followUp.priority,
    notes: followUp.notes,
    outcome: followUp.outcome,
    rescheduledFrom: followUp.rescheduledFrom,
    createdBy: followUp.createdBy,
    completedAt: followUp.completedAt ? followUp.completedAt.toISOString() : undefined,
    createdAt: followUp.createdAt.toISOString(),
    updatedAt: followUp.updatedAt.toISOString(),
  };
}

export type PublicFollowUp = ReturnType<typeof toPublicFollowUp>;
