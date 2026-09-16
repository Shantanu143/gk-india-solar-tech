import { BarChart3 } from "lucide-react";
import { CrmComingSoonPage } from "@/features/crm/components/CrmComingSoonPage";
import { CRM_ROUTES } from "@/features/crm/utils/routes";

export function AdminReportsPage() {
  return (
    <CrmComingSoonPage
      icon={BarChart3}
      title="Reports"
      description="Detailed, exportable company-wide reports are coming in a future update. The Dashboard already covers the core metrics."
      seoPath={CRM_ROUTES.adminReports}
    />
  );
}
