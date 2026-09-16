import { CRMLayout } from "@/features/crm/components/CRMLayout";
import { ProtectedRoute } from "@/features/crm/components/ProtectedRoute";
import { RoleRoute } from "@/features/crm/components/RoleRoute";
import { ADMIN_NAV_ITEMS } from "@/features/crm/utils/navigation";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { useLeads } from "@/features/leads/hooks/useLeads";

function AdminLayoutContent() {
  const { data: newLeads } = useLeads({ status: "NEW", pageSize: 1 });
  const { data: todayFollowUps } = useFollowUps({ scope: "today" });
  const { data: overdueFollowUps } = useFollowUps({ scope: "overdue" });

  const badges = {
    leads: newLeads?.total,
    followUps: (todayFollowUps?.length ?? 0) + (overdueFollowUps?.length ?? 0) || undefined,
  };

  return (
    <CRMLayout
      navItems={ADMIN_NAV_ITEMS}
      badges={badges}
      leadDetailPath={CRM_ROUTES.adminLeadDetail}
      searchTargetPath={CRM_ROUTES.adminLeads}
    />
  );
}

export function AdminLayout() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["ADMIN", "SALES_MANAGER"]}>
        <AdminLayoutContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
