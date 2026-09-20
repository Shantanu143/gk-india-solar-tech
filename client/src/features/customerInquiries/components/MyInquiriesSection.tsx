import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import { useMyInquiries } from "@/features/customerInquiries/hooks/useMyInquiries";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { LOST_REASON_LABEL, PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { PartnerPipeline } from "@/features/partners/components/PartnerPipeline";
import { buildPartnerLeadPipeline } from "@/features/partners/utils/partnerPipeline";
import { formatDate } from "@/lib/format";

export function MyInquiriesSection() {
  const { data: inquiries, isLoading, isError } = useMyInquiries();

  return (
    <Card className="mt-6 p-5 sm:p-8">
      <h2 className="text-base font-bold text-navy">My Inquiries</h2>
      <p className="mt-1 text-sm text-muted-foreground">The status of every solar estimate you've requested.</p>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading…
          </div>
        ) : isError ? (
          <p className="text-sm text-error">Couldn't load your inquiries right now. Please refresh the page.</p>
        ) : !inquiries || inquiries.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5">
            <p className="text-sm text-muted-foreground">You haven't requested a solar estimate yet.</p>
            <Button asChild size="sm">
              <Link to={ROUTES.solarEstimate}>Get a Free Solar Estimate</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {inquiries.map(({ lead, project }) => {
              const { stages, isLost } = buildPartnerLeadPipeline({ status: lead.status, project: project ? { status: project.status } : null });
              return (
                <div key={lead.id} className="rounded-xl border border-border p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{lead.leadId}</p>
                      <p className="mt-0.5 text-sm text-foreground/80">
                        {PROJECT_TYPE_LABEL[lead.projectType]} · {lead.solarRecommendation.recommendedCapacity} kW · Requested{" "}
                        {formatDate(lead.createdAt)}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>

                  {isLost ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      This inquiry didn't proceed{lead.lostReason ? ` (${LOST_REASON_LABEL[lead.lostReason]})` : ""}. Feel free to request a
                      fresh estimate any time.
                    </p>
                  ) : (
                    <PartnerPipeline stages={stages} className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
