import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { CheckList } from "@/components/marketing/CheckList";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

const focusAreas = [
  "Scalable, large-scale system design",
  "Professional end-to-end EPC delivery",
  "Built for industrial applications",
  "Dedicated installation support",
];

export function IndustrialSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Industrial Solar</span>
          <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">
            Powering Industrial Growth With Solar
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Large-scale solar solutions engineered for industrial requirements, from initial
            design through installation.
          </p>
          <CheckList items={focusAreas} className="mt-6" />
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link to={ROUTES.industrialSolar}>Explore Industrial Solar</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <SolarScene variant="industrial" className="w-full rounded-2xl shadow-soft-lg" />
        </Reveal>
      </Container>
    </section>
  );
}
