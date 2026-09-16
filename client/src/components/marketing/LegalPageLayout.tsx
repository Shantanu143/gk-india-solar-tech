import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

interface LegalPageLayoutProps {
  title: string;
  intro: string;
  children: ReactNode;
}

/** Shared shell for the legal placeholder pages — plain, readable article typography rather than the marketing look. */
export function LegalPageLayout({ title, intro, children }: LegalPageLayoutProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{intro}</p>

        <Card className="mt-8 flex gap-3 border-warning/30 bg-warning/8 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-navy/80">
            Placeholder content. Have this page reviewed by legal counsel before publishing.
          </p>
        </Card>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/85 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy [&_p]:mt-2">
          {children}
        </div>
      </Container>
    </section>
  );
}
