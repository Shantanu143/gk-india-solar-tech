/** Dev helper: renders a sample quotation PDF (no database needed) to the path given as argv[2]. */
import fs from "node:fs";
import { renderQuotationPdfBuffer } from "../util/renderQuotationPdf";

const quotation = {
  id: "q1", quotationNumber: "GK-QUO-2026-00001", leadId: "l1", finalConfigurationId: null,
  items: [
    { id: "1", productId: null, description: "Mono PERC Bifacial 540 Wp Solar Panel", category: "PANEL", quantity: 4, unitPrice: 33300, amount: 133200 },
    { id: "2", productId: null, description: "2.2 kW Solar Inverter (single phase)", category: "INVERTER", quantity: 1, unitPrice: 37689, amount: 37689 },
    { id: "3", productId: null, description: "Pre-fabricated HDGI elevated structure - 8 ft", category: "STRUCTURE", quantity: 1, unitPrice: 40000, amount: 40000 },
    { id: "4", productId: null, description: "Cables, protection, earthing, net-metering, installation & commissioning", category: "ACCESSORY", quantity: 1, unitPrice: 40400, amount: 40400 },
  ],
  subtotal: 251289, subsidyAmount: 62880, discountAmount: 25129, totalAmount: 163280,
  emiEstimate: { principal: 163280, tenureYears: 5, monthlyEmi: 3300 }, validUntil: "2026-08-08", status: "DRAFT",
  notes: "Inverter to be installed on the terrace.", preparedBy: "Gopal Patil", gstRatePercent: 8.9,
  createdAt: "2026-07-09T10:00:00.000Z", updatedAt: "2026-07-09T10:00:00.000Z",
};
const lead = {
  leadId: "GK-L-0042", projectType: "RESIDENTIAL", monthlyBill: 3200,
  customer: { fullName: "Gopal Patil", mobile: "9096657541", whatsapp: "9096657541", email: "gopal@example.com", address: "Flat 12, Shivaji Nagar, Near City Mall" },
  location: { city: "Pune", pincode: "411005", address: "Shivaji Nagar" },
  solarRecommendation: { recommendedCapacity: 2.16 },
} as never;
const finalConfig = { systemCapacityKw: 2.16, panelModel: "540 Wp Mono PERC Bifacial", panelWattage: 540, numberOfPanels: 4, inverterCapacityKw: 2.2, structureType: "Pre-fabricated HDGI elevated structure", installationType: "RCC_ROOFTOP" } as never;
const survey = { roofAssessment: { roofType: "RCC", roofAreaSqft: 420, roofCondition: "GOOD" } } as never;

renderQuotationPdfBuffer(quotation as never, lead, { finalConfig, survey }).then((buf) => {
  fs.writeFileSync(process.argv[2]!, buf);
  console.log("written", buf.length);
});
