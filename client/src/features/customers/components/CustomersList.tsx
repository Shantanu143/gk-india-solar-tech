import { Link } from "react-router-dom";
import { Avatar } from "@/features/crm/components/Avatar";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { PROJECT_TYPE_LABEL } from "@/features/leads/types/lead";
import type { Customer } from "@/features/customers/types/customer";
import { formatDate } from "@/lib/format";

interface CustomersListProps {
  customers: Customer[];
  detailPath: (customerId: string) => string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function CustomersList({ customers, detailPath, isLoading, isError, onRetry, page, pageSize, total, onPageChange }: CustomersListProps) {
  const columns: DataTableColumn<Customer>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (c) => (
        <Link to={detailPath(c.id)} className="flex items-center gap-2.5 hover:text-orange">
          <Avatar name={c.fullName} size="sm" />
          <span className="font-semibold text-navy">{c.fullName}</span>
        </Link>
      ),
    },
    { key: "mobile", header: "Mobile", render: (c) => <span className="text-sm text-foreground/80">{c.mobile}</span> },
    { key: "type", header: "Type", render: (c) => <span className="text-sm text-foreground/80">{PROJECT_TYPE_LABEL[c.projectType]}</span> },
    {
      key: "capacity",
      header: "Capacity",
      render: (c) => <span className="text-sm text-foreground/80">{c.systemCapacityKw ? `${c.systemCapacityKw} kW` : "—"}</span>,
    },
    { key: "address", header: "Address", render: (c) => <span className="text-sm text-foreground/80">{c.address}</span> },
    { key: "since", header: "Customer Since", render: (c) => <span className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</span> },
    {
      key: "action",
      header: "Action",
      render: (c) => (
        <Link to={detailPath(c.id)} className="text-xs font-semibold text-navy hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={customers}
      rowKey={(c) => c.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="No customers yet"
      emptyDescription="A customer is created automatically once a lead accepts their quotation."
      renderMobileCard={(c) => (
        <Link to={detailPath(c.id)} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 text-sm hover:border-orange/40">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-navy">{c.fullName}</span>
            <span className="text-xs text-muted-foreground">{PROJECT_TYPE_LABEL[c.projectType]}</span>
          </div>
          <span className="text-xs text-muted-foreground">{c.mobile}</span>
          <span className="text-xs text-muted-foreground">{c.address}</span>
        </Link>
      )}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
    />
  );
}
