import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Commission, CommissionRule, CommissionStatus, CommissionType, PaymentTrigger } from "@/features/commissions/types/commission";
import type { PartnerType } from "@/features/partners/types/partner";
import type { ProjectType } from "@/types/solarEstimate";

/** No pagination — this is a small admin-configured list, not a growing ledger. */
export async function getCommissionRules(): Promise<CommissionRule[]> {
  const { rules } = await apiRequest<{ rules: CommissionRule[] }>("/commissions/rules");
  return rules;
}

export interface CreateCommissionRulePayload {
  partnerType: PartnerType;
  commissionType: CommissionType;
  percent?: number;
  fixedAmount?: number;
  applicableProjectType?: ProjectType;
  minSystemCapacityKw?: number;
  paymentTrigger: PaymentTrigger;
  active?: boolean;
}

export async function createCommissionRule(payload: CreateCommissionRulePayload): Promise<CommissionRule> {
  const { rule } = await apiRequest<{ rule: CommissionRule }>("/commissions/rules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return rule;
}

export interface UpdateCommissionRulePayload {
  id: string;
  commissionType?: CommissionType;
  percent?: number;
  fixedAmount?: number;
  applicableProjectType?: ProjectType;
  minSystemCapacityKw?: number;
  paymentTrigger?: PaymentTrigger;
  active?: boolean;
}

export async function updateCommissionRule(payload: UpdateCommissionRulePayload): Promise<CommissionRule> {
  const { id, ...body } = payload;
  const { rule } = await apiRequest<{ rule: CommissionRule }>(`/commissions/rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return rule;
}

export interface GetCommissionsParams {
  page?: number;
  pageSize?: number;
  partnerId?: string;
  status?: CommissionStatus;
}

/** Admin ledger — filterable, paginated. */
export async function getCommissions(params: GetCommissionsParams = {}): Promise<PaginatedResult<Commission>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize ?? 20));
  if (params.partnerId) search.set("partnerId", params.partnerId);
  if (params.status) search.set("status", params.status);
  return apiRequest<PaginatedResult<Commission>>(`/commissions?${search.toString()}`);
}

export interface GetMyCommissionsParams {
  page?: number;
  pageSize?: number;
}

/** The logged-in partner's own commissions — no admin filters. */
export async function getMyCommissions(params: GetMyCommissionsParams = {}): Promise<PaginatedResult<Commission>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize ?? 20));
  return apiRequest<PaginatedResult<Commission>>(`/commissions/me?${search.toString()}`);
}

export interface UpdateCommissionStatusPayload {
  id: string;
  status: CommissionStatus;
  paymentDate?: string;
  paymentReference?: string;
}

export async function updateCommissionStatus(payload: UpdateCommissionStatusPayload): Promise<Commission> {
  const { id, ...body } = payload;
  const { commission } = await apiRequest<{ commission: Commission }>(`/commissions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return commission;
}
