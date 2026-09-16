import { Container } from "@/components/layout/Container";
import { SavingsPreview } from "@/components/marketing/SavingsPreview";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SavingsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Savings Snapshot"
          title="See What Switching To Solar Could Look Like"
          description="A simplified example of how a typical electricity bill can change after going solar."
        />
        <div className="mt-14 w-full">
          <SavingsPreview />
        </div>
      </Container>
    </section>
  );
}
