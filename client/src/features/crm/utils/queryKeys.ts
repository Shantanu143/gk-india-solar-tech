import type { GetLeadsParams } from "@/features/leads/services/leadService";
import type { FollowUpFilters } from "@/features/followups/types/followUp";
import type { GetSurveysParams } from "@/features/surveys/services/surveyService";
import type { GetProductsParams } from "@/features/products/services/productService";
import type { GetQuotationsParams } from "@/features/quotations/services/quotationService";
import type { GetCustomersParams } from "@/features/customers/services/customerService";
import type { GetProjectsParams } from "@/features/projects/services/projectService";
import type { GetMaterialsParams } from "@/features/materials/services/materialService";

/**
 * Broad keys (leads, followUps, dashboard) are what mutations invalidate — TanStack Query matches
 * by prefix, so invalidating ["leads"] also invalidates every ["leads","list",...] and
 * ["leads","detail",...] entry beneath it. This is what the cache-invalidation rules described in
 * the CRM spec map onto directly.
 */
export const queryKeys = {
  leads: ["leads"] as const,
  leadsList: (params: GetLeadsParams) => ["leads", "list", params] as const,
  leadDetail: (id: string) => ["leads", "detail", id] as const,

  followUps: ["followUps"] as const,
  followUpsList: (filters: FollowUpFilters) => ["followUps", "list", filters] as const,
  followUpDetail: (id: string) => ["followUps", "detail", id] as const,

  employees: ["employees"] as const,
  employeeDetail: (id: string) => ["employees", "detail", id] as const,

  surveys: ["surveys"] as const,
  surveysList: (params: GetSurveysParams) => ["surveys", "list", params] as const,
  surveyDetail: (id: string) => ["surveys", "detail", id] as const,
  surveyForLead: (leadId: string) => ["surveys", "forLead", leadId] as const,
  finalConfiguration: (surveyId: string) => ["finalConfiguration", surveyId] as const,

  activities: (leadId: string) => ["activities", leadId] as const,

  products: ["products"] as const,
  productsList: (params: GetProductsParams) => ["products", "list", params] as const,
  productDetail: (id: string) => ["products", "detail", id] as const,

  quotations: ["quotations"] as const,
  quotationsList: (params: GetQuotationsParams) => ["quotations", "list", params] as const,
  quotationDetail: (id: string) => ["quotations", "detail", id] as const,
  quotationForLead: (leadId: string) => ["quotations", "forLead", leadId] as const,

  dashboard: ["dashboard"] as const,
  dashboardMetrics: ["dashboard", "metrics"] as const,
  dashboardFunnel: ["dashboard", "funnel"] as const,
  dashboardSources: ["dashboard", "sources"] as const,
  dashboardProjectTypes: ["dashboard", "projectTypes"] as const,
  dashboardEmployeePerformance: ["dashboard", "employeePerformance"] as const,
  dashboardTrend: ["dashboard", "trend"] as const,
  dashboardOverdueFollowUps: ["dashboard", "overdueFollowUps"] as const,

  notifications: ["notifications"] as const,

  customers: ["customers"] as const,
  customersList: (params: GetCustomersParams) => ["customers", "list", params] as const,
  customerDetail: (id: string) => ["customers", "detail", id] as const,
  customerForLead: (leadId: string) => ["customers", "forLead", leadId] as const,

  projects: ["projects"] as const,
  projectsList: (params: GetProjectsParams) => ["projects", "list", params] as const,
  projectDetail: (id: string) => ["projects", "detail", id] as const,
  projectForCustomer: (customerId: string) => ["projects", "forCustomer", customerId] as const,

  materials: ["materials"] as const,
  materialsList: (params: GetMaterialsParams) => ["materials", "list", params] as const,
  materialDetail: (id: string) => ["materials", "detail", id] as const,
  materialTransactions: (id: string) => ["materials", "transactions", id] as const,
};
