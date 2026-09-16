import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/features/crm/hooks/authContext";
import { ConfirmDialog } from "@/features/crm/components/ConfirmDialog";
import { Modal } from "@/features/crm/components/Modal";
import { useUpdateLeadStatus } from "@/features/leads/hooks/useLeadMutations";
import { LEAD_STATUS_CONFIG } from "@/features/leads/utils/leadStatusConfig";
import { getAllowedNextStatuses, isTerminalStatus } from "@/features/leads/utils/leadWorkflow";
import { LOST_REASON_LABEL, type Lead, type LeadStatus, type LostReason } from "@/features/leads/types/lead";

interface LeadStatusControlProps {
  lead: Lead;
}

/** Only ever offers transitions the configured lead workflow allows from the current status. */
export function LeadStatusControl({ lead }: LeadStatusControlProps) {
  const { user } = useAuth();
  const updateStatus = useUpdateLeadStatus();
  const [convertConfirmOpen, setConvertConfirmOpen] = useState(false);
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState<LostReason | "">("");

  const nextStatuses = getAllowedNextStatuses(lead.status);
  const regularNextStatuses = nextStatuses.filter((status) => status !== "LOST" && status !== "CONVERTED");
  const canConvert = nextStatuses.includes("CONVERTED");
  const canMarkLost = nextStatuses.includes("LOST");
  const locked = isTerminalStatus(lead.status);

  function handleChange(next: LeadStatus) {
    if (next === lead.status) return;
    if (next === "LOST") {
      setLostReason("");
      setLostModalOpen(true);
      return;
    }
    if (next === "CONVERTED") {
      setConvertConfirmOpen(true);
      return;
    }
    updateStatus.mutate({ leadId: lead.id, status: next, actorName: user?.name ?? "System" });
  }

  if (locked) {
    return (
      <span className="inline-flex h-10 items-center rounded-lg border border-border bg-surface-muted px-3 text-sm font-semibold text-muted-foreground">
        {LEAD_STATUS_CONFIG[lead.status].label} · No further status changes
      </span>
    );
  }

  return (
    <div>
      <select
        aria-label="Lead status"
        value={lead.status}
        onChange={(e) => handleChange(e.target.value as LeadStatus)}
        disabled={updateStatus.isPending}
        className="h-10 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-navy focus:border-orange"
      >
        <option value={lead.status}>{LEAD_STATUS_CONFIG[lead.status].label} (current)</option>
        {regularNextStatuses.map((status) => (
          <option key={status} value={status}>
            {LEAD_STATUS_CONFIG[status].label}
          </option>
        ))}
        {canConvert && <option value="CONVERTED">{LEAD_STATUS_CONFIG.CONVERTED.label}</option>}
        {canMarkLost && <option value="LOST">{LEAD_STATUS_CONFIG.LOST.label}</option>}
      </select>
      {updateStatus.isError && <p className="mt-1.5 text-xs text-error">Couldn't update status. Please try again.</p>}

      <ConfirmDialog
        open={convertConfirmOpen}
        onOpenChange={setConvertConfirmOpen}
        title="Mark Lead As Converted?"
        description={`This marks ${lead.customer.fullName}'s lead as converted. This usually means a project is ready to begin.`}
        confirmLabel="Mark Converted"
        isLoading={updateStatus.isPending}
        onConfirm={() =>
          updateStatus.mutate(
            { leadId: lead.id, status: "CONVERTED", actorName: user?.name ?? "System" },
            { onSuccess: () => setConvertConfirmOpen(false) },
          )
        }
      />

      <Modal
        open={lostModalOpen}
        onOpenChange={setLostModalOpen}
        title="Mark Lead As Lost"
        description="A reason is required so the team can track why leads are lost."
        size="sm"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setLostModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!lostReason || updateStatus.isPending}
              className="bg-error hover:bg-error/90"
              onClick={() =>
                updateStatus.mutate(
                  { leadId: lead.id, status: "LOST", actorName: user?.name ?? "System", lostReason: lostReason || undefined },
                  { onSuccess: () => setLostModalOpen(false) },
                )
              }
            >
              {updateStatus.isPending ? "Saving…" : "Mark Lost"}
            </Button>
          </>
        }
      >
        <Label htmlFor="lost-reason">Reason</Label>
        <select
          id="lost-reason"
          value={lostReason}
          onChange={(e) => setLostReason(e.target.value as LostReason)}
          className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
        >
          <option value="">Select a reason</option>
          {Object.entries(LOST_REASON_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
}
