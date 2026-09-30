import { Link } from "react-router-dom";
import { CalendarCheck, PhoneCall, Sun, type LucideIcon } from "lucide-react";
import { Marquee } from "@/components/motion/Marquee";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PageHero } from "@/components/marketing/kit/PageHero";
import { Section } from "@/components/marketing/kit/Section";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { StepsGrid } from "@/components/marketing/kit/StepsGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { processSteps } from "@/data/process";
import type { FaqItem } from "@/types/common";

interface Highlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SolutionDetailPageProps {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  sideImage: string;
  benefits: string[];
  highlights: Highlight[];
  faqItems: FaqItem[];
  finalCtaHeading: string;
  finalCtaDescription: string;
}

/** Shared shell for the Residential/Commercial/Industrial detail pages — same structure, different content. */
export function SolutionDetailPage({
  eyebrow,
  title,
  description,
  heroImage,
  sideImage,
  benefits,
  highlights,
  faqItems,
  finalCtaHeading,
  finalCtaDescription,
}: SolutionDetailPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        image={heroImage}
        chips={highlights.slice(0, 3).map(({ icon, title: label }) => ({ icon, label }))}
        actions={
          <>
            <Button asChild variant="white" size="lg">
              <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to={ROUTES.contact}>Talk To Our Team</Link>
            </Button>
          </>
        }
      />

      <div className="border-b border-border bg-surface py-4">
        <Marquee>
          {[...highlights.map((h) => h.title), "Free Site Survey", "Subsidy Assistance", "Net Metering Support", "AMC & Support"].map(
            (t) => (
              <span key={t} className="flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap text-navy/80">
                <Sun className="h-4 w-4 text-orange" aria-hidden="true" />
                {t}
              </span>
            ),
          )}
        </Marquee>
      </div>

      <SplitFeature
        eyebrow={eyebrow}
        title="Built Around Your Property"
        description={description}
        bullets={benefits}
        image={sideImage}
        imageAlt={eyebrow}
        badge={{ icon: CalendarCheck, value: "Free", label: "Site survey & estimate" }}
        actions={
          <Button asChild size="lg">
            <Link to={ROUTES.solarEstimate}>Start My Estimate</Link>
          </Button>
        }
      />

      <Section tone="surface" eyebrow="Why GK India SolarTech" title="What You Can Expect">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.07}>
              <FeatureCard icon={h.icon} title={h.title} description={h.description} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How It Works"
        title="From Estimate To Switch-On"
        description="Eight clear steps, handled by one accountable EPC team."
      >
        <StepsGrid steps={processSteps} columns={4} />
      </Section>

      <Section tone="muted" eyebrow="FAQ" title="Common Questions">
        <FAQSection items={faqItems} />
        <Reveal className="mt-8 flex justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link to={ROUTES.contact}>
              <PhoneCall className="h-4 w-4" aria-hidden="true" /> Still have questions?
            </Link>
          </Button>
        </Reveal>
      </Section>

      <CTASection
        heading={finalCtaHeading}
        description={finalCtaDescription}
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
