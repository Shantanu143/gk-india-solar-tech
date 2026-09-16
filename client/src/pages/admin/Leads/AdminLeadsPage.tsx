import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SearchInput } from "@/features/crm/components/SearchInput";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { LeadFiltersBar } from "@/features/leads/components/LeadFiltersBar";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { useLeads } from "@/features/leads/hooks/useLeads";
import type { LeadFilters } from "@/features/leads/types/lead";

const PAGE_SIZE = 10;

export function AdminLeadsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<LeadFilters>({ search: searchParams.get("q") ?? "" });
  const [page, setPage] = useState(1);
  const { data: employees = [] } = useEmployees();

  const { data, isLoading, isError, refetch } = useLeads({ ...filters, page, pageSize: PAGE_SIZE });

  function updateFilters(next: LeadFilters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Leads | GK India SolarTech CRM" description="All leads." path={CRM_ROUTES.adminLeads} noindex />
      <PageHeader title="Leads" description="Search, filter and assign leads across your sales pipeline." />

      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <SearchInput
            value={filters.search ?? ""}
            onChange={(search) => updateFilters({ ...filters, search })}
            placeholder="Search by customer name, mobile, email or Lead ID…"
          />
          <LeadFiltersBar filters={filters} onChange={updateFilters} employees={employees} />
        </div>
      </Card>

      <Card className="p-2 sm:p-4">
        <LeadsTable
          leads={data?.items ?? []}
          detailPath={CRM_ROUTES.adminLeadDetail}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}
