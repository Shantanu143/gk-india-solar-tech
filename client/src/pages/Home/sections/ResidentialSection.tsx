import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

const benefits = [
  "Reduced electricity expenses",
  "Rooftop solar designed for your home",
  "Professional installation",
  "Government subsidy assistance",
  "Net metering support",
];

export function ResidentialSection() {
  return (
    <SplitFeature
      eyebrow="Residential Solar"
      title="Power Your Home With Solar"
      description="Bring down your monthly electricity expenses with a rooftop solar system designed for your home, backed by professional installation and ongoing support."
      bullets={benefits}
      image="/images/installer.jpg"
      imageAlt="Installer fitting a solar panel on a home rooftop"
      badge={{ icon: Home, value: "Rooftop", label: "Designed for your home" }}
      actions={
        <>
          <Button asChild size="lg">
            <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link to={ROUTES.residentialSolar}>Learn More</Link>
          </Button>
        </>
      }
    />
  );
}
