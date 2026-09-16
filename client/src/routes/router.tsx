import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ROUTES } from "@/constant/routes";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { ProtectedRoute } from "@/features/crm/components/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { EmployeeLayout } from "@/layouts/EmployeeLayout";
import { Home } from "@/pages/Home/Home";
import {
  AccountPage,
  About,
  Commercial,
  Contact,
  FAQ,
  Industrial,
  LoginPage,
  NetMetering,
  NotFound,
  PrivacyPolicy,
  Products,
  RefundPolicy,
  Residential,
  Services,
  SignupPage,
  SolarEstimate,
  SolarEstimateSuccess,
  Subsidy,
  Terms,
} from "./lazyPages";
import {
  AdminCustomerDetailPage,
  AdminCustomersPage,
  AdminDashboardPage,
  AdminEmployeesPage,
  AdminFollowUpsPage,
  AdminLeadDetailPage,
  AdminLeadsPage,
  AdminMarketingLeadsPage,
  AdminMaterialsPage,
  AdminProductsPage,
  AdminProjectDetailPage,
  AdminProjectsPage,
  AdminQuotationDetailPage,
  AdminQuotationsPage,
  AdminReportsPage,
  AdminSettingsPage,
  AdminSurveyDetailPage,
  AdminSurveysPage,
  EmployeeDashboardPage,
  EmployeeFollowUpsPage,
  EmployeeLeadDetailPage,
  EmployeeLeadsPage,
  EmployeeProjectDetailPage,
  EmployeeProjectsPage,
  EmployeeQuotationDetailPage,
  EmployeeQuotationsPage,
  EmployeeSettingsPage,
  EmployeeSurveysPage,
  SurveyDetailPage,
} from "./crmLazyPages";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.home, element: <Home /> },
      { path: ROUTES.solarEstimate, element: <SolarEstimate /> },
      { path: ROUTES.solarEstimateSuccess, element: <SolarEstimateSuccess /> },
      { path: ROUTES.residentialSolar, element: <Residential /> },
      { path: ROUTES.commercialSolar, element: <Commercial /> },
      { path: ROUTES.industrialSolar, element: <Industrial /> },
      { path: ROUTES.products, element: <Products /> },
      { path: ROUTES.services, element: <Services /> },
      { path: ROUTES.about, element: <About /> },
      { path: ROUTES.netMetering, element: <NetMetering /> },
      { path: ROUTES.subsidy, element: <Subsidy /> },
      { path: ROUTES.contact, element: <Contact /> },
      { path: ROUTES.faq, element: <FAQ /> },
      { path: ROUTES.privacyPolicy, element: <PrivacyPolicy /> },
      { path: ROUTES.terms, element: <Terms /> },
      { path: ROUTES.refundPolicy, element: <RefundPolicy /> },
      {
        path: ROUTES.account,
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.signup, element: <SignupPage /> },
  // The CRM's old mock-login URL — redirect anyone who bookmarked it to the real, unified login.
  { path: "/crm/login", element: <Navigate to={ROUTES.login} replace /> },
  {
    element: <AdminLayout />,
    children: [
      { path: CRM_ROUTES.adminDashboard, element: <AdminDashboardPage /> },
      { path: CRM_ROUTES.adminLeads, element: <AdminLeadsPage /> },
      { path: CRM_ROUTES.adminLeadDetail(":leadId"), element: <AdminLeadDetailPage /> },
      { path: CRM_ROUTES.adminFollowUps, element: <AdminFollowUpsPage /> },
      { path: CRM_ROUTES.adminCustomers, element: <AdminCustomersPage /> },
      { path: CRM_ROUTES.adminCustomerDetail(":customerId"), element: <AdminCustomerDetailPage /> },
      { path: CRM_ROUTES.adminEmployees, element: <AdminEmployeesPage /> },
      { path: CRM_ROUTES.adminSurveys, element: <AdminSurveysPage /> },
      { path: CRM_ROUTES.adminSurveyDetail(":surveyId"), element: <AdminSurveyDetailPage /> },
      { path: CRM_ROUTES.adminQuotations, element: <AdminQuotationsPage /> },
      { path: CRM_ROUTES.adminQuotationDetail(":quotationId"), element: <AdminQuotationDetailPage /> },
      { path: CRM_ROUTES.adminProjects, element: <AdminProjectsPage /> },
      { path: CRM_ROUTES.adminProjectDetail(":projectId"), element: <AdminProjectDetailPage /> },
      { path: CRM_ROUTES.adminMaterials, element: <AdminMaterialsPage /> },
      { path: CRM_ROUTES.adminProducts, element: <AdminProductsPage /> },
      { path: CRM_ROUTES.adminMarketingLeads, element: <AdminMarketingLeadsPage /> },
      { path: CRM_ROUTES.adminReports, element: <AdminReportsPage /> },
      { path: CRM_ROUTES.adminSettings, element: <AdminSettingsPage /> },
    ],
  },
  {
    element: <EmployeeLayout />,
    children: [
      { path: CRM_ROUTES.employeeDashboard, element: <EmployeeDashboardPage /> },
      { path: CRM_ROUTES.employeeLeads, element: <EmployeeLeadsPage /> },
      { path: CRM_ROUTES.employeeLeadDetail(":leadId"), element: <EmployeeLeadDetailPage /> },
      { path: CRM_ROUTES.employeeFollowUps, element: <EmployeeFollowUpsPage /> },
      { path: CRM_ROUTES.employeeSurveys, element: <EmployeeSurveysPage /> },
      { path: CRM_ROUTES.employeeSurveyDetail(":surveyId"), element: <SurveyDetailPage /> },
      { path: CRM_ROUTES.employeeQuotations, element: <EmployeeQuotationsPage /> },
      { path: CRM_ROUTES.employeeQuotationDetail(":quotationId"), element: <EmployeeQuotationDetailPage /> },
      { path: CRM_ROUTES.employeeProjects, element: <EmployeeProjectsPage /> },
      { path: CRM_ROUTES.employeeProjectDetail(":projectId"), element: <EmployeeProjectDetailPage /> },
      { path: CRM_ROUTES.employeeSettings, element: <EmployeeSettingsPage /> },
    ],
  },
]);
