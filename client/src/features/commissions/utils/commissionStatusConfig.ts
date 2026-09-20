import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import { COMMISSION_STATUS_LABEL, type CommissionStatus } from "@/features/commissions/types/commission";

export const COMMISSION_STATUS_CONFIG: Record<CommissionStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: COMMISSION_STATUS_LABEL.PENDING, tone: "amber" },
  APPROVED: { label: COMMISSION_STATUS_LABEL.APPROVED, tone: "amber" },
  PROCESSING: { label: COMMISSION_STATUS_LABEL.PROCESSING, tone: "amber" },
  PAID: { label: COMMISSION_STATUS_LABEL.PAID, tone: "green" },
  ON_HOLD: { label: COMMISSION_STATUS_LABEL.ON_HOLD, tone: "neutral" },
  CANCELLED: { label: COMMISSION_STATUS_LABEL.CANCELLED, tone: "neutral" },
};
