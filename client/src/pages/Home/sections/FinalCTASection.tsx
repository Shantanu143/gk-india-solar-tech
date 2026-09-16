import { CTASection } from "@/components/marketing/CTASection";
import { billUploadHref, ROUTES } from "@/constant/routes";

export function FinalCTASection() {
  return (
    <CTASection
      heading="Ready To Make The Switch To Solar?"
      description="Start with a free solar estimate and understand your potential solar requirement."
      primaryLabel="Get Free Solar Estimate"
      primaryHref={ROUTES.solarEstimate}
      secondaryLabel="Upload Electricity Bill"
      secondaryHref={billUploadHref}
    />
  );
}
