export const COMPANY_EMAIL = "support@gkindiasolartech.in";

/** Both numbers are real company contact lines; listed in this order across the site. */
export const COMPANY_PHONE_NUMBERS = [
  { display: "+91 78409 84977", href: "tel:+917840984977" },
  { display: "+91 90966 57541", href: "tel:+919096657541" },
];

/**
 * Used as the default WhatsApp contact number — the first supplied phone number. Update here if a
 * different number should be used specifically for WhatsApp.
 */
const WHATSAPP_NUMBER = "917840984977";

export function getWhatsAppLink(message: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
