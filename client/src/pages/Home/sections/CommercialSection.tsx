import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

export function CommercialSection() {
  return (
    <SplitFeature
      tone="muted"
      reverse
      eyebrow="Commercial Solar"
      title="Smarter Energy For Your Business"
      description="Commercial solar can help businesses move toward cleaner and more efficient energy usage, with system design and installation managed by our EPC team."
      bullets={["Lower operating costs", "Scalable system design", "Minimal disruption to operations", "Professional EPC support"]}
      image="/images/commercial.jpg"
      imageAlt="Solar array beside a commercial building"
      badge={{ icon: Building2, value: "EPC", label: "End-to-end delivery" }}
      actions={
        <Button asChild variant="secondary" size="lg">
          <Link to={ROUTES.commercialSolar}>Explore Commercial Solar</Link>
        </Button>
      }
    />
  );
}
