import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  eyebrow?: string;
  heading: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  children?: ReactNode;
  className?: string;
}

export function CTASection({
  eyebrow,
  heading,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  children,
  className,
}: CTASectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-navy-dark py-20 sm:py-24", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-orange/25 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-20%] left-[-5%] h-72 w-72 rounded-full bg-green/20 blur-[100px]"
      />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          {eyebrow && (
            <span className="text-xs font-bold tracking-[0.14em] text-orange-light uppercase">{eyebrow}</span>
          )}
          <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">{heading}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{description}</p>

          {children && <div className="mt-8 w-full">{children}</div>}

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link to={primaryHref}>{primaryLabel}</Link>
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button asChild variant="outline-light" size="lg">
                <Link to={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
