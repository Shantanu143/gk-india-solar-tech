import { apiRequest, apiRequestBlob } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Quotation, QuotationItem, QuotationStatus, SendQuotationResult } from "@/features/quotations/types/quotation";

export interface GetQuotationsParams {
  status?: QuotationStatus;
  page?: number;
  pageSize?: number;
}

export async function getQuotations(params: GetQuotationsParams = {}): Promise<PaginatedResult<Quotation>> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.page) search.set("page", String(params.page));
  search.set("pageSize", String(params.pageSize ?? 20));
  return apiRequest<PaginatedResult<Quotation>>(`/quotations?${search.toString()}`);
}

export async function getQuotation(id: string): Promise<Quotation> {
  const { quotation } = await apiRequest<{ quotation: Quotation }>(`/quotations/${id}`);
  return quotation;
}

export async function getQuotationByLeadId(leadId: string): Promise<Quotation | null> {
  const { quotation } = await apiRequest<{ quotation: Quotation | null }>(`/quotations/for-lead/${leadId}`);
  return quotation;
}

export async function createQuotation(leadId: string): Promise<Quotation> {
  const { quotation } = await apiRequest<{ quotation: Quotation }>("/quotations", { method: "POST", body: JSON.stringify({ leadId }) });
  return quotation;
}

export interface UpdateQuotationItemsPayload {
  id: string;
  items: Omit<QuotationItem, "id">[];
  discountAmount?: number;
  validUntil?: string;
  notes?: string;
}

export async function updateQuotationItems(payload: UpdateQuotationItemsPayload): Promise<Quotation> {
  const { id, ...body } = payload;
  const { quotation } = await apiRequest<{ quotation: Quotation }>(`/quotations/${id}/items`, { method: "PATCH", body: JSON.stringify(body) });
  return quotation;
}

export async function sendQuotation(id: string): Promise<SendQuotationResult> {
  return apiRequest<SendQuotationResult>(`/quotations/${id}/send`, { method: "POST" });
}

export async function acceptQuotation(id: string): Promise<Quotation> {
  const { quotation } = await apiRequest<{ quotation: Quotation }>(`/quotations/${id}/accept`, { method: "POST" });
  return quotation;
}

export async function rejectQuotation(input: { id: string; lostReason?: string }): Promise<Quotation> {
  const { quotation } = await apiRequest<{ quotation: Quotation }>(`/quotations/${input.id}/reject`, {
    method: "POST",
    body: JSON.stringify({ lostReason: input.lostReason }),
  });
  return quotation;
}

export async function downloadQuotationPdf(quotation: Quotation): Promise<void> {
  const blob = await apiRequestBlob(`/quotations/${quotation.id}/pdf`);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${quotation.quotationNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Mobile-friendly alternative: hands the actual PDF file to the phone's share sheet so it can go
 * straight into a WhatsApp chat as an attachment. Returns false when the browser can't share files
 * (most desktops), so callers can fall back to the message-with-link flow.
 */
export async function shareQuotationPdfFile(quotation: Quotation, customerName: string): Promise<boolean> {
  const blob = await apiRequestBlob(`/quotations/${quotation.id}/pdf`);
  const file = new File([blob], `${quotation.quotationNumber}.pdf`, { type: "application/pdf" });
  if (!navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({
      files: [file],
      title: `Solar quotation ${quotation.quotationNumber}`,
      text: `Hello ${customerName}, here is your GK India SolarTech solar quotation ${quotation.quotationNumber}.`,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return true; // user closed the sheet
    throw error;
  }
  return true;
}
