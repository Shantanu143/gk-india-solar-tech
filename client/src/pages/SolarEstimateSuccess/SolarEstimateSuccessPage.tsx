import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Seo } from "@/components/layout/Seo";
import { LeadSuccess } from "@/components/leads/LeadSuccess";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import type { ProjectType } from "@/types/solarEstimate";

interface SuccessState {
  leadId: string;
  fullName: string;
  projectType: ProjectType;
  city: string;
  recommendedCapacity: number;
  monthlySaving: number;
}

function isSuccessState(value: unknown): value is SuccessState {
  return !!value && typeof value === "object" && "leadId" in value;
}

export function SolarEstimateSuccessPage() {
  const location = useLocation();
  const state = isSuccessState(location.state) ? location.state : null;

  return (
    <section className="py-14 sm:py-20">
      <Seo
        title="Solar Estimate Request Received | GK India SolarTech"
        description="Your solar estimate request has been received."
        path={ROUTES.solarEstimateSuccess}
        noindex
      />
      <Container className="max-w-2xl">
        {state ? (
          <LeadSuccess
            firstName={state.fullName}
            leadId={state.leadId}
            projectType={state.projectType}
            city={state.city}
            recommendedCapacity={state.recommendedCapacity}
            monthlySaving={state.monthlySaving}
          />
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-navy">We couldn't find a recent estimate</h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Your session may have expired, or this page was opened directly. Start a new free
              solar estimate to continue.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to={ROUTES.solarEstimate}>Start Solar Estimate</Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
