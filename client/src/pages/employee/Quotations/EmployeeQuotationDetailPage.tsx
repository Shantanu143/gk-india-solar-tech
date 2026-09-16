import { useParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { QuotationBuilderView } from "@/features/quotations/components/QuotationBuilderView";

export function EmployeeQuotationDetailPage() {
  const { quotationId = "" } = useParams<{ quotationId: string }>();

  return (
    <>
      <Seo
        title="Quotation Details | GK India SolarTech CRM"
        description="Quotation detail."
        path={CRM_ROUTES.employeeQuotationDetail(quotationId)}
        noindex
      />
      <QuotationBuilderView quotationId={quotationId} leadDetailPath={CRM_ROUTES.employeeLeadDetail} />
    </>
  );
}
