import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, MapPin, Phone } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { LOST_REASON_LABEL, PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import { PartnerPipeline } from "@/features/partners/components/PartnerPipeline";
import { usePartnerLeadDetail } from "@/features/partners/hooks/usePartnerLeads";
import { buildPartnerLeadPipeline } from "@/features/partners/utils/partnerPipeline";
import { formatDate, formatInr } from "@/lib/format";

export function PartnerLeadDetailPage() {
  const { leadId = "" } = useParams<{ leadId: string }>();
  const { data, isLoading, isError, refetch } = usePartnerLeadDetail(leadId);

  if (isLoading) return <SkeletonRows rows={6} />;
  if (isError || !data) {
    return (
      <ErrorState
        title="We couldn't display this lead."
        description="It may have been removed or the link is incorrect."
        onRetry={() => refetch()}
      />
    );
  }

  const { lead, project } = data;
  const { stages, isLost } = buildPartnerLeadPipeline({
    status: lead.status,
    project: project ? { status: project.status } : null,
  });

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title={`${lead.leadId} | Partner Portal | GK India SolarTech`}
        description="Lead detail."
        path={CRM_ROUTES.partnerLeadDetail(leadId)}
        noindex
      />

      <Link to={CRM_ROUTES.partnerLeads} className="flex w-fit items-center gap-1.5 text-sm font-semibold text-navy hover:text-orange">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to My Leads
      </Link>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{lead.leadId}</p>
            <h1 className="mt-0.5 text-xl font-bold text-navy">{lead.customer.fullName}</h1>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-foreground/80">{lead.customer.mobile}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-foreground/80">{PROJECT_TYPE_LABEL[lead.projectType]}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-foreground/80">{lead.location.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-foreground/80">Submitted {formatDate(lead.createdAt)}</span>
          </div>
        </div>
      </Card>

      {lead.status === "LOST" && (
        <Card className="border-error/30 bg-error/5 p-4">
          <p className="text-sm font-bold text-error">This lead was marked as lost.</p>
          {lead.lostReason && <p className="mt-1 text-sm text-error/80">Reason: {LOST_REASON_LABEL[lead.lostReason]}</p>}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-sm font-bold tracking-wide text-navy uppercase">Progress</h2>
          {isLost ? (
            <p className="mt-3 text-sm text-muted-foreground">
              This lead was marked as lost, so it will no longer progress through the pipeline.
            </p>
          ) : (
            <PartnerPipeline stages={stages} className="mt-4" />
          )}
        </Card>

        <div className="flex flex-col gap-5">
          <Card className="p-4 sm:p-6">
            <h2 className="text-sm font-bold tracking-wide text-navy uppercase">System Estimate</h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Recommended Capacity</dt>
                <dd className="font-semibold text-navy">{lead.solarRecommendation.recommendedCapacity} kW</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Panels</dt>
                <dd className="font-semibold text-navy">{lead.solarRecommendation.estimatedPanels}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Inverter</dt>
                <dd className="font-semibold text-navy">{lead.solarRecommendation.recommendedInverter} kW</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Monthly Bill</dt>
                <dd className="font-semibold text-navy">{formatInr(lead.monthlyBill)}</dd>
              </div>
            </dl>
          </Card>

          {project && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-navy uppercase">Project</h2>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Project No.</dt>
                  <dd className="font-semibold text-navy">{project.projectNumber}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">System Capacity</dt>
                  <dd className="font-semibold text-navy">{project.systemCapacityKw} kW</dd>
                </div>
                {project.completedAt && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Completed On</dt>
                    <dd className="font-semibold text-navy">{formatDate(project.completedAt)}</dd>
                  </div>
                )}
              </dl>
            </Card>
          )}

          {(lead.partnerNote?.requirement || lead.partnerNote?.preferredContactTime || lead.partnerNote?.remarks) && (
            <Card className="p-4 sm:p-6">
              <h2 className="text-sm font-bold tracking-wide text-navy uppercase">Your Notes</h2>
              <dl className="mt-3 flex flex-col gap-3 text-sm">
                {lead.partnerNote?.requirement && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Requirement</dt>
                    <dd className="text-foreground/80">{lead.partnerNote.requirement}</dd>
                  </div>
                )}
                {lead.partnerNote?.preferredContactTime && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Preferred Contact Time</dt>
                    <dd className="text-foreground/80">{lead.partnerNote.preferredContactTime}</dd>
                  </div>
                )}
                {lead.partnerNote?.remarks && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Remarks</dt>
                    <dd className="text-foreground/80">{lead.partnerNote.remarks}</dd>
                  </div>
                )}
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
