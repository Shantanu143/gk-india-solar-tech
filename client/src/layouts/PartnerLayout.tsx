import { CRMLayout } from "@/features/crm/components/CRMLayout";
import { ProtectedRoute } from "@/features/crm/components/ProtectedRoute";
import { RoleRoute } from "@/features/crm/components/RoleRoute";
import { PARTNER_NAV_ITEMS } from "@/features/crm/utils/navigation";
import { CRM_ROUTES } from "@/features/crm/utils/routes";

function PartnerLayoutContent() {
  return (
    <CRMLayout
      navItems={PARTNER_NAV_ITEMS}
      leadDetailPath={CRM_ROUTES.partnerLeadDetail}
      searchTargetPath={CRM_ROUTES.partnerLeads}
      theme="partner"
    />
  );
}

export function PartnerLayout() {
  return (
    <ProtectedRoute>
      <RoleRoute allow={["PARTNER"]}>
        <PartnerLayoutContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
