import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { useDailySalesActivity, usePartnerPerformance } from "@/features/crm/hooks/useDashboard";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { PartnerPerformanceTable } from "@/features/partners/components/PartnerPerformanceTable";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const DAILY_COLUMNS: { key: string; header: string }[] = [
  { key: "statusChanges", header: "Status Changes" },
  { key: "remarksLogged", header: "Remarks Logged" },
  { key: "followUpsCompleted", header: "Follow-ups Completed" },
  { key: "surveysCompleted", header: "Surveys Completed" },
  { key: "quotationsSent", header: "Quotations Sent" },
  { key: "bookings", header: "Bookings" },
  { key: "leadsLost", header: "Leads Lost" },
];

function DailySalesActivitySection() {
  const [date, setDate] = useState(todayIso());
  const { data, isLoading, isError, refetch } = useDailySalesActivity(date);
  const rows = data?.rows ?? [];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-navy">Daily Sales Activity</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Derived from the activity log — not a call log, so calls-made/connected aren't tracked here.
          </p>
        </div>
        <input
          type="date"
          value={date}
          max={todayIso()}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
        />
      </div>

      <div className="mt-4">
        {isLoading ? (
          <SkeletonRows rows={4} />
        ) : isError ? (
          <button type="button" onClick={() => refetch()} className="text-sm font-semibold text-navy hover:underline">
            Couldn't load this report — retry
          </button>
        ) : rows.length === 0 ? (
          <EmptyState title="No activity on this day" description="Nothing was logged for any employee on the selected date." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Employee</th>
                  {DAILY_COLUMNS.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.employeeId} className="border-b border-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 font-semibold text-navy">{row.employeeName}</td>
                    {DAILY_COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-right text-foreground/80">
                        {row[col.key as keyof typeof row]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

export function AdminReportsPage() {
  const { data: partnerPerformance, isLoading: partnerPerformanceLoading } = usePartnerPerformance();

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Reports | GK India SolarTech CRM" description="Company-wide performance reports." path={CRM_ROUTES.adminReports} noindex />
      <PageHeader title="Reports" description="Company-wide performance, broken down by team and by partner." />

      <DailySalesActivitySection />

      <Card className="p-5">
        <h2 className="text-base font-bold text-navy">Partner Performance</h2>
        <div className="mt-4">
          {partnerPerformanceLoading || !partnerPerformance ? <SkeletonRows rows={4} /> : <PartnerPerformanceTable rows={partnerPerformance} />}
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center gap-3 p-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
          <BarChart3 className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-base font-bold text-navy">More Reports Coming Soon</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Detailed, exportable company-wide reports are coming in a future update. The Dashboard already covers the core metrics.
        </p>
      </Card>
    </div>
  );
}
