import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import type { FaqItem } from "@/types/common";

interface FAQSectionProps {
  items: FaqItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <Reveal className="mx-auto w-full max-w-3xl">
      <Accordion type="single" collapsible className="rounded-xl border border-border bg-surface px-6 shadow-soft sm:px-8">
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}
