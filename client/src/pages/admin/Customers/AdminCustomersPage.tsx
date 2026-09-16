import { useState } from "react";
import { Seo } from "@/components/layout/Seo";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PageHeader } from "@/features/crm/components/PageHeader";
import { SearchInput } from "@/features/crm/components/SearchInput";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { CustomersList } from "@/features/customers/components/CustomersList";
import { useCustomers } from "@/features/customers/hooks/useCustomers";

const PAGE_SIZE = 20;

export function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCustomers({ search, page, pageSize: PAGE_SIZE });

  function updateSearch(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Customers | GK India SolarTech CRM" description="Converted customer directory." path={CRM_ROUTES.adminCustomers} noindex />
      <PageHeader title="Customers" description="Every lead that has converted, with their project details." />

      <Card className="p-4">
        <SearchInput value={search} onChange={updateSearch} placeholder="Search by name, mobile, email or address…" />
      </Card>

      <Card className="p-2 sm:p-4">
        <CustomersList
          customers={data?.items ?? []}
          detailPath={CRM_ROUTES.adminCustomerDetail}
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
