import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import type { Lead } from "@/features/leads/types/lead";
import { useStartSurvey } from "@/features/surveys/hooks/useSurveyMutations";
import type { Survey } from "@/features/surveys/types/survey";
import { formatDate, formatTime } from "@/lib/format";

interface StartSurveyPanelProps {
  survey: Survey;
  lead: Lead;
  leadDetailHref: string;
}

export function StartSurveyPanel({ survey, lead, leadDetailHref }: StartSurveyPanelProps) {
  const startSurvey = useStartSurvey();

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-base font-bold text-navy">Start Site Survey</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Customer</p>
          <p className="mt-0.5 text-sm font-semibold text-navy">{survey.customerName}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Address</p>
          <p className="mt-0.5 text-sm text-foreground/90">{survey.address}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Date</p>
          <p className="mt-0.5 text-sm text-foreground/90">{formatDate(`${survey.date}T00:00:00`)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Time</p>
          <p className="mt-0.5 text-sm text-foreground/90">{formatTime(`${survey.date}T${survey.time}:00`)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Lead</p>
          <Link to={leadDetailHref} className="mt-0.5 block text-sm font-semibold text-navy hover:text-orange">
            {lead.leadId}
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Recommended Capacity</p>
          <p className="mt-0.5 text-sm text-foreground/90">{lead.solarRecommendation.recommendedCapacity} kW</p>
        </div>
      </div>

      {startSurvey.isError && <p className="mt-3 text-sm text-error">Couldn't start this survey. Please try again.</p>}

      <Button size="lg" className="mt-5 w-full" disabled={startSurvey.isPending} onClick={() => startSurvey.mutate(survey.id)}>
        {startSurvey.isPending ? "Starting…" : "Start"}
      </Button>
    </Card>
  );
}
