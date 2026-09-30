import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface SectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tone?: "background" | "surface" | "muted";
  id?: string;
  className?: string;
  children: ReactNode;
}

const tones = { background: "bg-background", surface: "bg-surface", muted: "bg-surface-muted/60" } as const;

/** Standard tight-padded page section with optional centred heading. */
export function Section({ eyebrow, title, description, tone = "background", id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-14 sm:py-20", tones[tone], className)}>
      <Container className="flex flex-col items-center">
        {title && (
          <Reveal>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </Reveal>
        )}
        <div className={cn("w-full", title && "mt-10 sm:mt-12")}>{children}</div>
      </Container>
    </section>
  );
}
