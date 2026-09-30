import { BadgeCheck, Handshake, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";

import { FeatureCard } from "@/components/marketing/FeatureCard";
import { PageHero } from "@/components/marketing/kit/PageHero";
import { PhotoTile } from "@/components/marketing/kit/PhotoTile";
import { Section } from "@/components/marketing/kit/Section";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { StatsBand } from "@/components/marketing/kit/StatsBand";
import { StepsGrid } from "@/components/marketing/kit/StepsGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { solutionCards } from "@/data/solutions";
import { processSteps } from "@/data/process";

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
      <PageHero
        eyebrow="About Us"
        title="About GK India SolarTech"
        description="A solar EPC company making the switch to solar simple, transparent and reliable — from your free estimate through installation, net metering and ongoing support."
        image="/images/field.jpg"
        imagePosition="center 40%"
        chips={[
          { icon: ShieldCheck, label: "Transparent" },
          { icon: BadgeCheck, label: "Accountable" },
          { icon: Handshake, label: "Supportive" },
        ]}
        actions={
          <>
            <Button asChild variant="white" size="lg">
              <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to={ROUTES.contact}>Contact Us</Link>
            </Button>
          </>
        }
      />

      <SplitFeature
        eyebrow="Our Story"
        title="Clean Energy, Handled End-To-End"
        description="GK India SolarTech is a solar EPC company offering residential, commercial and industrial solar solutions. One accountable team designs, procures and builds your system — then stays with you after commissioning through AMC and support. Our goal is to make the switch to solar simple, transparent and reliable."
        bullets={[
          "Engineering, procurement & construction under one roof",
          "Mounting structure manufacturing for durability",
          "Subsidy and net-metering paperwork handled with you",
          "Annual maintenance so your system keeps performing",
        ]}
        image="/images/installer.jpg"
        imageAlt="Installer fitting a solar panel"
        badge={{ icon: Users, value: "One team", label: "Estimate to support" }}
      />

      <StatsBand
        image="/images/field-sky.jpg"
        stats={[
          { to: 3, label: "Segments served" },
          { to: 8, label: "Step delivery process" },
          { to: 4, label: "Product categories" },
          { to: 100, suffix: "%", label: "EPC accountability" },
        ]}
      />

      <Section tone="surface" eyebrow="What We Do" title="Solar Solutions For Every Property">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {solutionCards.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08} direction="scale">
              <PhotoTile
                image={card.image}
                icon={card.icon}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <SplitFeature
        reverse
        tone="muted"
        eyebrow="Our Mission"
        title="Making Solar Simple For Every Indian Property"
        description="We believe going solar shouldn't feel complicated. That's why every project starts with a free, no-pressure estimate and a clear proposal — so you know exactly what you're getting before you commit."
        bullets={["Estimate-first conversations", "Quality components, professional installation", "Support that continues after commissioning"]}
        image="/images/wind-hills.jpg"
        imageAlt="Wind turbines over green hills"
        badge={{ icon: Target, value: "Clear", label: "Proposals before commitment" }}
      />

      <Section eyebrow="Our Approach" title="How We Work With You">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.07}>
              <FeatureCard icon={value.icon} title={value.title} description={value.description} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="surface" eyebrow="Our Process" title="Eight Steps To Solar">
        <StepsGrid steps={processSteps} columns={4} />
      </Section>

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
