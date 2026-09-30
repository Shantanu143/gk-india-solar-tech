import { ClipboardCheck, FileCheck2, Gauge, Zap, ZapOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";

import { PageHero } from "@/components/marketing/kit/PageHero";

import { Section } from "@/components/marketing/kit/Section";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";

import { StepsGrid } from "@/components/marketing/kit/StepsGrid";
import { Button } from "@/components/ui/Button";

import { ROUTES } from "@/constant/routes";

const NET_METERING_STEPS = [
  { icon: Gauge, title: "System Installation", description: "Your solar system is installed and inspected by our team." },
  { icon: ClipboardCheck, title: "Application Submission", description: "We submit the net-metering application to your electricity distribution company on your behalf." },
  { icon: Zap, title: "Meter Installation", description: "Your distribution company installs or upgrades your meter to a bi-directional (net) meter." },
  { icon: FileCheck2, title: "Inspection & Approval", description: "Your distribution company inspects the installation and approves the connection." },
  { icon: ZapOff, title: "Commissioning", description: "Once approved, your system is commissioned and begins exporting surplus electricity to the grid." },
];

const FAQ_ITEMS = [
  {
    question: "What is net metering?",
    answer:
      "Net metering is a billing arrangement that lets a grid-connected solar system export surplus electricity back to the grid. Exported units are credited against your consumption, which can help reduce your net electricity bill.",
  },
  {
    question: "Do I need net metering for my solar system?",
    answer:
      "Net metering is needed to export surplus solar electricity to the grid and receive billing credit for it. It applies to grid-connected systems.",
  },
  {
    question: "How long does net metering approval take?",
    answer:
      "Approval timelines depend on your local electricity distribution company and can vary by location. Our team follows up on your application throughout the process.",
  },
  {
    question: "Does GK India SolarTech handle the net metering application?",
    answer: "Yes, we assist with submitting and following up on your net-metering application as part of our installation service.",
  },
];

export function NetMetering() {
  return (
    <>
      <Seo
        title="Net Metering | GK India SolarTech"
        description="GK India SolarTech assists customers through the net-metering process required to connect a solar installation to the grid."
        path="/net-metering"
      />
      <PageHero
        eyebrow="Net Metering"
        title="Get Support With Net Metering"
        description="Net metering lets your solar system export surplus electricity to the grid and credits it against your usage. Our team assists you from application to commissioning."
        image="/images/wind.jpg"
        chips={[
          { icon: ClipboardCheck, label: "We file the application" },
          { icon: Gauge, label: "Bi-directional meter" },
          { icon: Zap, label: "Export surplus power" },
        ]}
        actions={
          <Button asChild variant="white" size="lg">
            <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
          </Button>
        }
      />

      <Section tone="surface" eyebrow="The Process" title="How Net Metering Works">
        <StepsGrid
          columns={5}
          steps={NET_METERING_STEPS.map((s) => ({ title: s.title, description: s.description, icon: s.icon }))}
        />
      </Section>

      <SplitFeature
        eyebrow="Why It Matters"
        title="Turn Surplus Sunshine Into Bill Credits"
        description="On sunny days your system may generate more than you use. With net metering, that extra power flows to the grid and is credited against your consumption — helping lower your overall bill."
        bullets={["Credits for exported units", "Lower net electricity bill", "No battery needed for grid-tied systems"]}
        image="/images/offshore-wind.jpg"
        imageAlt="Wind and solar feeding the grid"
        badge={{ icon: Zap, value: "Grid-tied", label: "Export & earn credits" }}
      />

      <Section tone="muted" eyebrow="FAQ" title="Common Questions">
        <FAQSection items={FAQ_ITEMS} />
      </Section>

      <CTASection
        heading="Ready To Get Started?"
        description="Start with a free solar estimate — net metering support is included as part of your installation."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
