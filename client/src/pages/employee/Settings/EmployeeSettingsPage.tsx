import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Seo } from "@/components/layout/Seo";
import { Avatar } from "@/features/crm/components/Avatar";
import { useAuth } from "@/features/crm/hooks/authContext";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { USER_ROLE_LABEL } from "@/features/auth/types/auth";
import { AccountSettingsView } from "@/features/auth/components/AccountSettingsView";

export function EmployeeSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Settings | GK India SolarTech CRM" description="Account settings." path={CRM_ROUTES.employeeSettings} noindex />
      <PageHeader title="Settings" description="Your profile and account settings." />

      {user && (
        <Card className="flex items-center gap-4 p-5">
          <Avatar name={user.name} size="lg" />
          <div>
            <p className="text-base font-bold text-navy">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{USER_ROLE_LABEL[user.role]}</p>
          </div>
        </Card>
      )}

      <Card className="p-5 sm:p-6">
        <AccountSettingsView />
      </Card>
    </div>
  );
}
