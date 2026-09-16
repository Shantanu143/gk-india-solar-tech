import { Link } from "react-router-dom";
import { IndianRupee, Info } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

export function SubsidySection() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <Reveal>
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/8 text-navy">
            <IndianRupee className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
            Get Assistance With Government Solar Subsidy
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
            GK India SolarTech helps customers understand the applicable solar subsidy process for
            their installation.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-6">
            <Link to={ROUTES.subsidy}>Check Subsidy Eligibility</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="flex gap-3 border-warning/30 bg-warning/8 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-navy/80">
              Subsidy figures are <strong>estimated</strong> and <strong>subject to eligibility</strong>{" "}
              under <strong>applicable government scheme rules</strong>. Final eligibility is
              confirmed during your application.
            </p>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}
