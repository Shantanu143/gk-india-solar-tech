import { Container } from "@/components/layout/Container";
import { FAQSection as FAQAccordion } from "@/components/marketing/FAQSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/data/faq";

export function FAQSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-12 w-full">
          <FAQAccordion items={faqItems} />
        </div>
      </Container>
    </section>
  );
}
