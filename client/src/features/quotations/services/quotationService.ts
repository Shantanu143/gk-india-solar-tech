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

function saveBlob(blob: Blob | File, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function downloadQuotationPdf(quotation: Quotation): Promise<void> {
  const blob = await apiRequestBlob(`/quotations/${quotation.id}/pdf`);
  saveBlob(blob, `${quotation.quotationNumber}.pdf`);
}

/** Fetches the quotation's PDF as a File, ready to hand to the share sheet or save to disk. */
export async function fetchQuotationPdfFile(quotation: Quotation): Promise<File> {
  const blob = await apiRequestBlob(`/quotations/${quotation.id}/pdf`);
  return new File([blob], `${quotation.quotationNumber}.pdf`, { type: "application/pdf" });
}

/** Whether this browser/device can hand a PDF file straight to another app (WhatsApp) — phones, and some desktops. */
export function canSharePdfFile(file: File): boolean {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
}

/** Saves an already-fetched PDF to the device (no network). */
export function savePdfFile(file: File): void {
  saveBlob(file, file.name);
}

export type ShareOutcome = "shared" | "cancelled" | "needs-tap";

/**
 * Opens the share sheet with the real PDF attached, so the person picks WhatsApp and the customer's
 * chat and the file goes straight in. Must run inside a click (the file is passed in already
 * fetched, so there is nothing to await first). "needs-tap" means the browser rejected the call
 * because it wasn't triggered by a fresh tap — the caller should ask for one.
 */
export async function sharePdfFile(file: File, title: string, caption: string): Promise<ShareOutcome> {
  try {
    await navigator.share({ files: [file], title, text: caption });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    if (error instanceof DOMException && error.name === "NotAllowedError") return "needs-tap";
    throw error;
  }
}
