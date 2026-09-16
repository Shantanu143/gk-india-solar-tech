import { Seo } from "@/components/layout/Seo";
import { CommercialSection } from "./sections/CommercialSection";
import { EstimateCTASection } from "./sections/EstimateCTASection";
import { FAQSection } from "./sections/FAQSection";
import { FinalCTASection } from "./sections/FinalCTASection";
import { HeroSection } from "./sections/HeroSection";
import { IndustrialSection } from "./sections/IndustrialSection";
import { NetMeteringSection } from "./sections/NetMeteringSection";
import { ProcessSection } from "./sections/ProcessSection";
import { ProductsSection } from "./sections/ProductsSection";
import { ResidentialSection } from "./sections/ResidentialSection";
import { SavingsSection } from "./sections/SavingsSection";
import { SolutionsSection } from "./sections/SolutionsSection";
import { SubsidySection } from "./sections/SubsidySection";
import { SupportSection } from "./sections/SupportSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
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
      <HeroSection />
      <TrustSection />
      <WhyChooseUsSection />
      <SolutionsSection />
      <ResidentialSection />
      <CommercialSection />
      <IndustrialSection />
      <ProductsSection />
      <ProcessSection />
      <EstimateCTASection />
      <SubsidySection />
      <NetMeteringSection />
      <SupportSection />
      <SavingsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
