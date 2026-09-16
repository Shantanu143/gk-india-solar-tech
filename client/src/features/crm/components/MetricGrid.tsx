import { CheckCircle2, ClipboardList, FileText, FolderKanban, TrendingUp, UserPlus, Users, Zap } from "lucide-react";
import { MetricCard } from "@/features/crm/components/MetricCard";
import { SkeletonCards } from "@/features/crm/components/LoadingSkeleton";
import { useDashboardMetrics } from "@/features/crm/hooks/useDashboard";

export function MetricGrid() {
  const { data: metrics, isLoading } = useDashboardMetrics();

  if (isLoading || !metrics) return <SkeletonCards count={8} />;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard icon={Users} label="Total Leads" value={metrics.totalLeads} tone="navy" />
      <MetricCard icon={UserPlus} label="New Leads" value={metrics.newLeads} tone="orange" />
      <MetricCard icon={Zap} label="Follow-ups Today" value={metrics.followUpsToday} tone="orange" />
      <MetricCard icon={ClipboardList} label="Site Surveys" value={metrics.siteSurveys} tone="navy" />
      <MetricCard icon={FileText} label="Quotations" value={metrics.quotations} tone="navy" />
      <MetricCard icon={TrendingUp} label="Converted Leads" value={metrics.convertedLeads} tone="green" />
      <MetricCard icon={FolderKanban} label="Active Projects" value={metrics.activeProjects} tone="navy" />
      <MetricCard icon={CheckCircle2} label="Completed Projects" value={metrics.completedProjects} tone="green" />
    </div>
  );
}
