import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { QUOTATION_STATUS_CONFIG } from "@/features/quotations/utils/quotationStatusConfig";
import type { QuotationStatus } from "@/features/quotations/types/quotation";

export function QuotationStatusBadge({ status, className }: { status: QuotationStatus; className?: string }) {
  const config = QUOTATION_STATUS_CONFIG[status];
  return <StatusBadge label={config.label} tone={config.tone} className={className} />;
}
