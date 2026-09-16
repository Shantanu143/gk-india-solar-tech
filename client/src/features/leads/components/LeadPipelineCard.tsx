import { Link } from "react-router-dom";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { Avatar } from "@/features/crm/components/Avatar";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { PIPELINE_COLUMNS } from "@/features/leads/utils/leadStatusConfig";
import { PROJECT_TYPE_LABEL, type Lead, type LeadStatus } from "@/features/leads/types/lead";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate } from "@/lib/format";
import type { FollowUp } from "@/features/followups/types/followUp";

interface LeadPipelineCardProps {
  lead: Lead;
  detailHref: string;
  nextFollowUp?: FollowUp;
  onMove: (status: LeadStatus) => void;
}

export function LeadPipelineCard({ lead, detailHref, nextFollowUp, onMove }: LeadPipelineCardProps) {
  const employee = getEmployeeById(lead.assignedEmployeeId);

  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <Link to={detailHref} className="min-w-0">
          <p className="truncate text-sm font-bold text-navy hover:text-orange">{lead.customer.fullName}</p>
          <p className="text-xs text-muted-foreground">{lead.leadId}</p>
        </Link>
        <PriorityBadge priority={lead.priority} />
      </div>

      <p className="mt-2 text-xs text-foreground/80">
        {PROJECT_TYPE_LABEL[lead.projectType]} · {lead.solarRecommendation.recommendedCapacity} kW
      </p>
      <p className="text-xs text-muted-foreground">{lead.location.city}</p>

      <div className="mt-2.5 flex items-center justify-between">
        {employee ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={employee.name} size="sm" />
            <span className="text-xs text-foreground/70">{employee.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}
      </div>

      {nextFollowUp && (
        <p className="mt-2 text-xs text-muted-foreground">
          Next: <span className="font-semibold text-navy">{formatDate(`${nextFollowUp.date}T00:00:00`)}</span>
        </p>
      )}

      <select
        aria-label={`Move ${lead.customer.fullName}`}
        value=""
        onChange={(e) => e.target.value && onMove(e.target.value as LeadStatus)}
        className="mt-3 h-8 w-full rounded-md border border-border bg-surface px-2 text-xs font-medium text-navy focus:border-orange"
      >
        <option value="">Move to…</option>
        {PIPELINE_COLUMNS.map((column) => (
          <option key={column.key} value={column.primaryStatus}>
            {column.label}
          </option>
        ))}
      </select>
    </Card>
  );
}
