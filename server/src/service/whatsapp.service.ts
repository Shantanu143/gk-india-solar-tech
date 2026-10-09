/**
 * WhatsApp delivery is deliberately API-free: the sender's own WhatsApp opens with the customer's
 * chat and a ready-made message. A `wa.me` link cannot attach a file, so the PDF itself travels
 * either through the device's share sheet (the browser hands the real file to WhatsApp) or — as a
 * fallback — as a private link inside the message.
 */

/** WhatsApp wants digits only, with country code. Indian 10-digit numbers get "91". */
export function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
}

export interface QuotationMessageInput {
  customerName: string;
  quotationNumber: string;
  systemSizeKw: number;
  netEffectivePrice: number;
  validUntilLabel: string;
  /** Omit when the PDF itself is attached to the message — the text then carries no link. */
  pdfUrl?: string;
  preparedBy: string;
}

export function buildQuotationMessage(input: QuotationMessageInput): string {
  return [
    `Hello ${input.customerName},`,
    "",
    "Thank you for choosing GK India SolarTech! Your solar quotation is ready.",
    "",
    `Quotation: ${input.quotationNumber}`,
    `System size: ${input.systemSizeKw} kW`,
    `Net effective price (after subsidy): Rs. ${input.netEffectivePrice.toLocaleString("en-IN")}`,
    `Valid until: ${input.validUntilLabel}`,
    ...(input.pdfUrl ? ["", "View / download your quotation (PDF):", input.pdfUrl] : []),
    "",
    "Reply here for any questions.",
    `- ${input.preparedBy}, GK India SolarTech`,
  ].join("\n");
}

export function buildClickToChatLink(to: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(to)}?text=${encodeURIComponent(message)}`;
}
