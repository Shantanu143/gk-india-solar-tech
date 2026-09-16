import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CheckList } from "@/components/marketing/CheckList";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { SolarScene, type SolarSceneVariant } from "@/components/marketing/illustrations/SolarScene";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";
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
  illustrationVariant: SolarSceneVariant;
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
  illustrationVariant,
  benefits,
  highlights,
  faqItems,
  finalCtaHeading,
  finalCtaDescription,
}: SolutionDetailPageProps) {
  return (
    <>
      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">{eyebrow}</span>
            <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{description}</p>
            <CheckList items={benefits} className="mt-6" />
            <Button asChild size="lg" className="mt-8">
              <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <SolarScene variant={illustrationVariant} className="w-full rounded-2xl shadow-soft-lg" />
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="Why GK India SolarTech" title="What You Can Expect" />
          <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, i) => (
              <Reveal key={highlight.title} delay={i * 0.06}>
                <FeatureCard icon={highlight.icon} title={highlight.title} description={highlight.description} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="FAQ" title="Common Questions" />
          <div className="mt-10 w-full">
            <FAQSection items={faqItems} />
          </div>
        </Container>
      </section>

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
