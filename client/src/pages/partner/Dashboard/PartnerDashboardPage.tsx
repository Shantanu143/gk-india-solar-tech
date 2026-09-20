import { useState } from "react";
import { CheckCircle2, CircleDollarSign, ClipboardCheck, Plus, TrendingUp, Users, Wallet } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { SkeletonCards } from "@/features/crm/components/LoadingSkeleton";
import { MetricCard } from "@/features/crm/components/MetricCard";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { PartnerApplicationBanner } from "@/features/partners/components/PartnerApplicationBanner";
import { SubmitLeadModal } from "@/features/partners/components/SubmitLeadModal";
import { usePartnerDashboard } from "@/features/partners/hooks/usePartnerDashboard";
import { usePartnerProfile } from "@/features/partners/hooks/usePartnerProfile";
import { formatInr } from "@/lib/format";

export function PartnerDashboardPage() {
  const { data: partner, isLoading: isProfileLoading } = usePartnerProfile();
  const { data: dashboard, isLoading, isError, refetch } = usePartnerDashboard();
  const [submitOpen, setSubmitOpen] = useState(false);

  const isApproved = partner?.applicationStatus === "APPROVED";

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title="Dashboard | Partner Portal | GK India SolarTech"
        description="Your partner performance at a glance."
        path={CRM_ROUTES.partnerDashboard}
        noindex
      />

      <PageHeader
        title={partner?.name ? `Welcome back, ${partner.name.split(" ")[0]}` : "Dashboard"}
        description="Track the leads you've referred and the commission you've earned."
        actions={
          <Button
            size="sm"
            className="w-full gap-1.5 sm:w-auto"
            disabled={!isApproved}
            title={isApproved ? undefined : "Your application must be approved before you can submit leads."}
            onClick={() => setSubmitOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit New Lead
          </Button>
        }
      />

      {!isProfileLoading && partner && partner.applicationStatus !== "APPROVED" && (
        <PartnerApplicationBanner status={partner.applicationStatus} rejectionReason={partner.rejectionReason} />
      )}

      {isLoading ? (
        <SkeletonCards count={7} />
      ) : isError || !dashboard ? (
        <ErrorState title="Couldn't load your dashboard." onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard icon={Users} label="Total Leads" value={dashboard.totalLeads} tone="navy" />
          <MetricCard icon={TrendingUp} label="Active Leads" value={dashboard.activeLeads} tone="navy" />
          <MetricCard icon={ClipboardCheck} label="Bookings" value={dashboard.bookings} tone="green" />
          <MetricCard icon={CheckCircle2} label="Completed Projects" value={dashboard.completedProjects} tone="green" />
          <MetricCard icon={Wallet} label="Total Commission" value={formatInr(dashboard.totalCommission)} tone="navy" />
          <MetricCard icon={CircleDollarSign} label="Paid Commission" value={formatInr(dashboard.paidCommission)} tone="green" />
          <MetricCard icon={CircleDollarSign} label="Pending Commission" value={formatInr(dashboard.pendingCommission)} tone="orange" />
        </div>
      )}

      <SubmitLeadModal open={submitOpen} onOpenChange={setSubmitOpen} />
    </div>
  );
}
