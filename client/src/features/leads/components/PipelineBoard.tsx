import { useMemo, useState } from "react";
import { useAuth } from "@/features/crm/hooks/authContext";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { getFollowUpDateTime } from "@/features/followups/types/followUp";
import { LeadPipelineCard } from "@/features/leads/components/LeadPipelineCard";
import { useUpdateLeadStatus } from "@/features/leads/hooks/useLeadMutations";
import { PIPELINE_COLUMNS } from "@/features/leads/utils/leadStatusConfig";
import { cn } from "@/lib/utils";
import type { Lead } from "@/features/leads/types/lead";

interface PipelineBoardProps {
  leads: Lead[];
  detailPath: (leadId: string) => string;
}

export function PipelineBoard({ leads, detailPath }: PipelineBoardProps) {
  const { user } = useAuth();
  const { data: followUps = [] } = useFollowUps({ status: "PENDING" });
  const updateStatus = useUpdateLeadStatus();
  const [mobileColumn, setMobileColumn] = useState(PIPELINE_COLUMNS[0].key);

  const nextFollowUpByLead = useMemo(() => {
    const map = new Map<string, (typeof followUps)[number]>();
    for (const followUp of [...followUps].sort(
      (a, b) => getFollowUpDateTime(a).getTime() - getFollowUpDateTime(b).getTime(),
    )) {
      if (!map.has(followUp.leadId)) map.set(followUp.leadId, followUp);
    }
    return map;
  }, [followUps]);

  const leadsByColumn = useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const column of PIPELINE_COLUMNS) {
      map.set(column.key, leads.filter((lead) => column.statuses.includes(lead.status)));
    }
    return map;
  }, [leads]);

  function moveLead(leadId: string, status: Parameters<typeof updateStatus.mutate>[0]["status"]) {
    updateStatus.mutate({ leadId, status, actorName: user?.name ?? "System" });
  }

  return (
    <div>
      {/* Mobile: segmented stage selector + stacked cards for the active stage */}
      <div className="lg:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {PIPELINE_COLUMNS.map((column) => (
            <button
              key={column.key}
              type="button"
              onClick={() => setMobileColumn(column.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
                mobileColumn === column.key ? "border-orange bg-orange/10 text-orange-dark" : "border-border text-muted-foreground",
              )}
            >
              {column.label} ({leadsByColumn.get(column.key)?.length ?? 0})
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {(leadsByColumn.get(mobileColumn) ?? []).length === 0 ? (
            <EmptyState title="No leads in this stage" />
          ) : (
            leadsByColumn.get(mobileColumn)?.map((lead) => (
              <LeadPipelineCard
                key={lead.id}
                lead={lead}
                detailHref={detailPath(lead.id)}
                nextFollowUp={nextFollowUpByLead.get(lead.id)}
                onMove={(status) => moveLead(lead.id, status)}
              />
            ))
          )}
        </div>
      </div>

      {/* Desktop/tablet: horizontal Kanban */}
      <div className="hidden gap-4 overflow-x-auto pb-2 lg:flex">
        {PIPELINE_COLUMNS.map((column) => {
          const columnLeads = leadsByColumn.get(column.key) ?? [];
          return (
            <div key={column.key} className="w-72 shrink-0 rounded-2xl border border-white/50 bg-white/35 p-3 backdrop-blur-lg">
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-navy">{column.label}</h3>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {columnLeads.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {columnLeads.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">No leads</p>
                ) : (
                  columnLeads.map((lead) => (
                    <LeadPipelineCard
                      key={lead.id}
                      lead={lead}
                      detailHref={detailPath(lead.id)}
                      nextFollowUp={nextFollowUpByLead.get(lead.id)}
                      onMove={(status) => moveLead(lead.id, status)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
