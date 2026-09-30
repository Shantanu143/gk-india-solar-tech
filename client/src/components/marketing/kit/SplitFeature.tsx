import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { CheckList } from "../CheckList";

interface SplitFeatureProps {
  eyebrow?: string;
  title: string;
  description: string;
  bullets?: string[];
  image: string;
  imageAlt: string;
  /** Put the photo on the left instead of the right (desktop). */
  reverse?: boolean;
  badge?: { icon: LucideIcon; value: string; label: string };
  actions?: ReactNode;
  tone?: "light" | "muted";
}

/** Text + tall parallax photo with a floating glass stat badge; alternates sides via `reverse`. */
export function SplitFeature({
  eyebrow,
  title,
  description,
  bullets,
  image,
  imageAlt,
  reverse,
  badge,
  actions,
  tone = "light",
}: SplitFeatureProps) {
  return (
    <section className={cn("py-14 sm:py-20", tone === "muted" ? "bg-surface-muted/60" : "bg-background")}>
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal direction={reverse ? "right" : "left"} className={cn(reverse && "lg:order-2")}>
          {eyebrow && <span className="text-xs font-bold tracking-[0.14em] text-sky uppercase">{eyebrow}</span>}
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-navy sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">{description}</p>
          {bullets && <CheckList items={bullets} className="mt-6" />}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </Reveal>

        <Reveal direction={reverse ? "left" : "right"} className={cn("relative", reverse && "lg:order-1")}>
          <ParallaxImage
            src={image}
            alt={imageAlt}
            className="aspect-[4/5] rounded-[2rem] shadow-soft-lg sm:aspect-[5/4] lg:aspect-[4/4.4]"
          />
          {badge && (
            <div className="glass-blue animate-float absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl p-4 text-white shadow-soft-lg sm:left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sky">
                <badge.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xl leading-none font-semibold">{badge.value}</p>
                <p className="mt-1 text-xs text-white/80">{badge.label}</p>
              </div>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
