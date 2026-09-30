import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useCreateQuotation } from "@/features/quotations/hooks/useQuotationMutations";
import { ApiError } from "@/services/apiClient";

interface CreateQuotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detailPath: (quotationId: string) => string;
}

/**
 * A lead can only reach SURVEY_COMPLETED while it has no quotation yet — creating one immediately
 * advances it to QUOTATION_PREPARED (see `quotationService.createQuotation`) — so this status
 * filter alone is enough to list exactly the leads eligible for a new quotation, no extra
 * cross-check against existing quotations needed.
 */
export function CreateQuotationModal({ open, onOpenChange, detailPath }: CreateQuotationModalProps) {
  const navigate = useNavigate();
  const { data: eligibleLeads, isLoading } = useLeads({ status: "SURVEY_COMPLETED", pageSize: 100 });
  const createQuotation = useCreateQuotation();
  const [leadId, setLeadId] = useState("");

  const leads = eligibleLeads?.items ?? [];

  function handleClose(next: boolean) {
    if (!next) setLeadId("");
    onOpenChange(next);
  }

  function handleCreate() {
    if (!leadId) return;
    createQuotation.mutate(leadId, {
      onSuccess: (quotation) => {
        handleClose(false);
        navigate(detailPath(quotation.id));
      },
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Create Quotation"
      description="Pick a lead whose site survey and final configuration are complete — those become the quotation's line items."
      size="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!leadId || createQuotation.isPending} onClick={handleCreate}>
            {createQuotation.isPending ? "Creating…" : "Create Quotation"}
          </Button>
        </>
      }
    >
      <Label htmlFor="quotation-lead">Lead</Label>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading eligible leads…</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No leads are ready yet — a quotation needs a lead whose site survey is complete.
        </p>
      ) : (
        <select
          id="quotation-lead"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm focus:border-orange"
        >
          <option value="">Select a lead</option>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.customer.fullName} — {lead.leadId} ({lead.location.city})
            </option>
          ))}
        </select>
      )}

      {createQuotation.isError && (
        <p className="mt-2 text-sm text-error">
          {createQuotation.error instanceof ApiError ? createQuotation.error.message : "Couldn't create a quotation. Please try again."}
        </p>
      )}
    </Modal>
  );
}
