import { CommissionRuleModel, type CommissionRuleAttrs, type PaymentTrigger } from "../models/CommissionRule.model";
import type { PartnerType } from "../models/Partner.model";
import type { ProjectType } from "../models/Lead.model";

export interface CreateCommissionRuleInput extends Omit<CommissionRuleAttrs, "createdAt" | "updatedAt" | "active"> {
  active?: boolean;
}

export type UpdateCommissionRuleInput = Partial<Omit<CommissionRuleAttrs, "createdAt" | "updatedAt">>;

export interface MatchRuleParams {
  partnerType: PartnerType;
  paymentTrigger: PaymentTrigger;
  projectType: ProjectType;
  systemCapacityKw: number;
}

export const commissionRuleRepository = {
  create(input: CreateCommissionRuleInput) {
    return CommissionRuleModel.create(input);
  },

  findById(id: string) {
    return CommissionRuleModel.findById(id);
  },

  /** Admin config list — small by nature, no pagination needed. */
  list() {
    return CommissionRuleModel.find().sort({ createdAt: -1 });
  },

  updateById(id: string, updates: UpdateCommissionRuleInput) {
    return CommissionRuleModel.findByIdAndUpdate(id, updates, { new: true });
  },

  /** Candidate active rules for a lead/trigger; the service picks the most specific match. */
  findMatchingRules(params: MatchRuleParams) {
    return CommissionRuleModel.find({
      partnerType: params.partnerType,
      paymentTrigger: params.paymentTrigger,
      active: true,
      $and: [
        { $or: [{ minSystemCapacityKw: { $exists: false } }, { minSystemCapacityKw: { $lte: params.systemCapacityKw } }] },
        { $or: [{ applicableProjectType: { $exists: false } }, { applicableProjectType: params.projectType }] },
      ],
    });
  },
};
