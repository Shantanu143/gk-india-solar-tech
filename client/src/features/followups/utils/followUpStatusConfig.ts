import type { StatusTone } from "@/features/leads/utils/leadStatusConfig";
import type { FollowUpStatus } from "@/features/followups/types/followUp";

export const FOLLOW_UP_STATUS_CONFIG: Record<FollowUpStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: "Pending", tone: "navy" },
  COMPLETED: { label: "Completed", tone: "green" },
  MISSED: { label: "Missed", tone: "red" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};
