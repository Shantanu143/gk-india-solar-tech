/**
 * Single source of truth for everything printed on the customer quotation PDF that is *company
 * policy* rather than per-customer data. Edit here — no code changes needed. Items marked REVIEW
 * are sensible defaults that the business should confirm before quotations go out.
 */

import type { IconName } from "../util/pdfIllustrations";

export const COMPANY = {
  name: "GK India SolarTech",
  tagline: "Solar EPC & Consultancy",
  website: "www.gkindiasolartech.in",
  email: "support@gkindiasolartech.in",
  phones: ["+91 78409 84977", "+91 90966 57541"],
  address: "Mali Nagar, Near Ganpati Temple, Vadgaon Maval, District Pune – 412106, Maharashtra, India.",
} as const;

/** Blended GST on a rooftop solar supply + works contract. REVIEW with your CA. */
export const DEFAULT_GST_RATE_PERCENT = 8.9;

/** Illustrative generation: units per kW per day (matches the appliance guide below: 3 kW = 15 units/day). */
export const UNITS_PER_KW_PER_DAY = 5;
/** Tariff used only to turn generated units into an *estimated* saving. */
export const AVERAGE_TARIFF_PER_UNIT = 8;

/** Standard rooftop price list (Rs., incl. GST, before subsidy). Used as a fallback when the product catalog has no prices. */
export const SYSTEM_PRICE_LIST: ReadonlyArray<{ kw: number; price: number }> = [
  { kw: 1, price: 90000 },
  { kw: 2, price: 155000 },
  { kw: 3, price: 195500 },
  { kw: 4, price: 242500 },
  { kw: 5, price: 296000 },
  { kw: 6, price: 344000 },
  { kw: 7, price: 416000 },
  { kw: 8, price: 443000 },
  { kw: 10, price: 511000 },
];

/** Price for an arbitrary size: exact match, else linear interpolation, else extrapolate at the outer per-kW rate. */
export function systemPriceFor(kw: number): number {
  const list = SYSTEM_PRICE_LIST;
  const exact = list.find((row) => row.kw === kw);
  if (exact) return exact.price;

  const first = list[0]!;
  const last = list[list.length - 1]!;
  if (kw < first.kw) return Math.round((first.price / first.kw) * kw);
  if (kw > last.kw) return Math.round(last.price + (last.price - list[list.length - 2]!.price) / (last.kw - list[list.length - 2]!.kw) * (kw - last.kw));

  const upperIndex = list.findIndex((row) => row.kw > kw);
  const lower = list[upperIndex - 1]!;
  const upper = list[upperIndex]!;
  const ratio = (kw - lower.kw) / (upper.kw - lower.kw);
  return Math.round(lower.price + (upper.price - lower.price) * ratio);
}

/** How a fallback system price is split across quotation lines. */
export const PRICE_SPLIT = { panels: 0.45, inverter: 0.15, structure: 0.15, balanceOfSystem: 0.25 } as const;

export interface Appliance {
  icon: IconName;
  label: string;
}

export interface SystemGuideRow {
  kw: number;
  unitsPerDay: number;
  unitsPerMonth: number;
  /** What the system can comfortably run — drawn as an icon strip on the sizing page. Max 8. */
  appliances: ReadonlyArray<Appliance>;
  monthlyBill: string;
}

export const SYSTEM_GUIDE: ReadonlyArray<SystemGuideRow> = [
  {
    kw: 1, unitsPerDay: 5, unitsPerMonth: 150, monthlyBill: "Rs. 800 - 1,500",
    appliances: [{ icon: "bulb", label: "Lights" }, { icon: "fan", label: "1-2 fans" }, { icon: "tv", label: "TV" }],
  },
  {
    kw: 2, unitsPerDay: 10, unitsPerMonth: 300, monthlyBill: "Rs. 1,500 - 2,500",
    appliances: [{ icon: "bulb", label: "Lights" }, { icon: "fan", label: "2-3 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "cooler", label: "Cooler" }],
  },
  {
    kw: 3, unitsPerDay: 15, unitsPerMonth: 450, monthlyBill: "Rs. 2,000 - 3,000",
    appliances: [{ icon: "ac", label: "1 AC" }, { icon: "fan", label: "2-3 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "pump", label: "Pump" }, { icon: "washer", label: "Washer" }, { icon: "cooler", label: "Cooler" }],
  },
  {
    kw: 5, unitsPerDay: 25, unitsPerMonth: 750, monthlyBill: "Rs. 4,000 - 6,000",
    appliances: [{ icon: "ac", label: "1-2 ACs" }, { icon: "fan", label: "3-4 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "pump", label: "Pump" }, { icon: "washer", label: "Washer" }, { icon: "geyser", label: "Geyser" }, { icon: "cooler", label: "Cooler" }],
  },
  {
    kw: 6, unitsPerDay: 30, unitsPerMonth: 900, monthlyBill: "Rs. 6,000 - 8,000",
    appliances: [{ icon: "ac", label: "2 ACs" }, { icon: "fan", label: "4-5 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "pump", label: "Pump" }, { icon: "washer", label: "Washer" }, { icon: "cooler", label: "Cooler" }],
  },
  {
    kw: 8, unitsPerDay: 40, unitsPerMonth: 1200, monthlyBill: "Rs. 8,000 - 12,000",
    appliances: [{ icon: "ac", label: "2-3 ACs" }, { icon: "fan", label: "5-6 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "pump", label: "Pump" }, { icon: "washer", label: "Washer" }, { icon: "geyser", label: "Geyser" }, { icon: "cooler", label: "Cooler" }],
  },
  {
    kw: 10, unitsPerDay: 50, unitsPerMonth: 1500, monthlyBill: "Rs. 12,000+",
    appliances: [{ icon: "ac", label: "3-4 ACs" }, { icon: "fan", label: "6-8 fans" }, { icon: "tv", label: "TV" }, { icon: "fridge", label: "Fridge" }, { icon: "pump", label: "Pump" }, { icon: "washer", label: "Washer" }, { icon: "geyser", label: "Geyser" }, { icon: "ev", label: "EV charging" }],
  },
];

/** Milestone payments. `direct` is % of the net price; booking is a flat amount. REVIEW. */
export const PAYMENT_TERMS: {
  bookingAmount: number;
  milestones: ReadonlyArray<{ milestone: string; emi: string; direct: string; icon: IconName }>;
  downPaymentPercent: number;
  processingFee: number;
  emiTenuresMonths: ReadonlyArray<number>;
} = {
  bookingAmount: 10000,
  milestones: [
    { milestone: "Booking", emi: "Booking amount", direct: "Rs. 10,000 (adjusted in final bill)", icon: "money" },
    { milestone: "Design approval", emi: "Processing fee + down payment", direct: "30% of net price", icon: "design" },
    { milestone: "Before material dispatch", emi: "E-NACH / loan disbursal", direct: "60% of net price", icon: "van" },
    { milestone: "After commissioning", emi: "First EMI after 30 days", direct: "Balance 10% of net price", icon: "ecohome" },
  ],
  downPaymentPercent: 30,
  processingFee: 2160,
  emiTenuresMonths: [12, 24, 36, 60],
};

export const WARRANTY_TABLE: ReadonlyArray<{ component: string; years: string; note?: string; icon: IconName }> = [
  { component: "Solar panel - product warranty", years: "12 years", icon: "panel" },
  { component: "Solar panel - performance warranty", years: "25 years", icon: "sun" },
  { component: "Inverter", years: "5 years", note: "Extendable", icon: "inverter" },
  { component: "Mounting structure - design life", years: "25 years", icon: "structure" },
  { component: "Mounting structure - warranty", years: "10 years", icon: "shield" },
  { component: "Cables, protection & other components", years: "1 year", icon: "cable" },
];

export const WHAT_YOU_GET: ReadonlyArray<{ title: string; body: string; icon: IconName }> = [
  { title: "End-to-end EPC", body: "Site survey, design, procurement, installation and commissioning by one accountable team.", icon: "clipboard" },
  { title: "Subsidy & net metering support", body: "We prepare and follow up the government subsidy and net-metering applications on your behalf.", icon: "form" },
  { title: "Durable mounting structures", body: "Hot-dip galvanised structures engineered for your roof type and local wind conditions.", icon: "structure" },
  { title: "AMC & service support", body: "Annual maintenance, cleaning visits and a dedicated support line after commissioning.", icon: "service" },
];

export const CUSTOMER_RESPONSIBILITIES: ReadonlyArray<string> = [
  "Safe roof/terrace access on the installation date",
  "A stable ladder for the installation team (if roof access needs one)",
  "Clean water source and an active electrical socket for panel cleaning",
  "Wi-Fi (min. 2 Mbps) at the inverter location for remote monitoring",
  "Documents for discom and subsidy: PAN, Aadhaar, latest electricity bill",
];

export const NOT_COVERED: ReadonlyArray<string> = [
  "Damage caused by human intervention or third-party work at the site",
  "Damage from unpredictable natural events beyond the design wind speed",
  "Leakage or seepage from pre-existing roof conditions in non-solar areas",
  "Discom charges for load, name or phase changes on the electricity connection",
];

export const JOURNEY_STEPS: ReadonlyArray<{ title: string; body: string; icon: IconName }> = [
  { title: "Book with advance", body: "Pay the booking amount and we process your details within 3-4 days.", icon: "money" },
  { title: "Meet your project manager", body: "A dedicated manager is your single point of contact, start to finish.", icon: "manager" },
  { title: "Detailed site survey", body: "Our engineers check your roof, shadow and electrical load.", icon: "survey" },
  { title: "Approve your design", body: "Review and approve the final system design and layout.", icon: "design" },
  { title: "We handle the paperwork", body: "Discom application, net metering and subsidy documents - done for you.", icon: "form" },
  { title: "Confirm your timeline", body: "You confirm the design and get a tentative delivery and installation timeline.", icon: "calendar" },
  { title: "Pay the next milestone", body: "Clear the next payment directly, or opt for easy EMI disbursal.", icon: "emi" },
  { title: "Materials get ready", body: "We confirm availability of every item and our team starts preparing.", icon: "boxes" },
  { title: "Safe delivery", body: "Your system arrives in our delivery vehicles, packed to travel safely.", icon: "van" },
  { title: "Installation day", body: "Trained installers turn your roof into your own power plant.", icon: "installer" },
  { title: "Clean-up and handover", body: "We clean your roof and premises, then walk you through the system.", icon: "cleaning" },
  { title: "Support, always", body: "A dedicated team is on call, WhatsApp and email whenever you need us.", icon: "support" },
  { title: "Net metering and switch-on", body: "We coordinate the discom inspection, meter change and commissioning.", icon: "tower" },
  { title: "Enjoy lower bills", body: "Reduced bills, green energy and long-term service support.", icon: "ecohome" },
];

/** "How your solar system works" flow: sunlight to savings. */
export const HOW_IT_WORKS_FLOW: ReadonlyArray<{ title: string; body: string; icon: IconName }> = [
  { title: "Sunlight", body: "Free sunshine falls on your roof every day.", icon: "sun" },
  { title: "Solar panels", body: "Panels turn sunlight into DC electricity.", icon: "panel" },
  { title: "Inverter", body: "Converts DC into home-ready AC power.", icon: "inverter" },
  { title: "Your home", body: "Your appliances run on solar power first.", icon: "house" },
  { title: "Net meter", body: "Counts the units you export and import.", icon: "meter" },
  { title: "Power grid", body: "Surplus goes to the grid; you draw from it at night.", icon: "tower" },
];

export const HOW_IT_WORKS_DAY_CYCLE: ReadonlyArray<{ title: string; body: string; icon: IconName }> = [
  { title: "In the daytime", body: "Solar power runs your home first. Any surplus flows to the grid and is credited to you.", icon: "sun" },
  { title: "At night or on cloudy days", body: "Your home draws from the grid as usual - your exported credits are set off against it.", icon: "moon" },
  { title: "On your electricity bill", body: "You pay only for the net units - what you imported minus what you exported.", icon: "bill" },
];

export const SYSTEM_PARTS: ReadonlyArray<{ title: string; body: string; icon: IconName }> = [
  { title: "Solar panels", body: "Generate DC power from sunlight - the heart of your system.", icon: "panel" },
  { title: "Inverter", body: "Converts DC to AC, syncs with the grid and reports your generation.", icon: "inverter" },
  { title: "Mounting structure", body: "Hot-dip galvanised frame engineered for your roof and wind load.", icon: "structure" },
  { title: "Cables and protection", body: "DC/AC cables, breakers, surge protection and earthing keep it safe.", icon: "cable" },
  { title: "Net meter", body: "A bi-directional discom meter records power exported and imported.", icon: "meter" },
  { title: "Wi-Fi monitoring", body: "Track daily generation on your phone (needs Wi-Fi at the inverter).", icon: "wifi" },
];

export type SubsidyOwner = "us" | "discom" | "you";

/** How the central subsidy reaches the customer. `by` is who does the step. */
export const SUBSIDY_STEPS: ReadonlyArray<{ title: string; body: string; icon: IconName; by: SubsidyOwner }> = [
  { title: "Register on the national portal", body: "We register you on the PM Surya Ghar portal with your discom, consumer number and mobile.", icon: "laptop", by: "us" },
  { title: "Apply and get feasibility approval", body: "We submit your rooftop solar application; the discom approves its technical feasibility.", icon: "form", by: "discom" },
  { title: "Installation by our team", body: "Our team installs your system to the approved design.", icon: "installer", by: "us" },
  { title: "Net meter and inspection", body: "We apply for the net meter; the discom inspects, installs it and commissions the plant.", icon: "meter", by: "discom" },
  { title: "Share your bank details", body: "Once the commissioning report is issued, you add your bank account and a cancelled cheque.", icon: "clipboard", by: "you" },
  { title: "Subsidy credited to your account", body: "The government transfers the subsidy directly to your bank account, typically within about 30 days.", icon: "dbt", by: "discom" },
];

/** Documents the customer keeps ready for discom and subsidy paperwork. */
export const SUBSIDY_DOCUMENTS: ReadonlyArray<string> = ["Aadhaar card", "PAN card", "Latest electricity bill", "Cancelled cheque / passbook"];

export const QUOTATION_TERMS: ReadonlyArray<string> = [
  "This quotation is an estimate based on the site survey; final pricing may vary after detailed technical assessment.",
  "Prices include GST at the rate shown. Subsidy is credited by the government directly to the beneficiary after commissioning and is subject to eligibility under the applicable scheme.",
  "The booking amount is non-refundable once design work begins.",
  "Extra cabling/conduit beyond the standard run, terrace inverter placement, and discom charges (load, name, phase change) are billed separately.",
  "EMI approval is at the discretion of the financing partner (CIBIL score, existing loans and other factors). If a loan is declined, payment must be made directly or with a co-applicant.",
  "Estimated generation and savings are indicative and depend on location, shading, soiling and grid availability.",
  "The quotation is valid until the date shown; component prices may change afterwards.",
];
