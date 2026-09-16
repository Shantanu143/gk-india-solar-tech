import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import type { QuotationStatus } from "@/features/quotations/types/quotation";

export const QUOTATION_STATUS_CONFIG: Record<QuotationStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  SENT: { label: "Sent", tone: "amber" },
  ACCEPTED: { label: "Accepted", tone: "green" },
  REJECTED: { label: "Rejected", tone: "red" },
  EXPIRED: { label: "Expired", tone: "neutral" },
};
