import { Seo } from "@/components/layout/Seo";
import { SavingsCalculator } from "@/components/marketing/kit/SavingsCalculator";
import { Hero } from "@/components/marketing/Hero";
import { StatsBand } from "@/components/marketing/kit/StatsBand";
import { CTASection } from "@/components/marketing/CTASection";
import { billUploadHref, ROUTES } from "@/constant/routes";
import { CommercialSection } from "./sections/CommercialSection";
import { FAQSection } from "./sections/FAQSection";
import { GallerySection } from "./sections/GallerySection";
import { IndustrialSection } from "./sections/IndustrialSection";
import { NetMeteringSection } from "./sections/NetMeteringSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ProductsSection } from "./sections/ProductsSection";
import { ResidentialSection } from "./sections/ResidentialSection";
import { SolutionsSection } from "./sections/SolutionsSection";
import { SubsidySection } from "./sections/SubsidySection";
import { SupportSection } from "./sections/SupportSection";
import { TrustSection } from "./sections/TrustSection";
import { WhyChooseUsSection } from "./sections/WhyChooseUsSection";

export function Home() {
  return (
    <>
      <Seo
        title="GK India SolarTech | Residential, Commercial & Industrial Solar Solutions"
        description="Explore residential, commercial and industrial solar solutions from GK India SolarTech. Get a free solar estimate, subsidy assistance, net metering support and professional installation."
        path="/"
      />
      <Hero />
      <TrustSection />
      <WhyChooseUsSection />
      <SolutionsSection />
      <ResidentialSection />
      <CommercialSection />
      <IndustrialSection />
      <StatsBand
        stats={[
          { to: 8, label: "Clear steps, estimate to switch-on" },
          { to: 3, label: "Segments: home, business, industry" },
          { to: 78000, prefix: "₹", label: "Max. residential subsidy (est.)" },
          { to: 84, suffix: "%", label: "Example bill saving (illustrative)" },
        ]}
        footnote="Subsidy and savings figures are estimates, subject to eligibility and site conditions."
      />
      <ProductsSection />
      <ProcessSection />
      <SavingsCalculator />
      <SubsidySection />
      <NetMeteringSection />
      <SupportSection />
      <GallerySection />
      <FAQSection />
      <CTASection
        eyebrow="Free Solar Estimate"
        heading="Ready To Make The Switch To Solar?"
        description="Start with a free solar estimate and understand your potential solar requirement."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Upload Electricity Bill"
        secondaryHref={billUploadHref}
      />
    </>
  );
}
