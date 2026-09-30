import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Seo } from "@/components/layout/Seo";
import { useAuth } from "@/features/crm/hooks/authContext";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { CreateQuotationModal } from "@/features/quotations/components/CreateQuotationModal";
import { QuotationsList } from "@/features/quotations/components/QuotationsList";

export function AdminQuotationsPage() {
  const { can } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Quotations | GK India SolarTech CRM" description="Every quotation across the company." path={CRM_ROUTES.adminQuotations} noindex />
      <PageHeader
        title="Quotations"
        description="Every quotation generated across the company."
        actions={
          can("quotations.create") && (
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Create Quotation
            </Button>
          )
        }
      />
      <QuotationsList detailPath={CRM_ROUTES.adminQuotationDetail} />
      <CreateQuotationModal open={createOpen} onOpenChange={setCreateOpen} detailPath={CRM_ROUTES.adminQuotationDetail} />
    </div>
  );
}
