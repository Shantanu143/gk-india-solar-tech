import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/crm/hooks/authContext";
import { ROUTES } from "@/constant/routes";

/** Frontend-only gate for UX — the backend is the real enforcement point (every CRM route also requires a valid JWT). */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // The session is restored from an httpOnly cookie on every fresh page load — wait for that
  // silent check to resolve before deciding to redirect, or a refresh would flash straight to /login.
  if (isInitializing) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-orange" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
