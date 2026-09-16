import { apiRequest } from "@/services/apiClient";
import type { DashboardMetrics, EmployeePerformanceRow, FunnelStageCount, LeadTrendPoint, ProjectTypeCount, SourceCount } from "@/features/crm/types/dashboard";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiRequest<DashboardMetrics>("/dashboard/metrics");
}

export async function getLeadFunnel(): Promise<FunnelStageCount[]> {
  return apiRequest<FunnelStageCount[]>("/dashboard/funnel");
}

export async function getLeadSources(): Promise<SourceCount[]> {
  return apiRequest<SourceCount[]>("/dashboard/sources");
}

export async function getProjectTypeDistribution(): Promise<ProjectTypeCount[]> {
  return apiRequest<ProjectTypeCount[]>("/dashboard/project-types");
}

export async function getEmployeePerformance(): Promise<EmployeePerformanceRow[]> {
  return apiRequest<EmployeePerformanceRow[]>("/dashboard/employee-performance");
}

export async function getLeadTrend(days?: number): Promise<LeadTrendPoint[]> {
  const qs = days ? `?days=${days}` : "";
  return apiRequest<LeadTrendPoint[]>(`/dashboard/trend${qs}`);
}

export async function getOverdueFollowUpsCount(): Promise<number> {
  const { count } = await apiRequest<{ count: number }>("/dashboard/overdue-follow-ups");
  return count;
}
