import { BadgeCheck, ExternalLink, IndianRupee, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";

import { PageHero } from "@/components/marketing/kit/PageHero";

import { Section } from "@/components/marketing/kit/Section";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";
import { PM_SURYA_GHAR_PORTAL_URL } from "@/config/solarConfig";
import { Container } from "@/components/layout/Container";

const SUBSIDY_SLABS = [
  { capacity: "1 kW", amount: "₹30,000" },
  { capacity: "2 kW", amount: "₹60,000" },
  { capacity: "3 kW and above", amount: "₹78,000 (capped)" },
];

const ELIGIBILITY_ITEMS = [
  "The property is a residential rooftop connection.",
  "The installed system uses scheme-approved equipment.",
  "Your application is submitted through the applicable government portal.",
  "The connection is registered under an eligible electricity distribution company.",
];

const FAQ_ITEMS = [
  {
    question: "Who is eligible for the residential solar subsidy?",
    answer:
      "Eligibility generally applies to residential rooftop solar connections that meet the applicable government scheme's criteria. Our team confirms your specific eligibility during the application process.",
  },
  {
    question: "Does the subsidy apply to commercial or industrial systems?",
    answer:
      "This residential subsidy scheme applies to residential rooftop connections. Commercial and industrial customers should speak with our team about any incentives that may apply to their project.",
  },
  {
    question: "How is the subsidy amount calculated?",
    answer:
      "The subsidy is calculated per kW of installed capacity, up to a capacity cap, based on applicable government scheme rates at the time of application.",
  },
  {
    question: "When is the subsidy applied — before or after installation?",
    answer:
      "The subsidy is applied for and processed as part of your project after installation is complete and the application is submitted, following the applicable scheme's process.",
  },
];

export function Subsidy() {
  return (
    <>
      <Seo
        title="Government Solar Subsidy | GK India SolarTech"
        description="GK India SolarTech helps customers understand the applicable government solar subsidy process. Subsidy amounts are estimated and subject to eligibility."
        path="/subsidy"
      />
      <PageHero
        eyebrow="Government Subsidy"
        title="Get Assistance With Government Solar Subsidy"
        description="GK India SolarTech helps customers understand and apply for the applicable residential rooftop solar subsidy scheme."
        image="/images/house-white.jpg"
        chips={[
          { icon: IndianRupee, label: "Up to ₹78,000 (est.)" },
          { icon: BadgeCheck, label: "Eligibility explained" },
        ]}
        actions={
          <>
            <Button asChild variant="white" size="lg">
              <Link to={ROUTES.solarEstimate}>Check My Eligibility</Link>
            </Button>
            <Button asChild variant="outline-light" size="lg">
              <a href={PM_SURYA_GHAR_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                Apply on PM Surya Ghar Portal
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </>
        }
      />

      <Section tone="surface" eyebrow="Subsidy Structure" title="Illustrative Subsidy Slabs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SUBSIDY_SLABS.map((slab, i) => (
            <Reveal key={slab.capacity} delay={i * 0.1} direction="scale">
              <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-soft-lg">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky to-orange" />
                <p className="text-sm font-semibold text-muted-foreground">{slab.capacity}</p>
                <p className="mt-3 font-serif text-4xl text-green">{slab.amount}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-2xl">
          <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning/8 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-navy/80">
              Central government residential rooftop solar subsidy is typically calculated per kW of installed
              capacity, up to a cap. Amounts are <strong>estimated</strong> and <strong>subject to eligibility</strong>{" "}
              under <strong>applicable government scheme rules</strong>, which may change — confirm current rates with our team.
            </p>
          </div>
        </Reveal>
      </Section>

      <section className="bg-background py-14 sm:py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="left">
            <span className="text-xs font-bold tracking-[0.14em] text-sky uppercase">Eligibility</span>
            <h2 className="mt-3 font-serif text-4xl font-medium text-navy sm:text-5xl">What Affects Eligibility</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {ELIGIBILITY_ITEMS.map((item, i) => (
                <Reveal key={item} delay={i * 0.07}>
                  <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm text-foreground/80 shadow-soft">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden="true" />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Our team confirms your exact eligibility and subsidy amount during the site survey and application process.
            </p>
            <Button asChild variant="secondary" size="md" className="mt-5">
              <a href={PM_SURYA_GHAR_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                Go to PM Surya Ghar Portal
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </Reveal>
          <Reveal direction="right">
            <img
              src="/images/house-modern.jpg"
              alt="Modern home suited to rooftop solar"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft-lg"
            />
          </Reveal>
        </Container>
      </section>

      <Section tone="muted" eyebrow="FAQ" title="Common Questions">
        <FAQSection items={FAQ_ITEMS} />
      </Section>

      <CTASection
        heading="Want To Check Your Subsidy Eligibility?"
        description="Start with a free solar estimate — our team will confirm your subsidy eligibility as part of your proposal."
        primaryLabel="Get Free Solar Estimate"
        primaryHref={ROUTES.solarEstimate}
        secondaryLabel="Talk To Our Team"
        secondaryHref={ROUTES.contact}
      />
    </>
  );
}
