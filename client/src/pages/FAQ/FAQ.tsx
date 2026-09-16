import { HelpCircle } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Container } from "@/components/layout/Container";
import { FAQSection } from "@/components/marketing/FAQSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/data/faq";

export function FAQ() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions | GK India SolarTech"
        description="Answers to common questions about solar estimates, government subsidy, net metering, installation and AMC support from GK India SolarTech."
        path="/faq"
      />
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
            <HelpCircle className="h-7 w-7" aria-hidden="true" />
          </span>
          <SectionHeading className="mt-5" eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-12 w-full">
            <FAQSection items={faqItems} />
          </div>
        </Container>
      </section>
    </>
  );
}
