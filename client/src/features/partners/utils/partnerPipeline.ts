import type { LeadStatus } from "@/features/leads/types/lead";
import { PROJECT_STATUSES, type ProjectStatus } from "@/features/projects/types/project";

export type PartnerPipelineStageState = "done" | "current" | "upcoming";

export interface PartnerPipelineStage {
  key: string;
  label: string;
  state: PartnerPipelineStageState;
}

/** The unified 12-stage pipeline from the product spec — a Lead's fine-grained statuses up to
 * conversion ("Booking"), then a Project's post-conversion statuses collapsed down to 3 visible
 * milestones. Never invent stages beyond this list. */
const STAGE_DEFS = [
  { key: "NEW", label: "New" },
  { key: "CONTACTED", label: "Contacted" },
  { key: "FOLLOW_UP", label: "Follow-up" },
  { key: "SURVEY_REQUESTED", label: "Site Survey Requested" },
  { key: "SURVEY_COMPLETED", label: "Survey Completed" },
  { key: "QUOTATION_PREPARED", label: "Quotation Prepared" },
  { key: "QUOTATION_SENT", label: "Quotation Sent" },
  { key: "NEGOTIATION", label: "Negotiation" },
  { key: "BOOKING", label: "Booking" },
  { key: "INSTALLATION", label: "Installation" },
  { key: "NET_METERING", label: "Net Metering" },
  { key: "COMPLETED", label: "Completed" },
] as const;

/** The pre-conversion Lead statuses, in pipeline order — everything up to (not including) CONVERTED/LOST. */
const PRE_BOOKING_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "FOLLOW_UP",
  "SURVEY_REQUESTED",
  "SURVEY_COMPLETED",
  "QUOTATION_PREPARED",
  "QUOTATION_SENT",
  "NEGOTIATION",
];

const NET_METERING_ORDER = PROJECT_STATUSES.indexOf("NET_METERING");
const COMPLETED_ORDER = PROJECT_STATUSES.indexOf("COMPLETED");

export interface PartnerLeadPipelineInput {
  status: LeadStatus;
  /** Pass `null`/`undefined` when the lead hasn't converted yet (no Project exists). */
  project: { status: ProjectStatus } | null | undefined;
}

export interface PartnerLeadPipelineResult {
  stages: PartnerPipelineStage[];
  /** LOST is a terminal, off-pipeline state — the UI should show a distinct "lost" message instead
   * of a partially-checked pipeline, since we have no history of how far it got before being lost. */
  isLost: boolean;
}

/**
 * Builds the 12-stage done/current/upcoming pipeline for a partner's lead. Any Project status that
 * isn't INSTALLATION/NET_METERING/COMPLETED (e.g. DOCUMENT_COLLECTION, INSPECTION, SUBSIDY_PROCESS)
 * is folded onto whichever of those 3 visible milestones it's building toward next — e.g. INSPECTION
 * (just after installation, before net metering) shows Installation as done and Net Metering as
 * current, the same way a pre-install status like MATERIAL_DISPATCH shows Installation as current.
 */
export function buildPartnerLeadPipeline({ status, project }: PartnerLeadPipelineInput): PartnerLeadPipelineResult {
  const isLost = status === "LOST";

  let doneCount = 0;
  let currentIndex: number | null = null;

  if (!isLost) {
    if (status === "CONVERTED") {
      if (!project) {
        doneCount = 8; // all pre-booking stages done
        currentIndex = 8; // Booking in progress
      } else {
        const order = PROJECT_STATUSES.indexOf(project.status);
        if (order >= COMPLETED_ORDER) {
          doneCount = 12;
          currentIndex = null;
        } else if (order > NET_METERING_ORDER) {
          doneCount = 11; // through Net Metering
          currentIndex = 11; // Completed in progress
        } else if (order >= NET_METERING_ORDER) {
          doneCount = 10; // through Installation
          currentIndex = 10; // Net Metering in progress
        } else {
          doneCount = 9; // through Booking
          currentIndex = 9; // Installation in progress
        }
      }
    } else {
      const idx = PRE_BOOKING_ORDER.indexOf(status);
      doneCount = idx;
      currentIndex = idx;
    }
  }

  const stages: PartnerPipelineStage[] = STAGE_DEFS.map((def, i) => {
    let state: PartnerPipelineStageState = "upcoming";
    if (!isLost) {
      if (i < doneCount) state = "done";
      else if (i === currentIndex) state = "current";
    }
    return { key: def.key, label: def.label, state };
  });

  return { stages, isLost };
}
