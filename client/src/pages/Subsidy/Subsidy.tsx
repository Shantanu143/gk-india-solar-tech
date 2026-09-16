import { BadgeCheck, IndianRupee, Info } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";

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
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
              <IndianRupee className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="mt-5 text-xs font-bold tracking-[0.14em] text-orange uppercase">
              Government Subsidy
            </span>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold text-navy sm:text-4xl">
              Get Assistance With Government Solar Subsidy
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              GK India SolarTech helps customers understand and apply for the applicable
              residential rooftop solar subsidy scheme.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading align="left" eyebrow="Subsidy Structure" title="Illustrative Subsidy Slabs" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Central government residential rooftop solar subsidy is typically calculated per kW
              of installed capacity, up to a capacity cap. Rates below are illustrative of a
              common scheme structure — confirm current rates with our team.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              {SUBSIDY_SLABS.map((slab, i) => (
                <div
                  key={slab.capacity}
                  className={`flex items-center justify-between px-5 py-4 text-sm ${i % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"}`}
                >
                  <span className="font-semibold text-navy">{slab.capacity}</span>
                  <span className="font-bold text-green">{slab.amount}</span>
                </div>
              ))}
            </div>
            <Card className="mt-6 flex gap-2.5 border-warning/30 bg-warning/8 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-navy/80">
                Subsidy amounts are <strong>estimated</strong> and <strong>subject to eligibility</strong>{" "}
                under <strong>applicable government scheme rules</strong>, which may change.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading align="left" eyebrow="Eligibility" title="What Affects Eligibility" />
            <ul className="mt-6 flex flex-col gap-3">
              {ELIGIBILITY_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4 text-sm text-foreground/80">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Our team confirms your exact eligibility and subsidy amount during the site survey
              and application process.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="FAQ" title="Common Questions" />
          <div className="mt-10 w-full">
            <FAQSection items={FAQ_ITEMS} />
          </div>
        </Container>
      </section>

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
