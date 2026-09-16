import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import {
  getDashboardMetrics,
  getEmployeePerformance,
  getLeadFunnel,
  getLeadSources,
  getLeadTrend,
  getOverdueFollowUpsCount,
  getProjectTypeDistribution,
} from "@/features/crm/services/dashboardService";

export function useDashboardMetrics() {
  return useQuery({ queryKey: queryKeys.dashboardMetrics, queryFn: getDashboardMetrics });
}

export function useLeadFunnel() {
  return useQuery({ queryKey: queryKeys.dashboardFunnel, queryFn: getLeadFunnel });
}

export function useLeadSources() {
  return useQuery({ queryKey: queryKeys.dashboardSources, queryFn: getLeadSources });
}

export function useProjectTypeDistribution() {
  return useQuery({ queryKey: queryKeys.dashboardProjectTypes, queryFn: getProjectTypeDistribution });
}

export function useEmployeePerformance() {
  return useQuery({ queryKey: queryKeys.dashboardEmployeePerformance, queryFn: getEmployeePerformance });
}

export function useLeadTrend(days?: number) {
  return useQuery({ queryKey: [...queryKeys.dashboardTrend, days], queryFn: () => getLeadTrend(days) });
}

export function useOverdueFollowUpsCount() {
  return useQuery({ queryKey: queryKeys.dashboardOverdueFollowUps, queryFn: getOverdueFollowUpsCount });
}
