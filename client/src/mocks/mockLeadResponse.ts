import type { LeadResponse } from "@/types/leadCapture";

/**
 * DEV-ONLY lead ID generator. This is isolated here so it is obvious it must be deleted once the
 * backend exists — a real Lead ID is generated server-side (sequential/DB-backed), never in the UI.
 */
export function generateMockLeadResponse(): LeadResponse {
  const year = new Date().getFullYear();
  const sequence = Math.floor(10000 + Math.random() * 90000);
  return { leadId: `GK-LEAD-${year}-${sequence}`, status: "NEW" };
}
