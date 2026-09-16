import { mockDelay } from "./apiClient";
import { generateMockLeadResponse } from "@/mocks/mockLeadResponse";
import type { ContactInquiryPayload } from "@/types/lead";
import type { CreateLeadRequest, LeadResponse } from "@/types/leadCapture";

/**
 * TODO(Feature 4 — Lead Capture): replace with `apiRequest("/leads", { method: "POST", body: ... })`
 * once the CRM lead-intake endpoint exists. The contact form already matches this signature,
 * so swapping the implementation will not require UI changes.
 */
export async function submitContactInquiry(payload: ContactInquiryPayload): Promise<{ success: true }> {
  void payload;
  return mockDelay({ success: true }, 900);
}

/** TODO(backend): replace with `apiRequest<LeadResponse>("/leads", { method: "POST", body: JSON.stringify(request) })`. */
export async function submitLead(request: CreateLeadRequest): Promise<LeadResponse> {
  void request;
  return mockDelay(generateMockLeadResponse(), 1100);
}
