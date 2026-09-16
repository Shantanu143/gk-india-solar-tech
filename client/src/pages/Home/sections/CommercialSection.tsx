import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

export function CommercialSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <SolarScene variant="commercial" className="w-full rounded-2xl shadow-soft-lg" />
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Commercial Solar</span>
          <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Smarter Energy For Your Business</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Commercial solar can help businesses move toward cleaner and more efficient energy
            usage, with system design and installation managed by our EPC team.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link to={ROUTES.commercialSolar}>Explore Commercial Solar</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
