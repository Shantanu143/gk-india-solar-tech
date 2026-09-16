import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { useLeadSources } from "@/features/crm/hooks/useDashboard";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { LeadSourceChart } from "@/features/leads/components/LeadSourceChart";

export function AdminMarketingLeadsPage() {
  const { data: sources, isLoading } = useLeadSources();
  const total = sources?.reduce((sum, s) => sum + s.count, 0) ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Marketing Leads | GK India SolarTech CRM" description="Lead source breakdown." path={CRM_ROUTES.adminMarketingLeads} noindex />
      <PageHeader title="Marketing Leads" description="Where your leads are coming from." />

      <Card className="p-5">
        <h2 className="text-base font-bold text-navy">Leads By Source</h2>
        <div className="mt-4">{isLoading || !sources ? <SkeletonRows rows={5} /> : <LeadSourceChart data={sources} />}</div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-bold text-navy">Source Breakdown</h2>
        {isLoading || !sources ? (
          <SkeletonRows rows={5} className="mt-4" />
        ) : (
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Source</th>
                <th className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Leads</th>
                <th className="px-3 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Share</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.source} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium text-navy">{source.label}</td>
                  <td className="px-3 py-2.5 text-foreground/80">{source.count}</td>
                  <td className="px-3 py-2.5 text-foreground/80">{total ? Math.round((source.count / total) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
