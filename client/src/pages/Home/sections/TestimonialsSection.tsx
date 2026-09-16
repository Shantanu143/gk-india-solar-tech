import { Container } from "@/components/layout/Container";
import { TestimonialCard } from "@/components/marketing/TestimonialCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TestimonialsSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading eyebrow="Testimonials" title="What Our Customers Say" />

        <div className="mt-14 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 0.08}>
              <TestimonialCard />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
