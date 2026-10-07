/** Rooftop / ground area guidance: with modern 500–550 W panels, roughly 80–100 sq. ft. is needed per kW. */
export const AREA_PER_KW_NOTE =
  "Considering modern large 500W–550W solar panels, approximately 80–100 sq. ft. of area is required per 1 kW of solar capacity.";

export interface CapacityRow {
  capacity: string;
  area: string;
  panels: string;
}

export const capacityTable: CapacityRow[] = [
  { capacity: "1 kW", area: "80–100 sq. ft.", panels: "2 panels" },
  { capacity: "2 kW", area: "160–200 sq. ft.", panels: "4 panels" },
  { capacity: "3 kW", area: "240–300 sq. ft.", panels: "6 panels" },
  { capacity: "4 kW", area: "320–400 sq. ft.", panels: "7–8 panels" },
  { capacity: "5 kW", area: "400–500 sq. ft.", panels: "9–10 panels" },
  { capacity: "6 kW", area: "480–600 sq. ft.", panels: "11–12 panels" },
  { capacity: "7 kW", area: "560–700 sq. ft.", panels: "13–14 panels" },
  { capacity: "8 kW", area: "640–800 sq. ft.", panels: "15 panels" },
  { capacity: "9 kW", area: "720–900 sq. ft.", panels: "16–17 panels" },
  { capacity: "10 kW", area: "800–1,000 sq. ft.", panels: "18–19 panels" },
];

export interface SystemPrice {
  kw: number;
  price: number;
}

/** Keep in step with `SYSTEM_PRICE_LIST` in server/src/config/company.ts (used on the quotation PDF). */
export const systemPrices: SystemPrice[] = [
  { kw: 3, price: 195500 },
  { kw: 4, price: 242500 },
  { kw: 5, price: 296000 },
  { kw: 6, price: 344000 },
  { kw: 7, price: 416000 },
  { kw: 8, price: 443000 },
  { kw: 10, price: 511000 },
];

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export interface MaterialItem {
  label: string;
  detail: string;
}

export interface MaterialGroup {
  id: string;
  title: string;
  intro?: string;
  items: MaterialItem[];
}

export const materialsIntro =
  "The basic materials required for an on-grid solar system from 1 kW to 10 kW remain largely the same. However, their size, capacity and quantity change according to the system capacity.";

export const materialGroups: MaterialGroup[] = [
  {
    id: "1kw",
    title: "1 kW Solar System",
    items: [
      { label: "Solar Panels", detail: "2 panels of 550W or 540W each, or 3 panels of 330W each" },
      { label: "Solar Inverter", detail: "1 kW single-phase inverter" },
      { label: "Mounting Structure", detail: "GI or aluminium structure with clips, nuts and bolts for mounting 2 panels" },
      { label: "Cables", detail: "Approximately 10–15 meters of DC cable and AC cable" },
      { label: "Protection Devices", detail: "DCDB and ACDB boxes with MCB and surge protection" },
      { label: "Other Materials", detail: "Earthing wire, earthing rod, and net meter provided through MSEDCL" },
    ],
  },
  {
    id: "2kw",
    title: "2 kW Solar System",
    items: [
      { label: "Solar Panels", detail: "4 panels of 550W each" },
      { label: "Solar Inverter", detail: "2 kW single-phase inverter" },
      { label: "Mounting Structure", detail: "Larger iron structure to accommodate 4 panels" },
      { label: "Cables & Wiring", detail: "Longer copper/DC cables as required" },
      { label: "Safety Equipment", detail: "ACDB/DCDB box with MCB" },
      { label: "Other Materials", detail: "Earthing kit, optional lightning arrester, and net meter" },
    ],
  },
  {
    id: "3kw",
    title: "3 kW Solar System",
    items: [
      { label: "Solar Panels", detail: "6 panels of 550W each" },
      { label: "Solar Inverter", detail: "3 kW single-phase solar inverter" },
      { label: "Mounting Structure", detail: "Strong rooftop or ground-mounting structure for 6 panels" },
      { label: "Cables & Wiring", detail: "Properly sized AC/DC cables" },
      { label: "Safety & Earthing", detail: "ACDB, DCDB, effective earthing system, and net meter" },
    ],
  },
  {
    id: "4-5kw",
    title: "4–5 kW Solar System",
    items: [
      { label: "Solar Panels", detail: "8–10 panels of 550W each" },
      {
        label: "Solar Inverter",
        detail: "5 kW inverter; depending on the load, either a single-phase or three-phase inverter may be used",
      },
      { label: "Mounting Structure", detail: "Large frame structure for 8–10 panels" },
      { label: "Cables & Safety", detail: "Heavy-duty cables and larger ACDB/DCDB box" },
      { label: "Safety Equipment", detail: "Earthing rods, copper wire, and bi-directional net meter" },
    ],
  },
  {
    id: "6-10kw",
    title: "6–10 kW Solar System",
    intro:
      "For larger systems, the electricity load of the house, commercial building or factory is generally higher, so the capacity of the equipment also increases.",
    items: [
      { label: "Solar Panels", detail: "6 kW: 12 panels of 550W · 8 kW: 15 panels of 550W · 10 kW: 18–20 panels of 550W" },
      {
        label: "Solar Inverter",
        detail:
          "Three-phase inverter. For 6–10 kW systems, a three-phase electricity connection and three-phase inverter are generally required.",
      },
      { label: "Mounting Structure", detail: "Strong, customized galvanized iron (GI) structure suitable for the larger installation area" },
      {
        label: "Cables & Wiring",
        detail: "Thicker and higher-capacity DC and AC cables. Longer cable runs should be properly sized to minimize power losses.",
      },
      {
        label: "Protection & Safety",
        detail: "High-quality ACDB/DCDB, heavy-duty Surge Protection Device (SPD), and a lightning arrester for protection against lightning",
      },
      { label: "Meter", detail: "Three-phase net meter" },
    ],
  },
];

/** The components every on-grid system is made of, regardless of capacity. */
export const coreComponents = ["Solar Panels", "Inverter", "Mounting Structure", "Cables", "ACDB/DCDB", "Earthing", "Net Meter"];

export const coreComponentsNote =
  "Only the quantity, size and capacity of these components change according to the solar system capacity from 1 kW to 10 kW.";
