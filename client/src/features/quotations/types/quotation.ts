import type { ProductCategory } from "@/features/products/types/product";

export const QUOTATION_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED"] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export interface QuotationItem {
  id: string;
  productId: string | null;
  description: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface EmiEstimate {
  principal: number;
  tenureYears: number;
  monthlyEmi: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  leadId: string;
  finalConfigurationId: string | null;
  items: QuotationItem[];
  subtotal: number;
  subsidyAmount: number;
  discountAmount: number;
  totalAmount: number;
  emiEstimate?: EmiEstimate;
  /** ISO date, e.g. "2026-08-15". */
  validUntil: string;
  status: QuotationStatus;
  notes?: string;
  preparedBy: string;
  gstRatePercent: number;
  sentAt?: string;
  whatsappSentAt?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const QUOTATION_STATUS_LABEL: Record<QuotationStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export interface SendQuotationResult {
  quotation: Quotation;
  /** Message text (no PDF link) — the caption when the PDF file itself is shared. */
  caption: string;
  /** wa.me link to the customer's chat with `caption` pre-typed; the sender attaches the PDF. */
  whatsappChatLink: string;
  /** wa.me link to the customer's chat with the message plus a private link to the PDF (fallback). */
  whatsappLink: string;
  /** Private link to the PDF that the fallback message contains. */
  pdfUrl: string;
}
