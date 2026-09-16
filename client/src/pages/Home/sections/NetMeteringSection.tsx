import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

export function NetMeteringSection() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy/8 text-navy">
            <Zap className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">Get Support With Net Metering</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Our team can assist customers through the net-metering process associated with their
            solar installation.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-6">
            <Link to={ROUTES.netMetering}>Learn About Net Metering</Link>
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
