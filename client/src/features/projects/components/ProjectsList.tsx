import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { cn } from "@/lib/utils";
import { useCustomer } from "@/features/customers/hooks/useCustomers";
import { ProjectStatusBadge } from "@/features/projects/components/ProjectStatusBadge";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES, type Project, type ProjectStatus } from "@/features/projects/types/project";
import { formatDate } from "@/lib/format";

function CustomerCell({ customerId, detailHref }: { customerId: string; detailHref: string }) {
  const { data: customer } = useCustomer(customerId);
  return (
    <Link to={detailHref} className="font-semibold text-navy hover:text-orange">
      {customer?.fullName ?? "—"}
    </Link>
  );
}

interface ProjectsListProps {
  assignedEmployeeId?: string;
  detailPath: (projectId: string) => string;
}

export function ProjectsList({ assignedEmployeeId, detailPath }: ProjectsListProps) {
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const navigate = useNavigate();

  const { data: projects = [], isLoading, isError, refetch } = useProjects({
    assignedEmployeeId,
    status: status === "all" ? undefined : status,
  });

  const columns: DataTableColumn<Project>[] = [
    { key: "customer", header: "Customer", render: (p) => <CustomerCell customerId={p.customerId} detailHref={detailPath(p.id)} /> },
    { key: "number", header: "Project #", render: (p) => <span className="font-mono text-xs text-muted-foreground">{p.projectNumber}</span> },
    { key: "capacity", header: "Capacity", render: (p) => <span className="text-sm text-foreground/80">{p.systemCapacityKw} kW</span> },
    { key: "status", header: "Status", render: (p) => <ProjectStatusBadge status={p.status} /> },
    { key: "created", header: "Started", render: (p) => <span className="text-sm text-foreground/80">{formatDate(p.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <button type="button" onClick={() => navigate(detailPath(p.id))} className="text-xs font-semibold text-navy hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setStatus("all")}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
            status === "all" ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
          )}
        >
          All
        </button>
        {PROJECT_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
              status === s ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
            )}
          >
            {PROJECT_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/60 bg-white/55 p-2 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl sm:p-4">
        <DataTable
          columns={columns}
          rows={projects}
          rowKey={(p) => p.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle="No projects found"
          emptyDescription="A project is created automatically once a customer accepts their quotation."
          renderMobileCard={(p) => (
            <Link
              to={detailPath(p.id)}
              className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3 text-sm hover:border-orange/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{p.projectNumber}</span>
                <ProjectStatusBadge status={p.status} />
              </div>
              <span className="font-semibold text-navy">{p.systemCapacityKw} kW</span>
              <span className="text-xs text-muted-foreground">Started {formatDate(p.createdAt)}</span>
            </Link>
          )}
        />
      </div>
    </div>
  );
}
