import { Link, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { Lead } from "@/features/leads/types/lead";
import { QuotationStatusBadge } from "@/features/quotations/components/QuotationStatusBadge";
import { useQuotationForLead } from "@/features/quotations/hooks/useQuotation";
import { formatDate, formatInr } from "@/lib/format";

export function LeadQuotationTab({ lead }: { lead: Lead }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { data: quotation, isLoading } = useQuotationForLead(lead.id);

  if (isLoading) return <SkeletonRows rows={3} />;

  if (!quotation) {
    return (
      <EmptyState
        icon={FileText}
        title="No quotation yet"
        description="Generate a quotation from the actions above once the site survey and final configuration are complete."
      />
    );
  }

  const detailHref = isAdmin ? CRM_ROUTES.adminQuotationDetail(quotation.id) : CRM_ROUTES.employeeQuotationDetail(quotation.id);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl">
      <div>
        <p className="font-mono text-xs text-muted-foreground">{quotation.quotationNumber}</p>
        <p className="mt-1 text-lg font-bold text-navy">{formatInr(quotation.totalAmount)}</p>
        <p className="text-xs text-muted-foreground">Valid until {formatDate(`${quotation.validUntil}T00:00:00`)}</p>
        <div className="mt-2">
          <QuotationStatusBadge status={quotation.status} />
        </div>
      </div>
      <Link to={detailHref} className="text-sm font-semibold text-navy hover:text-orange">
        View Quotation
      </Link>
    </div>
  );
}
