import type { QuotationDocument } from "../models/Quotation.model";

export function toPublicQuotation(quotation: QuotationDocument) {
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
    validUntil: quotation.validUntil,
    status: quotation.status,
    notes: quotation.notes,
    preparedBy: quotation.preparedBy,
    sentAt: quotation.sentAt ? quotation.sentAt.toISOString() : undefined,
    respondedAt: quotation.respondedAt ? quotation.respondedAt.toISOString() : undefined,
    createdAt: quotation.createdAt.toISOString(),
    updatedAt: quotation.updatedAt.toISOString(),
  };
}

export type PublicQuotation = ReturnType<typeof toPublicQuotation>;
