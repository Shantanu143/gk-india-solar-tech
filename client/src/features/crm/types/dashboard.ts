import type { LeadSource, LeadStatus } from "@/features/leads/types/lead";
import type { ProjectType } from "@/types/solarEstimate";

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  followUpsToday: number;
  siteSurveys: number;
  quotations: number;
  convertedLeads: number;
  activeProjects: number;
  completedProjects: number;
}

export interface FunnelStageCount {
  status: LeadStatus;
  count: number;
  percentOfTotal: number;
}

export interface SourceCount {
  source: LeadSource;
  label: string;
  count: number;
}

export interface ProjectTypeCount {
  projectType: ProjectType;
  label: string;
  count: number;
}

export interface EmployeePerformanceRow {
  employeeId: string;
  employeeName: string;
  assignedLeads: number;
  contacted: number;
  followUps: number;
  surveys: number;
  quotations: number;
  converted: number;
}

export interface LeadTrendPoint {
  date: string;
  count: number;
}

/**
 * A single employee's activity on one IST calendar day, derived from existing timestamped records
 * (the Activity log, plus FollowUp/Survey/Quotation completion timestamps) — there's no call-log or
 * manual daily-report entry in this app, so call-connect-rate style metrics aren't tracked.
 */
export interface DailySalesActivityRow {
  employeeId: string;
  employeeName: string;
  role: string;
  statusChanges: number;
  remarksLogged: number;
  followUpsCompleted: number;
  surveysCompleted: number;
  quotationsSent: number;
  bookings: number;
  leadsLost: number;
}

export interface DailySalesActivityReport {
  date: string;
  rows: DailySalesActivityRow[];
}
