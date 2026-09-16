import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { CheckList } from "@/components/marketing/CheckList";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

const benefits = [
  "Reduced electricity expenses",
  "Rooftop solar designed for your home",
  "Professional installation",
  "Government subsidy assistance",
  "Net metering support",
];

export function ResidentialSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.14em] text-orange uppercase">Residential Solar</span>
          <h2 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">Power Your Home With Solar</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Bring down your monthly electricity expenses with a rooftop solar system designed for
            your home, backed by professional installation and ongoing support.
          </p>
          <CheckList items={benefits} className="mt-6" />
          <Button asChild size="lg" className="mt-8">
            <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <SolarScene variant="residential" className="w-full rounded-2xl shadow-soft-lg" />
        </Reveal>
      </Container>
    </section>
  );
}
