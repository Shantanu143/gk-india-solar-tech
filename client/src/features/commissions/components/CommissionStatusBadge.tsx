import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { COMMISSION_STATUS_CONFIG } from "@/features/commissions/utils/commissionStatusConfig";
import type { CommissionStatus } from "@/features/commissions/types/commission";

export function CommissionStatusBadge({ status, className }: { status: CommissionStatus; className?: string }) {
  const config = COMMISSION_STATUS_CONFIG[status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
