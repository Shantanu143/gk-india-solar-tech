import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ROUTES } from "@/constant/routes";
import { useAuth } from "@/features/crm/hooks/authContext";
import { dashboardPathForRole } from "@/features/auth/utils/roleRedirect";
import type { UserRole } from "@/features/auth/types/auth";

interface RoleRouteProps {
  /** Any non-CUSTOMER role — includes PARTNER, so a PartnerLayout can gate itself the same way AdminLayout/EmployeeLayout do. */
  allow: Exclude<UserRole, "CUSTOMER">[];
  children: ReactNode;
}

/** Frontend-only role gate for UX — real authorization is enforced by the backend's `authorizeRoles`/`authorizePermission` middleware. */
export function RoleRoute({ allow, children }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.login} replace />;

  // A CUSTOMER has no CRM home to fall back into — send them to the public site, not another gate.
  if (user.role === "CUSTOMER") return <Navigate to={ROUTES.home} replace />;

  if (!allow.includes(user.role)) {
    // Send whoever hit the wrong portal to the CRM home they actually belong in, not a generic one.
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }
  return <>{children}</>;
}
