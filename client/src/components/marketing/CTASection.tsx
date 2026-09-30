import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
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
    <section className={cn("relative isolate overflow-hidden bg-sky-deep py-20 sm:py-28", className)}>
      <ParallaxImage src="/images/field-sky.jpg" alt="" strength={50} className="absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky-deep/70" />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center">
          {eyebrow && (
            <span className="text-xs font-bold tracking-[0.14em] text-white/80 uppercase">{eyebrow}</span>
          )}
          <h2 className="mt-3 max-w-2xl font-serif text-4xl font-medium text-white sm:text-5xl">{heading}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{description}</p>

          {children && <div className="mt-8 w-full">{children}</div>}

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild variant="white" size="lg">
              <Link to={primaryHref}>{primaryLabel}</Link>
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button asChild variant="glass" size="lg">
                <Link to={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
