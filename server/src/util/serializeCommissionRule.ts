import type { CommissionRuleDocument } from "../models/CommissionRule.model";

export function toPublicCommissionRule(rule: CommissionRuleDocument) {
  return {
    id: rule._id.toString(),
    partnerType: rule.partnerType,
    commissionType: rule.commissionType,
    percent: rule.percent,
    fixedAmount: rule.fixedAmount,
    applicableProjectType: rule.applicableProjectType,
    minSystemCapacityKw: rule.minSystemCapacityKw,
    paymentTrigger: rule.paymentTrigger,
    active: rule.active,
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  };
}

export type PublicCommissionRule = ReturnType<typeof toPublicCommissionRule>;
