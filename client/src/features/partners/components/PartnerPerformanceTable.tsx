import { Avatar } from "@/features/crm/components/Avatar";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { PARTNER_TYPE_LABEL, type PartnerPerformanceRow } from "@/features/partners/types/partner";
import { formatInr } from "@/lib/format";

export function PartnerPerformanceTable({ rows }: { rows: PartnerPerformanceRow[] }) {
  if (rows.length === 0) return <EmptyState title="No partners found" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {["Partner", "Type", "Leads", "Bookings", "Total Commission", "Paid Commission"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.partnerId} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={row.partnerName} size="sm" />
                  <div>
                    <span className="block font-medium text-navy">{row.partnerName}</span>
                    {row.partnerCode && <span className="block font-mono text-xs text-muted-foreground">{row.partnerCode}</span>}
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-foreground/80">{PARTNER_TYPE_LABEL[row.partnerType]}</td>
              <td className="px-3 py-3 text-foreground/80">{row.totalLeads}</td>
              <td className="px-3 py-3 font-semibold text-green">{row.bookings}</td>
              <td className="px-3 py-3 text-foreground/80">{formatInr(row.totalCommission)}</td>
              <td className="px-3 py-3 text-foreground/80">{formatInr(row.paidCommission)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
