import { Container } from "@/components/layout/Container";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading eyebrow="How It Works" title="Your Solar Journey, Made Simple" />
        <div className="mt-16 w-full">
          <ProcessTimeline steps={processSteps} />
        </div>
      </Container>
    </section>
  );
}
