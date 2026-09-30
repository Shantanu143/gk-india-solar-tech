import { Section } from "@/components/marketing/kit/Section";
import { PhotoTile } from "@/components/marketing/kit/PhotoTile";
import { Reveal } from "@/components/ui/Reveal";
import { solutionCards } from "@/data/solutions";

const tileImages: Record<string, string> = {
  residential: "/images/house-white.jpg",
  commercial: "/images/office-tower.jpg",
  industrial: "/images/warehouse.jpg",
};

export function SolutionsSection() {
  return (
    <Section
      tone="surface"
      eyebrow="Our Solutions"
      title="Solar Solutions For Every Need"
      description="Whichever property you're powering, we design and install a solar system to match."
    >
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        {solutionCards.map((card, i) => (
          <Reveal key={card.id} delay={i * 0.1} direction="scale">
            <PhotoTile
              image={tileImages[card.id]}
              icon={card.icon}
              title={card.title}
              description={card.benefits.join(" · ")}
              href={card.href}
              className="min-h-[26rem]"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
