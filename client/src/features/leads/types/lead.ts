import type { LocationData, ProjectType, SolarRecommendation } from "@/types/solarEstimate";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "SURVEY_REQUESTED"
  | "SURVEY_COMPLETED"
  | "QUOTATION_PREPARED"
  | "QUOTATION_SENT"
  | "NEGOTIATION"
  | "CONVERTED"
  | "LOST";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH";
export type LeadInterest = "LOW" | "MEDIUM" | "HIGH";

export type LeadSource =
  | "GOOGLE_ADS"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "YOUTUBE"
  | "ORGANIC_SEARCH"
  | "DIRECT"
  | "REFERRAL"
  | "OTHER";

export type LostReason =
  | "NOT_INTERESTED"
  | "PRICE"
  | "COMPETITOR"
  | "LOCATION"
  | "NOT_ELIGIBLE"
  | "NO_RESPONSE"
  | "OTHER";

export interface LeadCustomer {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  address: string;
}

/**
 * The CRM lead record. Follow-ups and activities are deliberately NOT embedded here — they're
 * their own collections keyed by `leadId` (matching the `GET /api/leads/:leadId/activities` and
 * `GET /api/follow-ups?leadId=` contracts), the same way a real relational/API backend would model
 * them. "Next follow-up" is likewise derived (earliest PENDING follow-up for this lead) rather than
 * duplicated onto the lead, so history and the current next follow-up can never fall out of sync.
 */
export interface Lead {
  id: string;
  leadId: string;
  customer: LeadCustomer;
  projectType: ProjectType;
  location: LocationData;
  monthlyBill: number;
  billDocumentName?: string;
  solarRecommendation: SolarRecommendation;
  source: LeadSource;
  status: LeadStatus;
  interest: LeadInterest;
  priority: LeadPriority;
  assignedEmployeeId: string | null;
  lostReason?: LostReason;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status?: LeadStatus;
  projectType?: ProjectType;
  source?: LeadSource;
  assignedEmployeeId?: string;
  interest?: LeadInterest;
  search?: string;
}

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  GOOGLE_ADS: "Google Ads",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  YOUTUBE: "YouTube",
  ORGANIC_SEARCH: "Organic Search",
  DIRECT: "Direct",
  REFERRAL: "Referral",
  OTHER: "Other",
};

export const LOST_REASON_LABEL: Record<LostReason, string> = {
  NOT_INTERESTED: "Not Interested",
  PRICE: "Price",
  COMPETITOR: "Competitor",
  LOCATION: "Location",
  NOT_ELIGIBLE: "Not Eligible",
  NO_RESPONSE: "No Response",
  OTHER: "Other",
};

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
};
