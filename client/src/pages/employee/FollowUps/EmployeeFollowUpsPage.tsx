import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { FollowUpsList } from "@/features/followups/components/FollowUpsList";
import { FollowUpStats } from "@/features/followups/components/FollowUpStats";

export function EmployeeFollowUpsPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Follow-ups | GK India SolarTech CRM" description="My follow-ups." path={CRM_ROUTES.employeeFollowUps} noindex />
      <PageHeader title="Follow-ups" description="Stay on top of every customer conversation." />
      <FollowUpStats assignedEmployeeId={user?.id} />
      <FollowUpsList assignedEmployeeId={user?.id} leadDetailPath={CRM_ROUTES.employeeLeadDetail} />
    </div>
  );
}
