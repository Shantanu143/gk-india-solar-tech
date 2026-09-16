import { CTASection } from "@/components/marketing/CTASection";
import { billUploadHref, ROUTES } from "@/constant/routes";

export function EstimateCTASection() {
  return (
    <CTASection
      eyebrow="Free Solar Estimate"
      heading="How Much Can You Save With Solar?"
      description="Get an estimated solar requirement, savings, subsidy and EMI based on your electricity usage."
      primaryLabel="Get Free Solar Estimate"
      primaryHref={ROUTES.solarEstimate}
      secondaryLabel="Upload Electricity Bill"
      secondaryHref={billUploadHref}
    />
  );
}
