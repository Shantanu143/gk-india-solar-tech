import type { ProjectType } from "./solarEstimate";

export interface LeadDetails {
  fullName: string;
  mobile: string;
  whatsapp: string;
  sameAsMobile: boolean;
  email?: string;
  address: string;
}

/** Mirrors `server/src/models/Lead.model.ts` — keep both in sync. */
export type LeadSource = "GOOGLE_ADS" | "FACEBOOK" | "INSTAGRAM" | "YOUTUBE" | "ORGANIC_SEARCH" | "DIRECT" | "REFERRAL" | "OTHER";

/** Request shape for `POST /api/leads` — mirrors `server/src/validation/lead.validation.ts`'s `createLeadSchema`. */
export interface CreateLeadRequest {
  customer: {
    fullName: string;
    mobile: string;
    whatsapp: string;
    email?: string;
    address: string;
  };
  projectType: ProjectType;
  location: {
    pincode: string;
    city: string;
    address: string;
  };
  monthlyBill: number;
  solarRecommendation: {
    recommendedCapacity: number;
    estimatedPanels: number;
    panelCapacity: number;
    recommendedInverter: number;
  };
  source: LeadSource;
}

export interface LeadResponse {
  leadId: string;
  status: "NEW";
}
