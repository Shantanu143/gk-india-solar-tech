import { ClipboardCheck, FileCheck2, Gauge, Zap, ZapOff } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/8 text-navy">
              <Zap className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="mt-5 text-xs font-bold tracking-[0.14em] text-orange uppercase">Net Metering</span>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold text-navy sm:text-4xl">
              Get Support With Net Metering
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Net metering lets your solar system export surplus electricity to the grid and
              credits it against your usage. Our team assists customers through this process from
              application to commissioning.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-center">
          <SectionHeading eyebrow="The Process" title="How Net Metering Works" />
          <ol className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {NET_METERING_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="flex h-full flex-col items-center rounded-xl border border-border bg-surface p-5 text-center shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <step.icon className="mt-3 h-5 w-5 text-orange" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-bold text-navy">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
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
