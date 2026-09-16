import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassPanel as Card } from "@/features/crm/components/GlassPanel";
import { EmptyState } from "@/features/crm/components/EmptyState";
import { ErrorState } from "@/features/crm/components/ErrorState";
import { PriorityBadge } from "@/features/crm/components/PriorityBadge";
import { SkeletonRows } from "@/features/crm/components/LoadingSkeleton";
import { CompleteFollowUpModal } from "@/features/followups/components/CompleteFollowUpModal";
import { CreateFollowUpModal } from "@/features/followups/components/CreateFollowUpModal";
import { FollowUpStatusBadge } from "@/features/followups/components/FollowUpStatusBadge";
import { RescheduleFollowUpModal } from "@/features/followups/components/RescheduleFollowUpModal";
import { useFollowUps } from "@/features/followups/hooks/useFollowUps";
import { FOLLOW_UP_TYPE_LABEL, isFollowUpOverdue, type FollowUp } from "@/features/followups/types/followUp";
import { formatDate, formatTime } from "@/lib/format";
import type { Lead } from "@/features/leads/types/lead";

export function LeadFollowUpsTab({ lead }: { lead: Lead }) {
  const { data: followUps = [], isLoading, isError, refetch } = useFollowUps({ leadId: lead.id });
  const [createOpen, setCreateOpen] = useState(false);
  const [completing, setCompleting] = useState<FollowUp | null>(null);
  const [rescheduling, setRescheduling] = useState<FollowUp | null>(null);

  const pending = followUps.filter((f) => f.status === "PENDING");
  const history = [...followUps].sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-navy">Follow-up History</h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          Add Follow-up
        </Button>
      </div>

      {pending.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {pending.map((followUp) => (
            <Card key={followUp.id} className="flex flex-wrap items-center justify-between gap-3 border-orange/25 bg-orange/5 p-4">
              <div>
                <p className="text-sm font-semibold text-navy">
                  {FOLLOW_UP_TYPE_LABEL[followUp.type]} · {formatDate(`${followUp.date}T00:00:00`)} at{" "}
                  {formatTime(`${followUp.date}T${followUp.time}:00`)}
                </p>
                {followUp.notes && <p className="mt-0.5 text-xs text-muted-foreground">{followUp.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                {isFollowUpOverdue(followUp) && <FollowUpStatusBadge followUp={followUp} />}
                <PriorityBadge priority={followUp.priority} />
                <Button size="sm" onClick={() => setCompleting(followUp)}>
                  Mark Complete
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setRescheduling(followUp)}>
                  Reschedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <SkeletonRows rows={3} />
        ) : isError ? (
          <ErrorState title="Couldn't load follow-ups." onRetry={() => refetch()} />
        ) : history.length === 0 ? (
          <EmptyState title="No follow-ups yet" description="Add the first follow-up for this lead." />
        ) : (
          <ol className="flex flex-col gap-3">
            {history.map((followUp) => (
              <li key={followUp.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {formatDate(`${followUp.date}T00:00:00`)} · {FOLLOW_UP_TYPE_LABEL[followUp.type]}
                  </p>
                  <p className="text-xs text-muted-foreground">{followUp.outcome ?? followUp.notes ?? "—"}</p>
                </div>
                <FollowUpStatusBadge followUp={followUp} />
              </li>
            ))}
          </ol>
        )}
      </div>

      <CreateFollowUpModal open={createOpen} onOpenChange={setCreateOpen} lead={lead} />
      {completing && <CompleteFollowUpModal open onOpenChange={() => setCompleting(null)} followUp={completing} />}
      {rescheduling && <RescheduleFollowUpModal open onOpenChange={() => setRescheduling(null)} followUp={rescheduling} />}
    </div>
  );
}
