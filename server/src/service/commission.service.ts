import { Types } from "mongoose";
import { commissionRepository } from "../repository/commission.repository";
import { commissionRuleRepository } from "../repository/commissionRule.repository";
import { PartnerModel, type PartnerType } from "../models/Partner.model";
import type { ProjectType } from "../models/Lead.model";
import type { CommissionStatus } from "../models/Commission.model";
import type { PaymentTrigger } from "../models/CommissionRule.model";
import { notificationService } from "./notification.service";
import { ApiError } from "../util/ApiError";
import { toPublicCommission, type PublicCommission } from "../util/serializeCommission";
import type { UpdateCommissionStatusInput } from "../validation/commission.validation";

export interface PaginatedCommissions {
  items: PublicCommission[];
  total: number;
  page: number;
  pageSize: number;
}

/** Human-readable fragment for the partner-facing notification, e.g. "...has been approved." */
const STATUS_DESCRIPTIONS: Record<CommissionStatus, string> = {
  PENDING: "is pending",
  APPROVED: "has been approved",
  PROCESSING: "is being processed",
  PAID: "has been paid out",
  ON_HOLD: "has been put on hold",
  CANCELLED: "has been cancelled",
};

export const commissionService = {
  /**
   * Called (by someone else's lead/project status-change flow) whenever a partner-sourced lead
   * hits a payment-trigger event (booking / project completion). Idempotent — safe to call more
   * than once for the same lead as it moves through the pipeline. Does nothing if no active
   * CommissionRule matches yet; that's expected, not an error.
   */
  async evaluateForLead(input: {
    leadId: string;
    partnerId: string;
    partnerType: PartnerType;
    projectType: ProjectType;
    systemCapacityKw: number;
    bookingAmount: number;
    trigger: PaymentTrigger;
    projectId?: string;
  }): Promise<void> {
    const existing = await commissionRepository.findByLeadId(input.leadId);
    if (existing) return;

    const candidates = await commissionRuleRepository.findMatchingRules({
      partnerType: input.partnerType,
      paymentTrigger: input.trigger,
      projectType: input.projectType,
      systemCapacityKw: input.systemCapacityKw,
    });
    if (candidates.length === 0) return;

    // Prefer the more specific rule — one scoped to this project type — over a catch-all rule.
    const rule = candidates.find((candidate) => candidate.applicableProjectType !== undefined) ?? candidates[0];

    const commissionAmount =
      rule.commissionType === "PERCENTAGE" ? input.bookingAmount * ((rule.percent ?? 0) / 100) : (rule.fixedAmount ?? 0);

    await commissionRepository.create({
      partnerId: new Types.ObjectId(input.partnerId),
      leadId: new Types.ObjectId(input.leadId),
      projectId: input.projectId ? new Types.ObjectId(input.projectId) : null,
      commissionRuleId: rule._id,
      systemCapacityKw: input.systemCapacityKw,
      bookingAmount: input.bookingAmount,
      commissionType: rule.commissionType,
      percent: rule.percent,
      fixedAmount: rule.fixedAmount,
      commissionAmount,
      status: "PENDING",
    });

    const partner = await PartnerModel.findById(input.partnerId);
    if (partner) {
      await notificationService.notify({
        recipient: partner.user.toString(),
        type: "COMMISSION_STATUS_UPDATED",
        title: "Commission Earned",
        description: `A commission of ₹${commissionAmount} is pending for your referral.`,
      });
    }
  },

  async listCommissions(params: { page: number; pageSize: number; partnerId?: string; status?: CommissionStatus }): Promise<PaginatedCommissions> {
    const { items, total } = await commissionRepository.list(params);
    return { items: items.map(toPublicCommission), total, page: params.page, pageSize: params.pageSize };
  },

  async listForPartner(partnerId: string, params: { page: number; pageSize: number }): Promise<PaginatedCommissions> {
    const { items, total } = await commissionRepository.list({ partnerId, page: params.page, pageSize: params.pageSize });
    return { items: items.map(toPublicCommission), total, page: params.page, pageSize: params.pageSize };
  },

  async updateStatus(id: string, input: UpdateCommissionStatusInput): Promise<PublicCommission> {
    const existing = await commissionRepository.findById(id);
    if (!existing) throw ApiError.notFound("Commission not found.");

    const paymentDate = input.status === "PAID" ? (input.paymentDate ?? new Date()) : input.paymentDate;

    const commission = await commissionRepository.updateStatusById(id, {
      status: input.status,
      paymentDate,
      paymentReference: input.paymentReference,
    });
    if (!commission) throw ApiError.notFound("Commission not found.");

    const partner = await PartnerModel.findById(commission.partnerId);
    if (partner) {
      await notificationService.notify({
        recipient: partner.user.toString(),
        type: "COMMISSION_STATUS_UPDATED",
        title: "Commission Status Updated",
        description: `Your commission of ₹${commission.commissionAmount} ${STATUS_DESCRIPTIONS[commission.status]}.`,
      });
    }

    return toPublicCommission(commission);
  },
};
