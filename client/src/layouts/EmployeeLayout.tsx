import { CRMLayout } from "@/features/crm/components/CRMLayout";
import { ProtectedRoute } from "@/features/crm/components/ProtectedRoute";
import { RoleRoute } from "@/features/crm/components/RoleRoute";
import { useAuth } from "@/features/crm/hooks/authContext";
import { EMPLOYEE_NAV_ITEMS } from "@/features/crm/utils/navigation";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { useLeads } from "@/features/leads/hooks/useLeads";

function EmployeeLayoutContent() {
  const { user } = useAuth();
  const { data: myLeads } = useLeads({ assignedEmployeeId: user?.id, pageSize: 1 });
  const { data: todayFollowUps } = useFollowUps({ assignedEmployeeId: user?.id, scope: "today" });
  const { data: overdueFollowUps } = useFollowUps({ assignedEmployeeId: user?.id, scope: "overdue" });

  const badges = {
    leads: myLeads?.total,
    followUps: (todayFollowUps?.length ?? 0) + (overdueFollowUps?.length ?? 0) || undefined,
  };

  return (
    <CRMLayout
      navItems={EMPLOYEE_NAV_ITEMS}
      badges={badges}
      leadDetailPath={CRM_ROUTES.employeeLeadDetail}
      searchTargetPath={CRM_ROUTES.employeeLeads}
    />
  );
}

export function EmployeeLayout() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["SALES_EXECUTIVE", "SURVEY_ENGINEER"]}>
        <EmployeeLayoutContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
