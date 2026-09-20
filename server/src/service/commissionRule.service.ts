import { commissionRuleRepository } from "../repository/commissionRule.repository";
import { ApiError } from "../util/ApiError";
import { toPublicCommissionRule, type PublicCommissionRule } from "../util/serializeCommissionRule";
import type { CreateCommissionRuleInput, UpdateCommissionRuleInput } from "../validation/commission.validation";

export const commissionRuleService = {
  async createRule(input: CreateCommissionRuleInput): Promise<PublicCommissionRule> {
    const rule = await commissionRuleRepository.create({ ...input, active: input.active ?? true });
    return toPublicCommissionRule(rule);
  },

  /** Admin config list — small by nature, no pagination needed. */
  async listRules(): Promise<PublicCommissionRule[]> {
    const rules = await commissionRuleRepository.list();
    return rules.map(toPublicCommissionRule);
  },

  async updateRule(id: string, input: UpdateCommissionRuleInput): Promise<PublicCommissionRule> {
    const rule = await commissionRuleRepository.updateById(id, input);
    if (!rule) throw ApiError.notFound("Commission rule not found.");
    return toPublicCommissionRule(rule);
  },
};
