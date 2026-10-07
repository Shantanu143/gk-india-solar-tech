export const COMPANY_EMAIL = "support@gkindiasolartech.in";

/** Registered office / site address, split into display lines (footer, contact page). */
export const COMPANY_ADDRESS_LINES = [
  "Mali Nagar, Near Ganpati Temple,",
  "Vadgaon Maval, District Pune – 412106,",
  "Maharashtra, India.",
] as const;

export const COMPANY_ADDRESS = COMPANY_ADDRESS_LINES.join(" ");

/** Compact form for tight spots (map title, aria labels). */
export const COMPANY_LOCALITY = "Vadgaon Maval, Pune, Maharashtra";

export interface CompanyPhone {
  display: string;
  href: string;
  /** True only for the number that is on WhatsApp — it alone shows the WhatsApp icon. */
  whatsapp?: boolean;
}

/** Both numbers are real company contact lines; listed in this order across the site. */
export const COMPANY_PHONE_NUMBERS: CompanyPhone[] = [
  { display: "+91 78409 84977", href: "tel:+917840984977" },
  { display: "+91 90966 57541", href: "tel:+919096657541", whatsapp: true },
];

/** The company's WhatsApp number (digits only, with country code). Must match the `whatsapp: true` entry above. */
const WHATSAPP_NUMBER = "919096657541";

export function getWhatsAppLink(message: string): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Where a listed number should link: WhatsApp chat for the WhatsApp number, a plain call link otherwise. */
export function getPhoneLink(phone: CompanyPhone): string {
  if (!phone.whatsapp) return phone.href;
  return getWhatsAppLink("Hi GK India SolarTech, I'd like to know more about solar for my property.") ?? phone.href;
}
