import { Section } from "@/components/marketing/kit/Section";
import { StepsGrid } from "@/components/marketing/kit/StepsGrid";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <Section id="how-it-works" eyebrow="How It Works" title="Your Solar Journey, Made Simple">
      <StepsGrid steps={processSteps} columns={4} />
    </Section>
  );
}
