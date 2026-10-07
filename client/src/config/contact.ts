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

export type SocialPlatform = "facebook" | "instagram" | "youtube";

/**
 * Public social profiles shown in the footer. Facebook and Instagram are the real pages;
 * TODO(business): the YouTube handle is a placeholder — replace its `href` with the real channel URL.
 * WhatsApp is not listed here; it is built from the company number below.
 */
export const SOCIAL_LINKS: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/people/GK-India-Solar-Tech/61591624555400/" },
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/gk_indiasolartech" },
  { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@gkindiasolartech" },
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
