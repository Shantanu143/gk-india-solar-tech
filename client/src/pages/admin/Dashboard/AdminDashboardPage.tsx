import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Seo } from "@/components/layout/Seo";
import { DashboardHeader } from "@/features/crm/components/DashboardHeader";
import { MetricGrid } from "@/features/crm/components/MetricGrid";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { useLeadFunnel, useLeadSources, useLeadTrend, useProjectTypeDistribution } from "@/features/crm/hooks/useDashboard";
import { daysForRange, type DateRangeOption } from "@/features/crm/utils/dateRange";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { EmployeePerformanceTable } from "@/features/employees/components/EmployeePerformanceTable";
import { useEmployeePerformance } from "@/features/crm/hooks/useDashboard";
import { FollowUpStats } from "@/features/followups/components/FollowUpStats";
import { LeadFunnelChart } from "@/features/leads/components/LeadFunnelChart";
import { LeadSourceChart } from "@/features/leads/components/LeadSourceChart";
import { LeadTrendChart } from "@/features/leads/components/LeadTrendChart";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { PipelineBoard } from "@/features/leads/components/PipelineBoard";
import { ProjectTypeChart } from "@/features/leads/components/ProjectTypeChart";
import { useLeads } from "@/features/leads/hooks/useLeads";

function SectionCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

export function AdminDashboardPage() {
  const [range, setRange] = useState<DateRangeOption>("month");
  const { data: funnel, isLoading: funnelLoading } = useLeadFunnel();
  const { data: sources, isLoading: sourcesLoading } = useLeadSources();
  const { data: projectTypes, isLoading: projectTypesLoading } = useProjectTypeDistribution();
  const { data: trend, isLoading: trendLoading } = useLeadTrend(daysForRange(range));
  const { data: performance, isLoading: performanceLoading } = useEmployeePerformance();
  const { data: pipelineLeads, isLoading: pipelineLoading } = useLeads({ pageSize: 200 });
  const { data: recentLeads, isLoading: recentLoading, isError: recentError, refetch: refetchRecent } = useLeads({ pageSize: 5 });

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Dashboard | GK India SolarTech CRM" description="Admin CRM dashboard." path={CRM_ROUTES.adminDashboard} noindex />

      <DashboardHeader
        title="Dashboard"
        description="Overview of your solar sales pipeline and customer activity."
        range={range}
        onRangeChange={setRange}
        invalidateKey={queryKeys.dashboard}
      />

      <MetricGrid />

      <FollowUpStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1fr]">
        <SectionCard title="Lead Funnel">
          {funnelLoading || !funnel ? <SkeletonRows rows={5} /> : <LeadFunnelChart stages={funnel} />}
        </SectionCard>
        <SectionCard title="Lead Trend">
          {trendLoading || !trend ? <SkeletonRows rows={5} /> : <LeadTrendChart data={trend} />}
        </SectionCard>
      </div>

      <SectionCard title="Lead Pipeline">
        {pipelineLoading || !pipelineLeads ? (
          <SkeletonRows rows={4} />
        ) : (
          <PipelineBoard leads={pipelineLeads.items} detailPath={CRM_ROUTES.adminLeadDetail} />
        )}
      </SectionCard>

      <SectionCard
        title="Recent Leads"
        action={
          <Link to={CRM_ROUTES.adminLeads} className="text-sm font-semibold text-navy hover:text-orange">
            View All
          </Link>
        }
      >
        <LeadsTable
          leads={recentLeads?.items ?? []}
          detailPath={CRM_ROUTES.adminLeadDetail}
          isLoading={recentLoading}
          isError={recentError}
          onRetry={() => refetchRecent()}
        />
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Lead Sources">
          {sourcesLoading || !sources ? <SkeletonRows rows={4} /> : <LeadSourceChart data={sources} />}
        </SectionCard>
        <SectionCard title="Project Type Distribution">
          {projectTypesLoading || !projectTypes ? <SkeletonRows rows={3} /> : <ProjectTypeChart data={projectTypes} />}
        </SectionCard>
      </div>

      <SectionCard title="Employee Performance">
        {performanceLoading || !performance ? <SkeletonRows rows={4} /> : <EmployeePerformanceTable rows={performance} />}
      </SectionCard>
    </div>
  );
}
