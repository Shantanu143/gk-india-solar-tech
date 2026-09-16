import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/layout/Container";
import { trustItems } from "@/data/whyChooseUs";

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface py-8">
      <Container>
        <Reveal className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-navy/80">
              <Icon className="h-5 w-5 text-orange" aria-hidden="true" />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
