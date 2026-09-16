import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SearchInput } from "@/features/crm/components/SearchInput";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { cn } from "@/lib/utils";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import type { LeadFilters, LeadStatus } from "@/features/leads/types/lead";

const QUICK_FILTERS: { key: string; label: string; status?: LeadStatus }[] = [
  { key: "all", label: "All" },
  { key: "NEW", label: "New", status: "NEW" },
  { key: "CONTACTED", label: "Contacted", status: "CONTACTED" },
  { key: "FOLLOW_UP", label: "Follow-up", status: "FOLLOW_UP" },
  { key: "SURVEY_REQUESTED", label: "Survey", status: "SURVEY_REQUESTED" },
  { key: "QUOTATION_SENT", label: "Quotation", status: "QUOTATION_SENT" },
  { key: "NEGOTIATION", label: "Negotiation", status: "NEGOTIATION" },
];

const PAGE_SIZE = 10;

export function EmployeeLeadsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [quickFilter, setQuickFilter] = useState("all");
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);

  const activeStatus = QUICK_FILTERS.find((f) => f.key === quickFilter)?.status;
  const filters: LeadFilters = { assignedEmployeeId: user?.id, status: activeStatus, search };

  const { data, isLoading, isError, refetch } = useLeads({ ...filters, page, pageSize: PAGE_SIZE });

  return (
    <div className="flex flex-col gap-5">
      <Seo title="My Leads | GK India SolarTech CRM" description="My assigned leads." path={CRM_ROUTES.employeeLeads} noindex />
      <PageHeader title="My Leads" description="Leads assigned to you across every stage of the pipeline." />

      <Card className="p-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, mobile, email or Lead ID…" />
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => { setQuickFilter(filter.key); setPage(1); }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
                quickFilter === filter.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
              )}
            >
              {filter.status ? LEAD_STATUS_CONFIG[filter.status].label : filter.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-2 sm:p-4">
        <LeadsTable
          leads={data?.items ?? []}
          detailPath={CRM_ROUTES.employeeLeadDetail}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
          emptyTitle="No leads assigned yet"
          emptyDescription="You don't have any leads assigned yet."
        />
      </Card>
    </div>
  );
}
