import { apiRequest } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Lead, LeadStatus } from "@/features/leads/types/lead";
import type { Project } from "@/features/projects/types/project";
import type { LocationData, ProjectType, SolarRecommendation } from "@/types/solarEstimate";
import type { Partner, PartnerAddress, PartnerBankDetails, PartnerDashboard } from "@/features/partners/types/partner";

export async function getMyPartnerProfile(): Promise<Partner> {
  const { partner } = await apiRequest<{ partner: Partner }>("/partners/me");
  return partner;
}

export interface UpdatePartnerProfilePayload {
  companyName?: string;
  mobile?: string;
  whatsapp?: string;
  address?: PartnerAddress;
  howHeard?: string;
  /** Only meaningful (and only ever sent) when the partner's `type === "INSTALLATION_SERVICE"`. */
  installationProfile?: {
    serviceDistricts?: string[];
    expectedLabourRate?: number;
    bankDetails?: PartnerBankDetails;
  };
}

export async function updateMyPartnerProfile(payload: UpdatePartnerProfilePayload): Promise<Partner> {
  const { partner } = await apiRequest<{ partner: Partner }>("/partners/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return partner;
}

/** `GET /partners/me/dashboard` returns the dashboard object directly — no envelope. */
export async function getMyPartnerDashboard(): Promise<PartnerDashboard> {
  return apiRequest<PartnerDashboard>("/partners/me/dashboard");
}

export interface SubmitPartnerLeadPayload {
  customer: { fullName: string; mobile: string; whatsapp: string; email?: string; address: string };
  projectType: ProjectType;
  location: LocationData;
  monthlyBill: number;
  billDocumentName?: string;
  /** Computed client-side via `calculateSolarRecommendation`, then submitted as-is. */
  solarRecommendation: SolarRecommendation;
  requirement?: string;
  preferredContactTime?: string;
  remarks?: string;
}

export async function submitPartnerLead(payload: SubmitPartnerLeadPayload): Promise<Lead> {
  const { lead } = await apiRequest<{ lead: Lead }>("/partners/me/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return lead;
}

export interface GetPartnerLeadsParams {
  page?: number;
  pageSize?: number;
  status?: LeadStatus;
  sortDirection?: "asc" | "desc";
}

function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getMyPartnerLeads(params: GetPartnerLeadsParams = {}): Promise<PaginatedResult<Lead>> {
  const qs = toQueryString({ ...params });
  return apiRequest<PaginatedResult<Lead>>(`/partners/me/leads${qs}`);
}

/** `project` is only non-null once the lead has converted — its shape is the same `Project` the
 * rest of the CRM uses (`server/src/util/serializeProject.ts`'s `toPublicProject` output). */
export interface PartnerLeadDetail {
  lead: Lead;
  project: Project | null;
}

export async function getMyPartnerLeadDetail(leadId: string): Promise<PartnerLeadDetail> {
  return apiRequest<PartnerLeadDetail>(`/partners/me/leads/${leadId}`);
}

/** Installation/Service and EPC partners' assigned projects — always empty for a Sales/Referral partner, since nothing ever gets assigned to them. */
export async function getMyPartnerProjects(): Promise<Project[]> {
  const { items } = await apiRequest<{ items: Project[] }>("/partners/me/projects");
  return items;
}
