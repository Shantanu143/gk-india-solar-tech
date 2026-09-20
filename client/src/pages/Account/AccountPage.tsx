import { Link } from "react-router-dom";
import { Handshake } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/features/crm/components/Avatar";
import { useAuth } from "@/features/auth/hooks/authContext";
import { USER_ROLE_LABEL } from "@/features/auth/types/auth";
import { AccountSettingsView } from "@/features/auth/components/AccountSettingsView";
import { MyInquiriesSection } from "@/features/customerInquiries/components/MyInquiriesSection";
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

          {user?.role === "CUSTOMER" && (
            <>
              <MyInquiriesSection />

              <Card className="mt-6 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange/10 text-orange-dark">
                    <Handshake className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy">Know someone who wants solar?</p>
                    <p className="text-sm text-muted-foreground">Become a partner and earn commission on every referral that books.</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary" className="w-full shrink-0 sm:w-auto">
                  <Link to={ROUTES.becomePartner}>Become a Partner</Link>
                </Button>
              </Card>
            </>
          )}

          <Card className="mt-6 p-5 sm:p-8">
            <AccountSettingsView />
          </Card>
        </Container>
      </section>
    </>
  );
}
