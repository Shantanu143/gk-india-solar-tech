import { BadgeCheck, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { SolutionCard } from "@/components/marketing/SolutionCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";
import { solutionCards } from "@/data/solutions";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    description: "Clear, estimate-first conversations so you understand your options before you commit.",
  },
  {
    icon: BadgeCheck,
    title: "Accountability",
    description: "One team accountable for your project from estimate through installation and support.",
  },
  {
    icon: Sparkles,
    title: "Quality",
    description: "Professional installation and quality components sourced for long-term performance.",
  },
  {
    icon: Handshake,
    title: "Support",
    description: "Ongoing AMC and support so your relationship with us continues after commissioning.",
  },
];

export function About() {
  return (
    <>
      <Seo
        title="About Us | GK India SolarTech"
        description="GK India SolarTech is a solar EPC company offering residential, commercial and industrial solar solutions, from estimate through installation and support."
        path="/about"
      />
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">About Us</span>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold text-navy sm:text-4xl">About GK India SolarTech</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              GK India SolarTech is a solar EPC company offering residential, commercial and
              industrial solar solutions — from your free estimate through installation, net
              metering and ongoing support. Our goal is to make the switch to solar simple,
              transparent and reliable.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="What We Do" title="Solar Solutions For Every Property" />
          <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {solutionCards.map((card, i) => (
              <Reveal key={card.id} delay={i * 0.08}>
                <SolutionCard
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  benefits={card.benefits}
                  href={card.href}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="Our Approach" title="How We Work With You" />
          <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <FeatureCard icon={value.icon} title={value.title} description={value.description} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        heading="Ready To Start Your Solar Journey?"
        description="Get a free solar estimate and see what solar could look like for your property."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Contact Us"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
