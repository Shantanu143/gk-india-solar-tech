import { ClipboardList, FileText, Mail, MessageCircle, Phone, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { Lead, LeadStatus } from "@/features/leads/types/lead";
import { useCreateQuotation } from "@/features/quotations/hooks/useQuotationMutations";
import { ApiError } from "@/services/apiClient";

interface LeadActionsProps {
  lead: Lead;
  onAssign?: () => void;
  onAddFollowUp: () => void;
  onScheduleSurvey: () => void;
}

type PrimaryAction = "call" | "followUp" | "quotation";

function primaryActionFor(status: LeadStatus): PrimaryAction {
  if (status === "NEW") return "call";
  if (status === "SURVEY_REQUESTED" || status === "SURVEY_COMPLETED") return "quotation";
  return "followUp";
}

export function LeadActions({ lead, onAssign, onAddFollowUp, onScheduleSurvey }: LeadActionsProps) {
  const { can } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const createQuotation = useCreateQuotation();
  const isAdmin = pathname.startsWith("/admin");
  const isClosed = lead.status === "CONVERTED" || lead.status === "LOST";
  const primary = primaryActionFor(lead.status);

  function handleGenerateQuotation() {
    createQuotation.mutate(lead.id, {
      onSuccess: (quotation) => {
        const path = isAdmin ? CRM_ROUTES.adminQuotationDetail(quotation.id) : CRM_ROUTES.employeeQuotationDetail(quotation.id);
        navigate(path);
      },
    });
  }

  // Only the transitions the configured lead workflow actually allows — FOLLOW_UP → SURVEY_REQUESTED
  // and SURVEY_COMPLETED → QUOTATION_PREPARED — get their action button shown.
  const canRequestSurvey = lead.status === "FOLLOW_UP";
  const canGenerateQuotation = lead.status === "SURVEY_COMPLETED";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant={primary === "call" ? "primary" : "secondary"} size="sm" className="gap-1.5">
        <a href={`tel:${lead.customer.mobile}`}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
      </Button>
      <Button asChild variant="secondary" size="sm" className="gap-1.5">
        <a href={`https://wa.me/91${lead.customer.whatsapp}`} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </Button>
      {lead.customer.email && (
        <Button asChild variant="secondary" size="sm" className="gap-1.5">
          <a href={`mailto:${lead.customer.email}`}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </a>
        </Button>
      )}

      {onAssign && can("leads.assign") && (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={onAssign}>
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Assign
        </Button>
      )}

      {!isClosed && (
        <Button variant={primary === "followUp" ? "primary" : "secondary"} size="sm" className="gap-1.5" onClick={onAddFollowUp}>
          Add Follow-up
        </Button>
      )}

      {canRequestSurvey && (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={onScheduleSurvey}>
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Schedule Survey
        </Button>
      )}

      {canGenerateQuotation && (
        <Button
          variant={primary === "quotation" ? "primary" : "secondary"}
          size="sm"
          className="gap-1.5"
          disabled={createQuotation.isPending}
          onClick={handleGenerateQuotation}
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {createQuotation.isPending ? "Generating…" : "Generate Quotation"}
        </Button>
      )}
      {createQuotation.isError && (
        <p className="w-full text-xs text-error">
          {createQuotation.error instanceof ApiError ? createQuotation.error.message : "Couldn't generate a quotation. Please try again."}
        </p>
      )}
    </div>
  );
}
