import { apiRequest, mockDelay } from "./apiClient";
import type { ContactInquiryPayload } from "@/types/lead";
import type { CreateLeadRequest, LeadResponse } from "@/types/leadCapture";

/**
 * TODO(Feature 4 — Lead Capture): there is no general-inquiry intake endpoint yet — `/api/leads`
 * requires solar-estimate-specific fields (projectType, location, monthlyBill, solarRecommendation)
 * this form never collects, so it can't just be pointed at that endpoint as-is.
 */
export async function submitContactInquiry(payload: ContactInquiryPayload): Promise<{ success: true }> {
  void payload;
  return mockDelay({ success: true }, 900);
}

export async function submitLead(request: CreateLeadRequest): Promise<LeadResponse> {
  const response = await apiRequest<{ lead: { leadId: string } }>("/leads", {
    method: "POST",
    body: JSON.stringify(request),
  });
  return { leadId: response.lead.leadId, status: "NEW" };
}
