import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/features/crm/components/Modal";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { useAuth } from "@/features/crm/hooks/authContext";
import { QUOTABLE_LEAD_STATUSES, QUOTABLE_WITHOUT_SURVEY_LEAD_STATUSES } from "@/features/leads/utils/leadWorkflow";
import { useCreateQuotation } from "@/features/quotations/hooks/useQuotationMutations";
import { ApiError } from "@/services/apiClient";

interface CreateQuotationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detailPath: (quotationId: string) => string;
}

/**
 * Sales can only quote a lead once its site survey is completed (and the engineer has uploaded the
 * photos — the server checks that); an admin can quote a lead at any stage. Creating a quotation
 * immediately advances the lead to QUOTATION_PREPARED (see `quotationService.createQuotation`), so
 * filtering on the pre-quotation stages alone lists exactly the leads eligible for a new quotation,
 * no cross-check against existing quotations needed.
 */
export function CreateQuotationModal({ open, onOpenChange, detailPath }: CreateQuotationModalProps) {
  const navigate = useNavigate();
  const { can } = useAuth();
  const canSkipSurvey = can("quotations.createWithoutSurvey");
  const { data: eligibleLeads, isLoading } = useLeads({
    statuses: canSkipSurvey ? QUOTABLE_WITHOUT_SURVEY_LEAD_STATUSES : QUOTABLE_LEAD_STATUSES,
    pageSize: 100,
  });
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
      description={
        canSkipSurvey
          ? "Pick any lead — as admin you can quote on the spot, without waiting for the site survey. The quotation is priced from its final configuration (or its recommended solar system), and you can add photos before sending."
          : "Pick a lead whose site survey is complete and whose photos the site engineer has uploaded. The quotation is priced from its final configuration (or its recommended solar system) and carries the survey photos."
      }
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
          {canSkipSurvey
            ? "No leads are waiting for a quotation — every open lead already has one."
            : "No leads are waiting for a quotation — a lead appears here once its site survey is completed."}
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
