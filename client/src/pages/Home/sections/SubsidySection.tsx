import { Link } from "react-router-dom";
import { ExternalLink, IndianRupee } from "lucide-react";
import { SplitFeature } from "@/components/marketing/kit/SplitFeature";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import { PM_SURYA_GHAR_PORTAL_URL } from "@/config/solarConfig";

export function SubsidySection() {
  return (
    <SplitFeature
      reverse
      eyebrow="Government Subsidy"
      title="Get Assistance With Government Solar Subsidy"
      description="GK India SolarTech helps customers understand the applicable solar subsidy process for their installation. Figures are estimated and subject to eligibility under applicable government scheme rules."
      bullets={["Eligibility explained clearly", "Application support after installation", "Residential rooftop focus"]}
      image="/images/house-pool.jpg"
      imageAlt="Indian rupee notes"
      badge={{ icon: IndianRupee, value: "₹78,000", label: "Max. central subsidy (est.)" }}
      actions={
        <>
          <Button asChild size="lg">
            <Link to={ROUTES.subsidy}>Check Subsidy Eligibility</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={PM_SURYA_GHAR_PORTAL_URL} target="_blank" rel="noopener noreferrer">
              PM Surya Ghar Portal
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </>
      }
    />
  );
}
