import { Container } from "@/components/layout/Container";
import { SolutionCard } from "@/components/marketing/SolutionCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { solutionCards } from "@/data/solutions";

export function SolutionsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Our Solutions"
          title="Solar Solutions For Every Need"
          description="Whichever property you're powering, we design and install a solar system to match."
        />

        <div className="mt-14 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {solutionCards.map((card, i) => (
            <Reveal key={card.id} delay={i * 0.08} className="group h-full">
              <SolutionCard
                icon={card.icon}
                title={card.title}
                description={card.description}
                benefits={card.benefits}
                href={card.href}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
