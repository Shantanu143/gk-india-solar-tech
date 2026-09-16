import { Seo } from "@/components/layout/Seo";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { QuotationsList } from "@/features/quotations/components/QuotationsList";

export function EmployeeQuotationsPage() {
  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Quotations | GK India SolarTech CRM" description="My quotations." path={CRM_ROUTES.employeeQuotations} noindex />
      <PageHeader title="My Quotations" description="Quotations generated on your leads." />
      <QuotationsList detailPath={CRM_ROUTES.employeeQuotationDetail} />
    </div>
  );
}
