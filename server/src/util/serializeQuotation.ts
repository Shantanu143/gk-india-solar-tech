import type { QuotationDocument } from "../models/Quotation.model";

/**
 * `withImages` embeds the survey photos (base64, potentially MBs) — only the single-quotation views
 * and the PDF need them. Lists and summaries get `surveyImageCount` alone so they stay light.
 */
export function toPublicQuotation(quotation: QuotationDocument, withImages = false) {
  const surveyImages = quotation.surveyImages ?? [];
  return {
    id: quotation._id.toString(),
    quotationNumber: quotation.quotationNumber,
    leadId: quotation.lead.toString(),
    finalConfigurationId: quotation.finalConfiguration ? quotation.finalConfiguration.toString() : null,
    items: quotation.items.map((item) => ({
      id: item._id.toString(),
      productId: item.productId ? item.productId.toString() : null,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
    })),
    subtotal: quotation.subtotal,
    subsidyAmount: quotation.subsidyAmount,
    discountAmount: quotation.discountAmount,
    totalAmount: quotation.totalAmount,
    emiEstimate: quotation.emiEstimate,
    surveyImageCount: surveyImages.length,
    ...(withImages ? { surveyImages: surveyImages.map(({ id, url, fileName }) => ({ id, url, fileName })) } : {}),
    validUntil: quotation.validUntil,
    status: quotation.status,
    notes: quotation.notes,
    preparedBy: quotation.preparedBy,
    gstRatePercent: quotation.gstRatePercent ?? 8.9,
    whatsappSentAt: quotation.whatsappSentAt ? quotation.whatsappSentAt.toISOString() : undefined,
    sentAt: quotation.sentAt ? quotation.sentAt.toISOString() : undefined,
    respondedAt: quotation.respondedAt ? quotation.respondedAt.toISOString() : undefined,
    createdAt: quotation.createdAt.toISOString(),
    updatedAt: quotation.updatedAt.toISOString(),
  };
}

export type PublicQuotation = ReturnType<typeof toPublicQuotation>;
