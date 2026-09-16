import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import type { LeadStatus } from "@/features/leads/types/lead";

export function LeadStatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  const config = LEAD_STATUS_CONFIG[status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
