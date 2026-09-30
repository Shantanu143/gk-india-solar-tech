/**
 * Single source of truth for everything printed on the customer quotation PDF that is *company
 * policy* rather than per-customer data. Edit here — no code changes needed. Items marked REVIEW
 * are sensible defaults that the business should confirm before quotations go out.
 */

export const COMPANY = {
  name: "GK India SolarTech",
  tagline: "Solar EPC & Consultancy",
  website: "www.gkindiasolartech.in",
  email: "support@gkindiasolartech.in",
  phones: ["+91 78409 84977", "+91 90966 57541"],
  address: "Pune, Maharashtra, India",
} as const;

/** Blended GST on a rooftop solar supply + works contract. REVIEW with your CA. */
export const DEFAULT_GST_RATE_PERCENT = 8.9;

/** Illustrative generation: units per kW per day (matches the appliance guide below: 3 kW = 15 units/day). */
export const UNITS_PER_KW_PER_DAY = 5;
/** Tariff used only to turn generated units into an *estimated* saving. */
export const AVERAGE_TARIFF_PER_UNIT = 8;

/** Standard rooftop price list (Rs., incl. GST, before subsidy). Used as a fallback when the product catalog has no prices. */
export const SYSTEM_PRICE_LIST: ReadonlyArray<{ kw: number; price: number }> = [
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

export interface SystemGuideRow {
  kw: number;
  unitsPerDay: number;
  unitsPerMonth: number;
  runs: string;
  bestFor: string;
}

export const SYSTEM_GUIDE: ReadonlyArray<SystemGuideRow> = [
  { kw: 3, unitsPerDay: 15, unitsPerMonth: 450, runs: "1 inverter AC, 2-3 fans, TV, fridge, lights, water pump, washing machine, cooler", bestFor: "Monthly bill of Rs. 2,000 - 3,000" },
  { kw: 5, unitsPerDay: 25, unitsPerMonth: 750, runs: "1-2 inverter ACs, 3-4 fans, TV, fridge, lights, water pump, cooler, washing machine, geyser", bestFor: "Monthly bill of Rs. 4,000 - 6,000" },
  { kw: 6, unitsPerDay: 30, unitsPerMonth: 900, runs: "2 ACs, 4-5 fans, TV, fridge, lights, water pump, cooler, washing machine, motor", bestFor: "Monthly bill of Rs. 6,000 - 8,000" },
  { kw: 8, unitsPerDay: 40, unitsPerMonth: 1200, runs: "2-3 ACs, 5-6 fans, TV, fridge, lights, pump, cooler, washing machine, geyser, motor, inverter/battery", bestFor: "Monthly bill of Rs. 8,000 - 12,000" },
  { kw: 10, unitsPerDay: 50, unitsPerMonth: 1500, runs: "3-4 ACs, 6-8 fans, TV, fridge, lights, pump, cooler, washing machine, geyser, motor, inverter/EV charging", bestFor: "Monthly bill of Rs. 12,000+" },
];

/** Milestone payments. `direct` is % of the net price; booking is a flat amount. REVIEW. */
export const PAYMENT_TERMS = {
  bookingAmount: 10000,
  milestones: [
    { milestone: "Booking", emi: "Booking amount", direct: "Rs. 10,000 (adjusted in final bill)" },
    { milestone: "Design approval", emi: "Processing fee + down payment", direct: "30% of net price" },
    { milestone: "Before material dispatch", emi: "E-NACH / loan disbursal", direct: "60% of net price" },
    { milestone: "After commissioning", emi: "First EMI after 30 days", direct: "Balance 10% of net price" },
  ],
  downPaymentPercent: 30,
  processingFee: 2160,
  emiTenuresMonths: [12, 24, 36, 60],
} as const;

export const WARRANTY_TABLE: ReadonlyArray<{ component: string; years: string }> = [
  { component: "Solar panel - product warranty", years: "12 years" },
  { component: "Solar panel - performance warranty", years: "25 years" },
  { component: "Inverter", years: "5 years (extendable)" },
  { component: "Mounting structure - design life", years: "25 years" },
  { component: "Mounting structure - warranty", years: "10 years" },
  { component: "Cables, protection & other components", years: "1 year" },
];

export const WHAT_YOU_GET: ReadonlyArray<{ title: string; body: string }> = [
  { title: "End-to-end EPC", body: "Site survey, design, procurement, installation and commissioning by one accountable team." },
  { title: "Subsidy & net metering support", body: "We prepare and follow up the government subsidy and net-metering applications on your behalf." },
  { title: "Durable mounting structures", body: "Hot-dip galvanised structures engineered for your roof type and local wind conditions." },
  { title: "AMC & service support", body: "Annual maintenance, cleaning visits and a dedicated support line after commissioning." },
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

export const JOURNEY_STEPS: ReadonlyArray<{ title: string; body: string }> = [
  { title: "Book with advance", body: "Pay the booking amount; we process your details within 3-4 days." },
  { title: "Meet your project manager", body: "A dedicated GK India SolarTech manager is your single point of contact." },
  { title: "Detailed site survey", body: "Engineers verify roof, shadow and electrical load for the final design." },
  { title: "Approve your design", body: "Review and approve the system design and layout." },
  { title: "We handle paperwork", body: "Discom application, net metering and subsidy documentation." },
  { title: "Delivery & installation", body: "Materials arrive and our trained team installs your system." },
  { title: "Clean-up & handover", body: "We clean the site and walk you through the system." },
  { title: "Net metering & commissioning", body: "Discom inspection, meter change and switch-on." },
  { title: "Enjoy lower bills", body: "Track generation, and rely on AMC and support whenever you need us." },
];

export const QUOTATION_TERMS: ReadonlyArray<string> = [
  "This quotation is an estimate based on the site survey; final pricing may vary after detailed technical assessment.",
  "Prices include GST at the rate shown. Subsidy is credited by the government directly to the beneficiary after commissioning and is subject to eligibility under the applicable scheme.",
  "The booking amount is non-refundable once design work begins.",
  "Extra cabling/conduit beyond the standard run, terrace inverter placement, and discom charges (load, name, phase change) are billed separately.",
  "EMI approval is at the discretion of the financing partner (CIBIL score, existing loans and other factors). If a loan is declined, payment must be made directly or with a co-applicant.",
  "Estimated generation and savings are indicative and depend on location, shading, soiling and grid availability.",
  "The quotation is valid until the date shown; component prices may change afterwards.",
];
