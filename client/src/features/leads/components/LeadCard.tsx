import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { PROJECT_TYPE_LABEL, type Lead } from "@/features/leads/types/lead";
import { getEmployeeById } from "@/features/employees/utils/employeeCache";
import { formatDate } from "@/lib/format";
import type { FollowUp } from "@/features/followups/types/followUp";

interface LeadCardProps {
  lead: Lead;
  detailHref: string;
  nextFollowUp?: FollowUp;
  showAssignee?: boolean;
}

export function LeadCard({ lead, detailHref, nextFollowUp, showAssignee = true }: LeadCardProps) {
  const employee = getEmployeeById(lead.assignedEmployeeId);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-bold text-navy">{lead.customer.fullName}</p>
          <p className="text-xs text-muted-foreground">{lead.leadId}</p>
        </div>
        <PriorityBadge priority={lead.priority} />
      </div>

      <p className="mt-2 text-sm text-foreground/80">
        {PROJECT_TYPE_LABEL[lead.projectType]} · {lead.solarRecommendation.recommendedCapacity} kW
      </p>
      <p className="text-sm text-muted-foreground">{lead.location.city}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LeadStatusBadge status={lead.status} />
        {showAssignee && employee && (
          <span className="text-xs text-muted-foreground">Assigned: {employee.name}</span>
        )}
      </div>

      {nextFollowUp && (
        <p className="mt-2 text-xs text-muted-foreground">
          Next follow-up: <span className="font-semibold text-navy">{formatDate(`${nextFollowUp.date}T00:00:00`)}</span>
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${lead.customer.mobile}`}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-semibold text-navy hover:bg-navy/5"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        <a
          href={`https://wa.me/91${lead.customer.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-semibold text-navy hover:bg-navy/5"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
      <Link
        to={detailHref}
        className="mt-2 flex h-9 items-center justify-center rounded-lg bg-navy/8 text-sm font-semibold text-navy hover:bg-navy/15"
      >
        View Lead
      </Link>
    </Card>
  );
}
