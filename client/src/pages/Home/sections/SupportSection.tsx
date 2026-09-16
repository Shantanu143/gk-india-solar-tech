import { Link } from "react-router-dom";
import { Settings, Wrench } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/constant/routes";

export function SupportSection() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container className="flex flex-col items-center">
        <SectionHeading eyebrow="Installation & AMC" title="Support That Continues After Installation" />

        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:max-w-2xl">
          <Reveal>
            <FeatureCard
              icon={Wrench}
              title="Professional Installation"
              description="Professional solar installation and project support, managed end-to-end by our EPC team."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <FeatureCard
              icon={Settings}
              title="AMC & Support"
              description="Post-installation service, maintenance and support to keep your system performing."
            />
          </Reveal>
        </div>

        <Button asChild size="lg" className="mt-10">
          <Link to={ROUTES.contact}>Contact Our Team</Link>
        </Button>
      </Container>
    </section>
  );
}
