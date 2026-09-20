import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { LeadCard } from "@/features/leads/components/LeadCard";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { PROJECT_TYPE_LABEL, type Lead, type LeadStatus } from "@/features/leads/types/lead";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import { PartnerApplicationBanner } from "@/features/partners/components/PartnerApplicationBanner";
import { SubmitLeadModal } from "@/features/partners/components/SubmitLeadModal";
import { usePartnerLeads } from "@/features/partners/hooks/usePartnerLeads";
import { usePartnerProfile } from "@/features/partners/hooks/usePartnerProfile";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS_FILTERS: { key: string; label: string; status?: LeadStatus }[] = [
  { key: "all", label: "All" },
  { key: "NEW", label: "New", status: "NEW" },
  { key: "CONTACTED", label: "Contacted", status: "CONTACTED" },
  { key: "FOLLOW_UP", label: "Follow-up", status: "FOLLOW_UP" },
  { key: "SURVEY_REQUESTED", label: "Survey", status: "SURVEY_REQUESTED" },
  { key: "QUOTATION_SENT", label: "Quotation", status: "QUOTATION_SENT" },
  { key: "NEGOTIATION", label: "Negotiation", status: "NEGOTIATION" },
  { key: "CONVERTED", label: "Booked", status: "CONVERTED" },
  { key: "LOST", label: "Lost", status: "LOST" },
];

export function PartnerLeadsPage() {
  const { data: partner } = usePartnerProfile();
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [submitOpen, setSubmitOpen] = useState(false);

  const activeStatus = STATUS_FILTERS.find((f) => f.key === statusFilter)?.status;
  const { data, isLoading, isError, refetch } = usePartnerLeads({
    status: activeStatus,
    page,
    pageSize: PAGE_SIZE,
    sortDirection: "desc",
  });

  const isApproved = partner?.applicationStatus === "APPROVED";

  const columns: DataTableColumn<Lead>[] = [
    {
      key: "lead",
      header: "Lead",
      render: (lead) => (
        <Link to={CRM_ROUTES.partnerLeadDetail(lead.id)} className="block hover:text-orange">
          <p className="font-semibold text-navy">{lead.customer.fullName}</p>
          <p className="text-xs text-muted-foreground">{lead.leadId}</p>
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (lead) => <span className="text-sm text-foreground/80">{PROJECT_TYPE_LABEL[lead.projectType]}</span>,
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (lead) => <span className="text-sm text-foreground/80">{lead.solarRecommendation.recommendedCapacity} kW</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (lead) => <LeadStatusBadge status={lead.status} />,
    },
    {
      key: "created",
      header: "Created",
      render: (lead) => <span className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Leads | Partner Portal | GK India SolarTech" description="Leads you've submitted." path={CRM_ROUTES.partnerLeads} noindex />

      <PageHeader
        title="My Leads"
        description="Every lead you've submitted, and where it stands."
        actions={
          <Button
            size="sm"
            className="w-full gap-1.5 sm:w-auto"
            disabled={!isApproved}
            title={isApproved ? undefined : "Your application must be approved before you can submit leads."}
            onClick={() => setSubmitOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit New Lead
          </Button>
        }
      />

      {partner && partner.applicationStatus !== "APPROVED" && (
        <PartnerApplicationBanner status={partner.applicationStatus} rejectionReason={partner.rejectionReason} />
      )}

      <Card className="p-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                setStatusFilter(filter.key);
                setPage(1);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
                statusFilter === filter.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
              )}
            >
              {filter.status ? LEAD_STATUS_CONFIG[filter.status].label : filter.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-2 sm:p-4">
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(lead) => lead.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          renderMobileCard={(lead) => <LeadCard lead={lead} detailHref={CRM_ROUTES.partnerLeadDetail(lead.id)} showAssignee={false} />}
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          emptyTitle="No leads yet"
          emptyDescription="Submit your first lead to start earning commission."
        />
      </Card>

      <SubmitLeadModal open={submitOpen} onOpenChange={setSubmitOpen} />
    </div>
  );
}
