import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { authApi } from "@/features/auth/services/authApi";
import type { AuthUser } from "@/features/auth/types/auth";
import { dashboardPathForRole } from "@/features/auth/utils/roleRedirect";
import { cn } from "@/lib/utils";

type SignupMode = "customer" | "employeeSetup";

export function SignupPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SignupMode>("customer");
  const [createdUser, setCreatedUser] = useState<AuthUser | null>(null);

  const { data: setupStatus } = useQuery({
    queryKey: ["auth", "employee-setup-status"],
    queryFn: () => authApi.employeeSetupStatus(),
  });
  const employeeSetupAvailable = setupStatus?.available ?? false;

  if (createdUser) {
    return (
      <>
        <Seo title="Account Created | GK India SolarTech" description="Your account has been created." path={ROUTES.signup} noindex />
        <AuthLayout title="Account Created" description="">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green/10 text-green">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="text-base font-bold text-navy">Welcome, {createdUser.name}!</p>
            <p className="text-sm text-muted-foreground">
              {createdUser.role === "CUSTOMER"
                ? "Your account has been created. The full customer portal is coming soon — for now, you're signed in."
                : "Your administrator account has been created and you're signed in."}
            </p>
            <Button className="mt-2 w-full" onClick={() => navigate(dashboardPathForRole(createdUser.role))}>
              {createdUser.role === "CUSTOMER" ? "Continue to Home" : "Continue to Dashboard"}
            </Button>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <Seo title="Sign Up | GK India SolarTech" description="Create your GK India SolarTech account." path={ROUTES.signup} noindex />
      <AuthLayout
        title="Create Your Account"
        description={mode === "customer" ? "Sign up to get started." : "Set up the first administrator account."}
        footer={
          <>
            Already have an account?{" "}
            <Link to={ROUTES.login} className="font-semibold text-navy hover:text-orange">
              Sign in
            </Link>
          </>
        }
      >
        {employeeSetupAvailable && (
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-border bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => setMode("customer")}
              className={cn(
                "rounded-md py-2 text-sm font-semibold transition-colors",
                mode === "customer" ? "bg-surface text-navy shadow-soft" : "text-muted-foreground",
              )}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setMode("employeeSetup")}
              className={cn(
                "rounded-md py-2 text-sm font-semibold transition-colors",
                mode === "employeeSetup" ? "bg-surface text-navy shadow-soft" : "text-muted-foreground",
              )}
            >
              Admin Setup
            </button>
          </div>
        )}

        {mode === "employeeSetup" && (
          <p className="mb-4 rounded-lg bg-orange/10 px-3 py-2 text-xs text-orange-dark">
            This one-time setup creates the platform's first administrator account. It will no longer be available once completed.
          </p>
        )}

        <SignupForm mode={mode} onSuccess={setCreatedUser} />
      </AuthLayout>
    </>
  );
}
