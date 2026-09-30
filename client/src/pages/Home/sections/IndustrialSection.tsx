import { Link } from "react-router-dom";
import { Factory } from "lucide-react";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

const focusAreas = [
  "Scalable, large-scale system design",
  "Professional end-to-end EPC delivery",
  "Built for industrial applications",
  "Dedicated installation support",
];

export function IndustrialSection() {
  return (
    <SplitFeature
      eyebrow="Industrial Solar"
      title="Powering Industrial Growth With Solar"
      description="Large-scale solar solutions engineered for industrial requirements, from initial design through installation."
      bullets={focusAreas}
      image="/images/industrial.jpg"
      imageAlt="Solar panels covering an industrial roof at sunset"
      badge={{ icon: Factory, value: "Large-scale", label: "Industrial capacity" }}
      actions={
        <Button asChild variant="secondary" size="lg">
          <Link to={ROUTES.industrialSolar}>Explore Industrial Solar</Link>
        </Button>
      }
    />
  );
}
