import { HelpCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";

import { PageHero } from "@/components/marketing/kit/PageHero";

import { Section } from "@/components/marketing/kit/Section";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { faqItems } from "@/data/faq";

export function FAQ() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions | GK India SolarTech"
        description="Answers to common questions about solar estimates, government subsidy, net metering, installation and AMC support from GK India SolarTech."
        path="/faq"
      />
      <PageHero
        size="short"
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Straight answers on estimates, subsidy, net metering, installation and support."
        image="/images/field.jpg"
        chips={[{ icon: HelpCircle, label: "Can't find it? Ask us below" }]}
      />
      <Section tone="muted">
        <FAQSection items={faqItems} />
        <Reveal className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link to={ROUTES.contact}>
              <Phone className="h-4 w-4" aria-hidden="true" /> Talk To Our Team
            </Link>
          </Button>
        </Reveal>
      </Section>
      <CTASection
        heading="Ready To See Your Savings?"
        description="Get a free solar estimate based on your electricity usage."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
      />
    </>
  );
}
