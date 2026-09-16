import { Link, useLocation, useNavigate } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { ROUTES } from "@/constant/routes";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { dashboardPathForRole } from "@/features/auth/utils/roleRedirect";
import type { AuthUser } from "@/features/auth/types/auth";

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;

  function handleSuccess(user: AuthUser) {
    navigate(from ?? dashboardPathForRole(user.role), { replace: true });
  }

  return (
    <>
      <Seo title="Sign In | GK India SolarTech" description="Sign in to your GK India SolarTech account." path={ROUTES.login} noindex />
      <AuthLayout
        title="Welcome Back"
        description="Sign in to continue."
        footer={
          <>
            Don't have an account?{" "}
            <Link to={ROUTES.signup} className="font-semibold text-navy hover:text-orange">
              Sign up
            </Link>
          </>
        }
      >
        <LoginForm onSuccess={handleSuccess} />
      </AuthLayout>
    </>
  );
}
