import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { isFollowUpOverdue, type FollowUp } from "@/features/followups/types/followUp";
import { FOLLOW_UP_STATUS_CONFIG } from "@/features/followups/utils/followUpStatusConfig";

export function FollowUpStatusBadge({ followUp, className }: { followUp: FollowUp; className?: string }) {
  if (isFollowUpOverdue(followUp)) {
    return <StatusBadge label="Overdue" tone="red" className={className} />;
  }
  const config = FOLLOW_UP_STATUS_CONFIG[followUp.status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
