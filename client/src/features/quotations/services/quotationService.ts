import { apiRequest, apiRequestBlob } from "@/services/apiClient";
import type { PaginatedResult } from "@/features/crm/types/api";
import type { Quotation, QuotationItem, QuotationStatus } from "@/features/quotations/types/quotation";

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

export async function sendQuotation(id: string): Promise<Quotation> {
  const { quotation } = await apiRequest<{ quotation: Quotation }>(`/quotations/${id}/send`, { method: "POST" });
  return quotation;
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
