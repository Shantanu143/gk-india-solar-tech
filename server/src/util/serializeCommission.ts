import type { CommissionDocument } from "../models/Commission.model";

export function toPublicCommission(commission: CommissionDocument) {
  return {
    id: commission._id.toString(),
    partnerId: commission.partnerId.toString(),
    leadId: commission.leadId.toString(),
    projectId: commission.projectId ? commission.projectId.toString() : null,
    commissionRuleId: commission.commissionRuleId.toString(),
    systemCapacityKw: commission.systemCapacityKw,
    bookingAmount: commission.bookingAmount,
    commissionType: commission.commissionType,
    percent: commission.percent,
    fixedAmount: commission.fixedAmount,
    commissionAmount: commission.commissionAmount,
    status: commission.status,
    paymentDate: commission.paymentDate ? commission.paymentDate.toISOString() : undefined,
    paymentReference: commission.paymentReference,
    createdAt: commission.createdAt.toISOString(),
    updatedAt: commission.updatedAt.toISOString(),
  };
}

export type PublicCommission = ReturnType<typeof toPublicCommission>;
