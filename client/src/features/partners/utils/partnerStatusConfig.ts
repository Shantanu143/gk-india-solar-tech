import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import type { PartnerApplicationStatus } from "@/features/partners/types/partner";

/** Tone for `StatusBadge`, mirroring `LEAD_STATUS_CONFIG`'s tone convention. */
export const PARTNER_STATUS_TONE: Record<PartnerApplicationStatus, StatusTone> = {
  PENDING: "amber",
  APPROVED: "green",
  REJECTED: "red",
  SUSPENDED: "neutral",
};
