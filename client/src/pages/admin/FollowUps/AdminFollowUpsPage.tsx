import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { FollowUpsList } from "@/features/followups/components/FollowUpsList";
import { FollowUpStats } from "@/features/followups/components/FollowUpStats";

export function AdminFollowUpsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="Follow-ups | GK India SolarTech CRM" description="All follow-ups." path={CRM_ROUTES.adminFollowUps} noindex />
      <PageHeader title="Follow-ups" description="Stay on top of every customer conversation across the team." />
      <FollowUpStats />
      <FollowUpsList leadDetailPath={CRM_ROUTES.adminLeadDetail} />
    </div>
  );
}
