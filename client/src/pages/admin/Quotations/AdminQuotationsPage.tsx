import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { QuotationsList } from "@/features/quotations/components/QuotationsList";

export function AdminQuotationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="Quotations | GK India SolarTech CRM" description="Every quotation across the company." path={CRM_ROUTES.adminQuotations} noindex />
      <PageHeader title="Quotations" description="Every quotation generated across the company." />
      <QuotationsList detailPath={CRM_ROUTES.adminQuotationDetail} />
    </div>
  );
}
