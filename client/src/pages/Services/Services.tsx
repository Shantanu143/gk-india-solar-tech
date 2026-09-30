import { ClipboardList, IndianRupee, PenTool, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";

import { PageHero } from "@/components/marketing/kit/PageHero";
import { PhotoTile } from "@/components/marketing/kit/PhotoTile";
import { Section } from "@/components/marketing/kit/Section";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { StatsBand } from "@/components/marketing/kit/StatsBand";
import { StepsGrid } from "@/components/marketing/kit/StepsGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { processSteps } from "@/data/process";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: ClipboardList,
    title: "Site Survey",
    description: "An on-site assessment of your roof or land, shading and electrical setup before finalizing your proposal.",
  },
  {
    icon: PenTool,
    title: "Design & Engineering",
    description: "System design matched to your property, electricity usage and site conditions.",
  },
  {
    icon: Wrench,
    title: "Installation",
    description: "Professional end-to-end installation carried out by our EPC team.",
  },
  {
    icon: Zap,
    title: "Net Metering Assistance",
    description: "Support through the net-metering process required to connect your system to the grid.",
    href: ROUTES.netMetering,
  },
  {
    icon: IndianRupee,
    title: "Government Subsidy Assistance",
    description: "Guidance through the applicable government solar subsidy process, subject to eligibility.",
    href: ROUTES.subsidy,
  },
  {
    icon: Wrench,
    title: "AMC & Support",
    description: "Post-installation maintenance and support to keep your system performing.",
  },
];

const SERVICE_IMAGES = [
  "/images/blueprints.jpg",
  "/images/laptops.jpg",
  "/images/installer.jpg",
  "/images/offshore-wind.jpg",
  "/images/house-modern.jpg",
  "/images/wiring.jpg",
];

export function Services() {
  return (
    <>
      <Seo
        title="Services | GK India SolarTech"
        description="Solar EPC services from GK India SolarTech: site survey, design, installation, net metering assistance, government subsidy assistance and AMC."
        path="/services"
      />
      <PageHero
        eyebrow="Services"
        title="End-To-End Solar EPC Services"
        description="From your first site survey through installation, net metering, subsidy assistance and ongoing support — one accountable team handles every stage."
        image="/images/technician-bg.jpg"
        imagePosition="center 30%"
        chips={[
          { icon: ClipboardList, label: "Site Survey" },
          { icon: Wrench, label: "Installation" },
          { icon: Zap, label: "Net Metering" },
          { icon: IndianRupee, label: "Subsidy Help" },
        ]}
        actions={
          <Button asChild variant="white" size="lg">
            <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
          </Button>
        }
      />

      <Section tone="surface" eyebrow="What We Offer" title="Everything Your Project Needs">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 0.08} direction="scale">
              <PhotoTile
                image={SERVICE_IMAGES[i]}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      <SplitFeature
        eyebrow="Design & Engineering"
        title="Systems Matched To Your Site"
        description="Every system is designed around your property, electricity usage and site conditions — so you get the right capacity, the right components and a layout that performs."
        bullets={["Shadow & roof analysis", "Load-matched system sizing", "Component selection & structure design", "Clear proposal before you commit"]}
        image="/images/blueprints.jpg"
        imageAlt="Solar design blueprints"
        badge={{ icon: PenTool, value: "Custom", label: "Designed for your site" }}
      />

      <Section eyebrow="How We Work" title="Your Solar Journey, Made Simple">
        <StepsGrid steps={processSteps} columns={4} />
      </Section>

      <StatsBand
        stats={[
          { to: 6, label: "Core services" },
          { to: 8, label: "Delivery steps" },
          { to: 3, label: "Segments served" },
          { to: 1, label: "Accountable team" },
        ]}
      />

      <CTASection
        heading="Ready To Get Started?"
        description="Start with a free solar estimate and our team will guide you through every step."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
