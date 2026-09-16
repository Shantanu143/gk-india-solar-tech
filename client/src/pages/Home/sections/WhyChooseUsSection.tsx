import { Container } from "@/components/layout/Container";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyChooseUsItems } from "@/data/whyChooseUs";

export function WhyChooseUsSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Why GK India SolarTech"
          title="Why Choose GK India SolarTech?"
          description="Professional solar solutions designed to make your transition to clean energy simple, reliable and efficient."
        />

        <div className="mt-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUsItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
