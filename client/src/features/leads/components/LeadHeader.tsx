import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/features/crm/components/StatusBadge";
import { LeadStatusBadge } from "@/features/leads/components/LeadStatusBadge";
import { PROJECT_TYPE_LABEL, type Lead } from "@/features/leads/types/lead";

const INTEREST_TONE = { LOW: "neutral", MEDIUM: "amber", HIGH: "green" } as const;

interface LeadHeaderProps {
  lead: Lead;
  backHref: string;
}

export function LeadHeader({ lead, backHref }: LeadHeaderProps) {
  return (
    <div>
      <Link to={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-navy">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Leads
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">{lead.customer.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            {lead.leadId} · {PROJECT_TYPE_LABEL[lead.projectType]} · {lead.location.city}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LeadStatusBadge status={lead.status} />
          <StatusBadge label={`${lead.interest.charAt(0)}${lead.interest.slice(1).toLowerCase()} Interest`} tone={INTEREST_TONE[lead.interest]} />
        </div>
      </div>
    </div>
  );
}
