import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, UserPlus } from "lucide-react";
import { Seo } from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/features/crm/components/Avatar";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { FilterSelect } from "@/features/crm/components/FilterSelect";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SearchInput } from "@/features/crm/components/SearchInput";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useAdminPartners } from "@/features/partners/hooks/useAdminPartners";
import { PARTNER_STATUS_LABEL, PARTNER_TYPE_LABEL, type Partner, type PartnerApplicationStatus, type PartnerType } from "@/features/partners/types/partner";
import { PARTNER_STATUS_TONE } from "@/features/partners/utils/partnerStatusConfig";
import { formatDate } from "@/lib/format";

const PAGE_SIZE = 20;

export function AdminPartnersPage() {
  const [status, setStatus] = useState<PartnerApplicationStatus | "ALL">("ALL");
  const [type, setType] = useState<PartnerType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAdminPartners({
    status: status === "ALL" ? undefined : status,
    type: type === "ALL" ? undefined : type,
    search: search || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function updateSearch(next: string) {
    setSearch(next);
    setPage(1);
  }

  function updateStatus(next: string) {
    setStatus(next === "ALL" ? "ALL" : (next as PartnerApplicationStatus));
    setPage(1);
  }

  function updateType(next: string) {
    setType(next === "ALL" ? "ALL" : (next as PartnerType));
    setPage(1);
  }

  const columns: DataTableColumn<Partner>[] = [
    {
      key: "partner",
      header: "Partner",
      render: (p) => (
        <Link to={CRM_ROUTES.adminPartnerDetail(p.id)} className="flex items-center gap-2.5 hover:text-orange">
          <Avatar name={p.name} size="sm" />
          <div>
            <span className="block font-semibold text-navy">{p.name}</span>
            {p.companyName && <span className="block text-xs text-muted-foreground">{p.companyName}</span>}
          </div>
        </Link>
      ),
    },
    { key: "type", header: "Type", render: (p) => <span className="text-sm text-foreground/80">{PARTNER_TYPE_LABEL[p.type]}</span> },
    {
      key: "contact",
      header: "Contact",
      render: (p) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {p.mobile}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {p.email}
          </span>
        </div>
      ),
    },
    {
      key: "partnerId",
      header: "Partner ID",
      render: (p) => <span className="font-mono text-xs text-muted-foreground">{p.partnerId ?? "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusBadge label={PARTNER_STATUS_LABEL[p.applicationStatus]} tone={PARTNER_STATUS_TONE[p.applicationStatus]} />,
    },
    { key: "created", header: "Applied On", render: (p) => <span className="text-sm text-muted-foreground">{formatDate(p.createdAt)}</span> },
    {
      key: "action",
      header: "Action",
      render: (p) => (
        <Link to={CRM_ROUTES.adminPartnerDetail(p.id)} className="text-xs font-semibold text-navy hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Seo
        title="Partners | GK India SolarTech CRM"
        description="Review and manage partner-program applications."
        path={CRM_ROUTES.adminPartners}
        noindex
      />
      <PageHeader
        title="Partners"
        description="Review applications, and manage approved sales, installation and EPC partners."
        actions={
          <Button asChild size="sm" className="gap-1.5">
            <Link to={CRM_ROUTES.adminPartnerNew}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Add Partner
            </Link>
          </Button>
        }
      />

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={updateSearch} placeholder="Search by name, company, mobile or email…" className="sm:max-w-xs" />
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="Status"
            value={status}
            onChange={updateStatus}
            options={[{ value: "ALL", label: "All Statuses" }, ...Object.entries(PARTNER_STATUS_LABEL).map(([value, label]) => ({ value, label }))]}
            className="w-40"
          />
          <FilterSelect
            label="Type"
            value={type}
            onChange={updateType}
            options={[{ value: "ALL", label: "All Types" }, ...Object.entries(PARTNER_TYPE_LABEL).map(([value, label]) => ({ value, label }))]}
            className="w-56"
          />
        </div>
      </Card>

      <Card className="p-2 sm:p-4">
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          rowKey={(p) => p.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle="No partners found"
          emptyDescription="Adjust your filters, or check back once applications come in."
          renderMobileCard={(p) => (
            <Link
              to={CRM_ROUTES.adminPartnerDetail(p.id)}
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 text-sm hover:border-orange/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy">{p.name}</span>
                <StatusBadge label={PARTNER_STATUS_LABEL[p.applicationStatus]} tone={PARTNER_STATUS_TONE[p.applicationStatus]} />
              </div>
              <span className="text-xs text-muted-foreground">{PARTNER_TYPE_LABEL[p.type]}</span>
              <span className="text-xs text-muted-foreground">{p.mobile}</span>
            </Link>
          )}
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
