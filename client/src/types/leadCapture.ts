import type { ProjectType } from "./solarEstimate";

export interface LeadDetails {
  fullName: string;
  mobile: string;
  whatsapp: string;
  sameAsMobile: boolean;
  email?: string;
  address: string;
}

/** Frontend request shape for the future `POST /api/leads`. */
export interface CreateLeadRequest {
  customer: {
    fullName: string;
    mobile: string;
    whatsapp: string;
    email?: string;
    address: string;
  };
  project: {
    projectType: ProjectType;
    city: string;
    pincode: string;
    monthlyBill: number;
  };
  solarRecommendation: {
    recommendedCapacity: number;
    estimatedPanels: number;
    panelCapacity: number;
    recommendedInverter: number;
  };
  source: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface LeadResponse {
  leadId: string;
  status: "NEW";
}
