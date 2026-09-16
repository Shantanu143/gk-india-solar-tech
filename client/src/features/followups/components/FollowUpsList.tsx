import { useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/crm/components/DataTable";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { useAuth } from "@/features/crm/hooks/authContext";
import { cn } from "@/lib/utils";
import { CompleteFollowUpModal } from "@/features/followups/components/CompleteFollowUpModal";
import { FollowUpCard } from "@/features/followups/components/FollowUpCard";
import { FollowUpStatusBadge } from "@/features/followups/components/FollowUpStatusBadge";
import { RescheduleFollowUpModal } from "@/features/followups/components/RescheduleFollowUpModal";
import { useCancelFollowUp } from "@/features/followups/hooks/useFollowUpMutations";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { FOLLOW_UP_TYPE_LABEL, type FollowUp, type FollowUpFilters } from "@/features/followups/types/followUp";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate, formatTime } from "@/lib/format";

const SCOPES: { key: NonNullable<FollowUpFilters["scope"]> | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "overdue", label: "Overdue" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

interface FollowUpsListProps {
  assignedEmployeeId?: string;
  leadDetailPath: (leadId: string) => string;
  initialScope?: (typeof SCOPES)[number]["key"];
}

export function FollowUpsList({ assignedEmployeeId, leadDetailPath, initialScope = "all" }: FollowUpsListProps) {
  const [scope, setScope] = useState<(typeof SCOPES)[number]["key"]>(initialScope);
  const { user } = useAuth();
  const { data: followUps = [], isLoading, isError, refetch } = useFollowUps({
    assignedEmployeeId,
    scope: scope === "all" ? undefined : scope,
  });
  const cancelFollowUp = useCancelFollowUp();

  const [completingFollowUp, setCompletingFollowUp] = useState<FollowUp | null>(null);
  const [reschedulingFollowUp, setReschedulingFollowUp] = useState<FollowUp | null>(null);
  const [cancelTarget, setCancelTarget] = useState<FollowUp | null>(null);

  const columns: DataTableColumn<FollowUp>[] = [
    { key: "customer", header: "Customer", render: (f) => <span className="font-semibold text-navy">{f.customerName}</span> },
    {
      key: "lead",
      header: "Lead",
      render: (f) => (
        <Link to={leadDetailPath(f.leadId)} className="text-xs font-semibold text-navy hover:text-orange">
          View Lead
        </Link>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (f) => <span className="text-sm text-foreground/80">{getEmployeeById(f.assignedEmployeeId)?.name ?? "—"}</span>,
    },
    { key: "type", header: "Type", render: (f) => <span className="text-sm text-foreground/80">{FOLLOW_UP_TYPE_LABEL[f.type]}</span> },
    { key: "date", header: "Date", render: (f) => <span className="text-sm text-foreground/80">{formatDate(`${f.date}T00:00:00`)}</span> },
    { key: "time", header: "Time", render: (f) => <span className="text-sm text-foreground/80">{formatTime(`${f.date}T${f.time}:00`)}</span> },
    { key: "status", header: "Status", render: (f) => <FollowUpStatusBadge followUp={f} /> },
    { key: "priority", header: "Priority", render: (f) => <PriorityBadge priority={f.priority} /> },
    {
      key: "notes",
      header: "Notes",
      render: (f) => <span className="block max-w-[180px] truncate text-xs text-muted-foreground">{f.notes ?? "—"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (f) =>
        f.status === "PENDING" ? (
          <div className="flex gap-3 whitespace-nowrap">
            <button type="button" onClick={() => setCompletingFollowUp(f)} className="text-xs font-semibold text-green hover:underline">
              Mark Complete
            </button>
            <button type="button" onClick={() => setReschedulingFollowUp(f)} className="text-xs font-semibold text-navy hover:underline">
              Reschedule
            </button>
            <button type="button" onClick={() => setCancelTarget(f)} className="text-xs font-semibold text-error hover:underline">
              Cancel
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {SCOPES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setScope(s.key)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap",
              scope === s.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/60 bg-white/55 p-2 shadow-[0_8px_32px_-12px_rgba(0,22,63,0.12)] backdrop-blur-xl sm:p-4">
        <DataTable
          columns={columns}
          rows={followUps}
          rowKey={(f) => f.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          emptyTitle={scope === "overdue" ? "No overdue follow-ups" : scope === "today" ? "No follow-ups today" : "No follow-ups found"}
          emptyDescription={scope === "today" ? "You're all caught up." : "Try a different filter."}
          renderMobileCard={(f) => (
            <FollowUpCard
              followUp={f}
              leadDetailHref={leadDetailPath(f.leadId)}
              onOpen={f.status === "PENDING" ? () => setCompletingFollowUp(f) : undefined}
            />
          )}
        />
      </div>

      {completingFollowUp && (
        <CompleteFollowUpModal open onOpenChange={() => setCompletingFollowUp(null)} followUp={completingFollowUp} />
      )}
      {reschedulingFollowUp && (
        <RescheduleFollowUpModal open onOpenChange={() => setReschedulingFollowUp(null)} followUp={reschedulingFollowUp} />
      )}
      {cancelTarget && (
        <ConfirmDialog
          open
          onOpenChange={() => setCancelTarget(null)}
          title="Cancel This Follow-up?"
          description={`This cancels the ${FOLLOW_UP_TYPE_LABEL[cancelTarget.type].toLowerCase()} follow-up with ${cancelTarget.customerName}.`}
          confirmLabel="Cancel Follow-up"
          destructive
          isLoading={cancelFollowUp.isPending}
          onConfirm={() =>
            cancelFollowUp.mutate(
              { id: cancelTarget.id, actorName: user?.name ?? "System" },
              { onSuccess: () => setCancelTarget(null) },
            )
          }
        />
      )}
    </div>
  );
}
