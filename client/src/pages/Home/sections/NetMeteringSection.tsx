import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";

export function NetMeteringSection() {
  return (
    <SplitFeature
      tone="muted"
      eyebrow="Net Metering"
      title="Get Support With Net Metering"
      description="Our team can assist customers through the net-metering process associated with their solar installation, from application to commissioning."
      bullets={["Application prepared & submitted for you", "Follow-up with your distribution company", "Bi-directional meter coordination"]}
      image="/images/offshore-wind.jpg"
      imageAlt="Offshore wind turbines feeding the grid"
      badge={{ icon: Zap, value: "Grid-tied", label: "Export surplus power" }}
      actions={
        <Button asChild variant="secondary" size="lg">
          <Link to={ROUTES.netMetering}>Learn About Net Metering</Link>
        </Button>
      }
    />
  );
}
