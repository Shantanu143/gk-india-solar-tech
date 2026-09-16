import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Avatar } from "@/features/crm/components/Avatar";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { LeadCard } from "@/features/leads/components/LeadCard";
import { LEAD_SOURCE_LABEL, PROJECT_TYPE_LABEL, type Lead } from "@/features/leads/types/lead";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate } from "@/lib/format";

interface LeadsTableProps {
  leads: Lead[];
  detailPath: (leadId: string) => string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function LeadsTable({
  leads,
  detailPath,
  isLoading,
  isError,
  onRetry,
  page,
  pageSize,
  total,
  onPageChange,
  emptyTitle,
  emptyDescription,
}: LeadsTableProps) {
  const columns: DataTableColumn<Lead>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (lead) => (
        <Link to={detailPath(lead.id)} className="block hover:text-orange">
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
      key: "location",
      header: "Location",
      render: (lead) => <span className="text-sm text-foreground/80">{lead.location.city}</span>,
    },
    {
      key: "source",
      header: "Source",
      render: (lead) => <span className="text-sm text-foreground/80">{LEAD_SOURCE_LABEL[lead.source]}</span>,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (lead) => {
        const employee = getEmployeeById(lead.assignedEmployeeId);
        return employee ? (
          <div className="flex items-center gap-2">
            <Avatar name={employee.name} size="sm" />
            <span className="text-sm text-foreground/80">{employee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        );
      },
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
    {
      key: "action",
      header: "Action",
      render: (lead) => (
        <Link
          to={detailPath(lead.id)}
          aria-label={`View ${lead.customer.fullName}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-navy hover:bg-navy/8"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={leads}
      rowKey={(lead) => lead.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle={emptyTitle ?? "No leads found"}
      emptyDescription={emptyDescription ?? "Try changing your filters or search."}
      renderMobileCard={(lead) => <LeadCard lead={lead} detailHref={detailPath(lead.id)} />}
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
    />
  );
}
