import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyChooseUsItems } from "@/data/whyChooseUs";

export function WhyChooseUsSection() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal direction="left" className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="Why GK India SolarTech"
            title="Why Choose GK India SolarTech?"
            description="Professional solar solutions designed to make your transition to clean energy simple, reliable and efficient."
          />
          <ParallaxImage
            src="/images/wiring.jpg"
            alt="Technician wiring a solar installation"
            className="mt-8 aspect-[4/3] rounded-[2rem] shadow-soft-lg"
          />
        </Reveal>

        <ul className="flex flex-col gap-3">
          {whyChooseUsItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} direction="right">
              <li className="group flex gap-5 rounded-3xl border border-border bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sky/40 hover:shadow-soft-lg sm:p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky/10 text-sky transition-all duration-300 group-hover:rotate-6 group-hover:bg-sky group-hover:text-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
