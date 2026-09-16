import { ROUTES } from "@/constant/routes";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { UserRole } from "@/features/auth/types/auth";

/** Where a freshly logged-in (or just signed-up) user lands, by role. */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "ADMIN":
    case "SALES_MANAGER":
      return CRM_ROUTES.adminDashboard;
    case "SALES_EXECUTIVE":
    case "SURVEY_ENGINEER":
      return CRM_ROUTES.employeeDashboard;
    case "CUSTOMER":
      return ROUTES.home;
  }
}
