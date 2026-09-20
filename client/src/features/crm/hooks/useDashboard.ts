import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import {
  getDailySalesActivity,
  getDashboardMetrics,
  getEmployeePerformance,
  getLeadFunnel,
  getLeadSources,
  getLeadTrend,
  getOverdueFollowUpsCount,
  getPartnerPerformance,
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

export function usePartnerPerformance() {
  return useQuery({ queryKey: queryKeys.dashboardPartnerPerformance, queryFn: getPartnerPerformance });
}

export function useLeadTrend(days?: number) {
  return useQuery({ queryKey: [...queryKeys.dashboardTrend, days], queryFn: () => getLeadTrend(days) });
}

export function useOverdueFollowUpsCount() {
  return useQuery({ queryKey: queryKeys.dashboardOverdueFollowUps, queryFn: getOverdueFollowUpsCount });
}

export function useDailySalesActivity(date: string) {
  return useQuery({ queryKey: queryKeys.dashboardDailySalesActivity(date), queryFn: () => getDailySalesActivity(date) });
}
