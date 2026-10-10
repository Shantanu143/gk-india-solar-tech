import { ClipboardList, FileText, Mail, Phone, UserPlus } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import type { Lead, LeadStatus } from "@/features/leads/types/lead";
import { canCreateQuotation, isAwaitingSurvey } from "@/features/leads/utils/leadWorkflow";
import { useCreateQuotation } from "@/features/quotations/hooks/useQuotationMutations";
import { useSurveyForLead } from "@/features/surveys/hooks/useSurvey";
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
  if (status === "SURVEY_COMPLETED") return "quotation";
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

  // Sales follows the pipeline: the survey is requested from FOLLOW_UP, and a quotation can only be
  // generated once it's completed and the site engineer has uploaded its photos. Admin can quote on the spot at any stage.
  const canSkipSurvey = can("quotations.createWithoutSurvey");
  const canRequestSurvey = lead.status === "FOLLOW_UP";
  const canGenerateQuotation = canCreateQuotation(lead.status, canSkipSurvey);
  const waitingOnSurvey = !canSkipSurvey && isAwaitingSurvey(lead.status) && can("quotations.create");
  // Only worth loading the survey (its photos can be large) when the answer decides whether the button is usable.
  const checkPhotos = !canSkipSurvey && lead.status === "SURVEY_COMPLETED" && can("quotations.create");
  const { data: survey, isLoading: surveyLoading } = useSurveyForLead(checkPhotos ? lead.id : undefined);
  const surveyPhotoCount = (survey?.roofPhotos.length ?? 0) + (survey?.meterPhoto ? 1 : 0);
  const awaitingPhotos = checkPhotos && !surveyLoading && surveyPhotoCount === 0;

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
          <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
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

      {canGenerateQuotation && can("quotations.create") && (
        <Button
          variant={primary === "quotation" ? "primary" : "secondary"}
          size="sm"
          className="gap-1.5"
          disabled={createQuotation.isPending || awaitingPhotos}
          onClick={handleGenerateQuotation}
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {createQuotation.isPending ? "Generating…" : "Generate Quotation"}
        </Button>
      )}
      {awaitingPhotos && (
        <p className="w-full text-xs text-muted-foreground">
          Waiting for the site engineer to upload the survey photos — you can generate the quotation once they have.
        </p>
      )}
      {waitingOnSurvey && (
        <p className="w-full text-xs text-muted-foreground">
          {lead.status === "SURVEY_REQUESTED"
            ? "The site survey is scheduled — once the site engineer completes it and uploads the photos, you can generate the quotation."
            : "Send the site engineer for a survey first — a quotation can be generated once the survey is done and its photos are uploaded."}
        </p>
      )}
      {createQuotation.isError && (
        <p className="w-full text-xs text-error">
          {createQuotation.error instanceof ApiError ? createQuotation.error.message : "Couldn't generate a quotation. Please try again."}
        </p>
      )}
    </div>
  );
}
