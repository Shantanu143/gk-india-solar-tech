import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ROUTES } from "@/constant/routes";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { EmployeeRole } from "@/features/employees/types/employee";

interface RoleRouteProps {
  allow: EmployeeRole[];
  children: ReactNode;
}

/** Frontend-only role gate for UX — real authorization is enforced by the backend's `authorizeRoles`/`authorizePermission` middleware. */
export function RoleRoute({ allow, children }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.login} replace />;

  // A CUSTOMER has no CRM home to fall back into — send them to the public site, not another gate.
  if (user.role === "CUSTOMER") return <Navigate to={ROUTES.home} replace />;

  if (!allow.includes(user.role)) {
    const fallback = user.role === "ADMIN" || user.role === "SALES_MANAGER" ? CRM_ROUTES.adminDashboard : CRM_ROUTES.employeeDashboard;
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
