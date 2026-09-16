import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/features/crm/components/Avatar";
import { useAuth } from "@/features/auth/hooks/authContext";
import { USER_ROLE_LABEL } from "@/features/auth/types/auth";
import { AccountSettingsView } from "@/features/auth/components/AccountSettingsView";
import { ROUTES } from "@/constant/routes";

export function AccountPage() {
  const { user } = useAuth();

  return (
    <>
      <Seo title="My Account | GK India SolarTech" description="Manage your account details." path={ROUTES.account} noindex />
      <section className="py-14 sm:py-20">
        <Container className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-navy">My Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your profile and password.</p>

          {user && (
            <Card className="mt-6 flex items-center gap-4 p-5">
              <Avatar name={user.name} size="lg" />
              <div>
                <p className="text-base font-bold text-navy">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{USER_ROLE_LABEL[user.role]}</p>
              </div>
            </Card>
          )}

          <Card className="mt-6 p-5 sm:p-8">
            <AccountSettingsView />
          </Card>
        </Container>
      </section>
    </>
  );
}
