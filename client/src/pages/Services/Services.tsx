import { Link } from "react-router-dom";
import { ClipboardList, IndianRupee, PenTool, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

export function Services() {
  return (
    <>
      <Seo
        title="Services | GK India SolarTech"
        description="Solar EPC services from GK India SolarTech: site survey, design, installation, net metering assistance, government subsidy assistance and AMC."
        path="/services"
      />
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Services</span>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold text-navy sm:text-4xl">
              End-To-End Solar EPC Services
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From your first site survey through installation, net metering, subsidy assistance
              and ongoing support — one accountable team handles every stage.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => {
              const content = (
                <Card className="flex h-full flex-col p-6 hover:-translate-y-1 hover:shadow-soft-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/8 text-navy">
                    <service.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </Card>
              );
              return (
                <Reveal key={service.title} delay={i * 0.05}>
                  {service.href ? (
                    <Link to={service.href} className="block h-full">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="How We Work" title="Your Solar Journey, Made Simple" />
          <div className="mt-14 w-full">
            <ProcessTimeline steps={processSteps} />
          </div>
        </Container>
      </section>

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
