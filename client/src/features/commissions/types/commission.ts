import type { PartnerType } from "@/features/partners/types/partner";
import type { ProjectType } from "@/types/solarEstimate";

export const COMMISSION_TYPES = ["PERCENTAGE", "FIXED"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

export const PAYMENT_TRIGGERS = ["ON_BOOKING", "ON_PROJECT_COMPLETED"] as const;
export type PaymentTrigger = (typeof PAYMENT_TRIGGERS)[number];

export const COMMISSION_STATUSES = ["PENDING", "APPROVED", "PROCESSING", "PAID", "ON_HOLD", "CANCELLED"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const COMMISSION_STATUS_LABEL: Record<CommissionStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  PROCESSING: "Processing",
  PAID: "Paid",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export const PAYMENT_TRIGGER_LABEL: Record<PaymentTrigger, string> = {
  ON_BOOKING: "On Booking",
  ON_PROJECT_COMPLETED: "On Project Completion",
};

/** Mirrors `server/src/util/serializeCommissionRule.ts`'s `toPublicCommissionRule` output. */
export interface CommissionRule {
  id: string;
  partnerType: PartnerType;
  commissionType: CommissionType;
  percent?: number;
  fixedAmount?: number;
  applicableProjectType?: ProjectType;
  minSystemCapacityKw?: number;
  paymentTrigger: PaymentTrigger;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors `server/src/util/serializeCommission.ts`'s `toPublicCommission` output. */
export interface Commission {
  id: string;
  partnerId: string;
  leadId: string;
  projectId: string | null;
  commissionRuleId: string;
  systemCapacityKw: number;
  bookingAmount: number;
  commissionType: CommissionType;
  percent?: number;
  fixedAmount?: number;
  commissionAmount: number;
  status: CommissionStatus;
  paymentDate?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}
