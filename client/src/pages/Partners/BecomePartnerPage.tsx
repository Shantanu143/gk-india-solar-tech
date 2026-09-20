import { Link } from "react-router-dom";
import { Building2, HardHat, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";
import type { ProcessStep } from "@/types/common";

const PARTNER_TYPES = [
  {
    icon: Users,
    title: "Sales / Referral Partner",
    description:
      "For electricians, dealers, shop owners and connectors who refer customers looking for solar and earn commission whenever a referral books a system.",
  },
  {
    icon: HardHat,
    title: "Installation / Service Partner",
    description:
      "For installation teams, electricians and fabricators who carry out on-site installation, structure fabrication and electrical work for booked projects.",
  },
  {
    icon: Building2,
    title: "EPC / Project Partner",
    description: "For established EPC contractors who can take on complete solar projects end-to-end, from execution through commissioning.",
  },
];

const PARTNER_PROCESS_STEPS: ProcessStep[] = [
  { number: "01", title: "Choose Your Type", description: "Pick Sales/Referral, Installation/Service or EPC/Project — whichever matches how you work." },
  { number: "02", title: "Apply Online", description: "Submit a short registration form — takes about 5 minutes." },
  { number: "03", title: "Application Reviewed", description: "Our team reviews the details you've submitted." },
  { number: "04", title: "Account Approved", description: "You're approved and can sign in to your partner dashboard." },
  { number: "05", title: "Refer Or Execute", description: "Submit customer leads, or take on installation and EPC work — depending on your partner type." },
  { number: "06", title: "Our Sales Team Takes Over", description: "GK India SolarTech's sales team engages the customer through to booking." },
  { number: "07", title: "Customer Books Their System", description: "Once the customer books, the project moves into delivery." },
  { number: "08", title: "You Earn Commission", description: "Track every lead in your dashboard and get paid commission on booking." },
];

export function BecomePartnerPage() {
  return (
    <>
      <Seo
        title="Become a Solar Partner | GK India SolarTech"
        description="Partner with GK India SolarTech as a sales/referral, installation/service or EPC/project partner and earn commission on every booking."
        path={ROUTES.becomePartner}
      />

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Partner Program</span>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold text-navy sm:text-4xl lg:text-[2.75rem]">
              Grow Your Business with GK India SolarTech – Become a Solar Partner
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Refer customers, install systems, or deliver full EPC projects — and earn commission on
              every booking, backed by our sales and delivery team.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg">
                <Link to={ROUTES.partnerApply}>Apply To Become A Partner</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to={ROUTES.login}>Already A Partner? Sign In</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading
            eyebrow="Partner Types"
            title="Choose The Partnership That Fits You"
            description="Every partner type earns commission — pick the one that matches how you want to work with us."
          />
          <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
            {PARTNER_TYPES.map((type, i) => (
              <Reveal key={type.title} delay={i * 0.05}>
                <FeatureCard icon={type.icon} title={type.title} description={type.description} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading
            eyebrow="How It Works"
            title="Refer Or Deliver, We Sell, You Earn"
            description="A simple flow whether you're referring customers or delivering the project yourself."
          />
          <div className="mt-14 w-full">
            <ProcessTimeline steps={PARTNER_PROCESS_STEPS} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Partner Program"
        heading="Ready To Start Earning With GK India SolarTech?"
        description="Applications are reviewed by our team — once approved, you can start submitting leads or projects right away."
        primaryLabel="Apply Now"
        primaryHref={ROUTES.partnerApply}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
