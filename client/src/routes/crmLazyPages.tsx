import { lazy } from "react";

// Admin
export const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/Dashboard/AdminDashboardPage").then((m) => ({ default: m.AdminDashboardPage })),
);
export const AdminLeadsPage = lazy(() =>
  import("@/pages/admin/Leads/AdminLeadsPage").then((m) => ({ default: m.AdminLeadsPage })),
);
export const AdminLeadDetailPage = lazy(() =>
  import("@/pages/admin/LeadDetails/AdminLeadDetailPage").then((m) => ({ default: m.AdminLeadDetailPage })),
);
export const AdminFollowUpsPage = lazy(() =>
  import("@/pages/admin/FollowUps/AdminFollowUpsPage").then((m) => ({ default: m.AdminFollowUpsPage })),
);
export const AdminCustomersPage = lazy(() =>
  import("@/pages/admin/Customers/AdminCustomersPage").then((m) => ({ default: m.AdminCustomersPage })),
);
export const AdminCustomerDetailPage = lazy(() =>
  import("@/pages/admin/Customers/AdminCustomerDetailPage").then((m) => ({ default: m.AdminCustomerDetailPage })),
);
export const AdminEmployeesPage = lazy(() =>
  import("@/pages/admin/Employees/AdminEmployeesPage").then((m) => ({ default: m.AdminEmployeesPage })),
);
export const AdminSurveysPage = lazy(() =>
  import("@/pages/admin/Surveys/AdminSurveysPage").then((m) => ({ default: m.AdminSurveysPage })),
);
export const AdminSurveyDetailPage = lazy(() =>
  import("@/pages/admin/Surveys/AdminSurveyDetailPage").then((m) => ({ default: m.AdminSurveyDetailPage })),
);
export const AdminQuotationsPage = lazy(() =>
  import("@/pages/admin/Quotations/AdminQuotationsPage").then((m) => ({ default: m.AdminQuotationsPage })),
);
export const AdminQuotationDetailPage = lazy(() =>
  import("@/pages/admin/Quotations/AdminQuotationDetailPage").then((m) => ({ default: m.AdminQuotationDetailPage })),
);
export const AdminProjectsPage = lazy(() =>
  import("@/pages/admin/Projects/AdminProjectsPage").then((m) => ({ default: m.AdminProjectsPage })),
);
export const AdminProjectDetailPage = lazy(() =>
  import("@/pages/admin/Projects/AdminProjectDetailPage").then((m) => ({ default: m.AdminProjectDetailPage })),
);
export const AdminMaterialsPage = lazy(() =>
  import("@/pages/admin/Materials/AdminMaterialsPage").then((m) => ({ default: m.AdminMaterialsPage })),
);
export const AdminProductsPage = lazy(() =>
  import("@/pages/admin/Products/AdminProductsPage").then((m) => ({ default: m.AdminProductsPage })),
);
export const AdminMarketingLeadsPage = lazy(() =>
  import("@/pages/admin/MarketingLeads/AdminMarketingLeadsPage").then((m) => ({ default: m.AdminMarketingLeadsPage })),
);
export const AdminReportsPage = lazy(() =>
  import("@/pages/admin/Reports/AdminReportsPage").then((m) => ({ default: m.AdminReportsPage })),
);
export const AdminSettingsPage = lazy(() =>
  import("@/pages/admin/Settings/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage })),
);

// Employee
export const EmployeeDashboardPage = lazy(() =>
  import("@/pages/employee/Dashboard/EmployeeDashboardPage").then((m) => ({ default: m.EmployeeDashboardPage })),
);
export const EmployeeLeadsPage = lazy(() =>
  import("@/pages/employee/Leads/EmployeeLeadsPage").then((m) => ({ default: m.EmployeeLeadsPage })),
);
export const EmployeeLeadDetailPage = lazy(() =>
  import("@/pages/employee/LeadDetails/EmployeeLeadDetailPage").then((m) => ({ default: m.EmployeeLeadDetailPage })),
);
export const EmployeeFollowUpsPage = lazy(() =>
  import("@/pages/employee/FollowUps/EmployeeFollowUpsPage").then((m) => ({ default: m.EmployeeFollowUpsPage })),
);
export const EmployeeSurveysPage = lazy(() =>
  import("@/pages/employee/Surveys/EmployeeSurveysPage").then((m) => ({ default: m.EmployeeSurveysPage })),
);
export const SurveyDetailPage = lazy(() =>
  import("@/pages/employee/Surveys/SurveyDetailPage").then((m) => ({ default: m.SurveyDetailPage })),
);
export const EmployeeQuotationsPage = lazy(() =>
  import("@/pages/employee/Quotations/EmployeeQuotationsPage").then((m) => ({ default: m.EmployeeQuotationsPage })),
);
export const EmployeeQuotationDetailPage = lazy(() =>
  import("@/pages/employee/Quotations/EmployeeQuotationDetailPage").then((m) => ({ default: m.EmployeeQuotationDetailPage })),
);
export const EmployeeProjectsPage = lazy(() =>
  import("@/pages/employee/Projects/EmployeeProjectsPage").then((m) => ({ default: m.EmployeeProjectsPage })),
);
export const EmployeeProjectDetailPage = lazy(() =>
  import("@/pages/employee/Projects/EmployeeProjectDetailPage").then((m) => ({ default: m.EmployeeProjectDetailPage })),
);
export const EmployeeSettingsPage = lazy(() =>
  import("@/pages/employee/Settings/EmployeeSettingsPage").then((m) => ({ default: m.EmployeeSettingsPage })),
);
