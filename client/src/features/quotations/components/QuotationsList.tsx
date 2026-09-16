import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { cn } from "@/lib/utils";
import { QuotationStatusBadge } from "@/features/quotations/components/QuotationStatusBadge";
import { useQuotations } from "@/features/quotations/hooks/useQuotations";
import type { QuotationStatus, Quotation } from "@/features/quotations/types/quotation";
import { useLead } from "@/features/leads/hooks/useLead";
import { formatDate, formatInr } from "@/lib/format";

const TABS: { key: QuotationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Sent" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "REJECTED", label: "Rejected" },
];

function CustomerCell({ leadId, detailHref }: { leadId: string; detailHref: string }) {
  const { data: lead } = useLead(leadId);
  return (
    <Link to={detailHref} className="font-semibold text-navy hover:text-orange">
      {lead?.customer.fullName ?? "—"}
    </Link>
  );
}

interface QuotationsListProps {
  detailPath: (quotationId: string) => string;
}

export function QuotationsList({ detailPath }: QuotationsListProps) {
  const [status, setStatus] = useState<QuotationStatus | "all">("all");
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuotations({ status: status === "all" ? undefined : status, pageSize: 100 });
  const quotations = data?.items ?? [];

  const columns: DataTableColumn<Quotation>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (q) => <CustomerCell leadId={q.leadId} detailHref={detailPath(q.id)} />,
    },
    { key: "number", header: "Quotation #", render: (q) => <span className="font-mono text-xs text-muted-foreground">{q.quotationNumber}</span> },
    { key: "total", header: "Total", render: (q) => <span className="text-sm font-semibold text-navy">{formatInr(q.totalAmount)}</span> },
    { key: "validUntil", header: "Valid Until", render: (q) => <span className="text-sm text-foreground/80">{formatDate(`${q.validUntil}T00:00:00`)}</span> },
    { key: "status", header: "Status", render: (q) => <QuotationStatusBadge status={q.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (q) => (
        <button type="button" onClick={() => navigate(detailPath(q.id))} className="text-xs font-semibold text-navy hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
              status === tab.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/60 bg-white/55 p-2 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl sm:p-4">
        <DataTable
          columns={columns}
          rows={quotations}
          rowKey={(q) => q.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle="No quotations found"
          emptyDescription="Quotations generated from a lead's completed site survey will show up here."
          renderMobileCard={(q) => (
            <Link
              to={detailPath(q.id)}
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 text-sm hover:border-orange/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{q.quotationNumber}</span>
                <QuotationStatusBadge status={q.status} />
              </div>
              <span className="font-semibold text-navy">{formatInr(q.totalAmount)}</span>
              <span className="text-xs text-muted-foreground">Valid until {formatDate(`${q.validUntil}T00:00:00`)}</span>
            </Link>
          )}
        />
      </div>
    </div>
  );
}
