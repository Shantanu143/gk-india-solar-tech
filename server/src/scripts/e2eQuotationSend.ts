/** Dev check: exercises send + public PDF link against an ephemeral in-memory MongoDB. */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.CLIENT_ORIGIN = "http://localhost";
  process.env.JWT_ACCESS_SECRET = "x";
  await mongoose.connect(mongod.getUri());

  const { LeadModel } = await import("../models/Lead.model");
  const { FinalSolarConfigurationModel } = await import("../models/FinalSolarConfiguration.model");
  const { QuotationModel } = await import("../models/Quotation.model");
  const { quotationService } = await import("../service/quotation.service");

  const lead = await LeadModel.create({
    leadId: "GK-L-1", projectType: "RESIDENTIAL", monthlyBill: 3200, source: "GOOGLE_ADS", status: "QUOTATION_PREPARED", interest: "HIGH", priority: "HIGH",
    customer: { fullName: "Gopal Patil", mobile: "9096657541", whatsapp: "9096657541", address: "Shivaji Nagar" },
    location: { pincode: "411005", city: "Pune", address: "Shivaji Nagar" },
    solarRecommendation: { recommendedCapacity: 3, estimatedPanels: 6, panelCapacity: 540, recommendedInverter: 3 },
  });
  const cfg = await FinalSolarConfigurationModel.create({
    lead: lead._id, survey: new mongoose.Types.ObjectId(), systemCapacityKw: 3, panelModel: "540 Wp Mono PERC", panelWattage: 540,
    numberOfPanels: 6, inverterCapacityKw: 3, structureType: "HDGI elevated structure", installationType: "RCC_ROOFTOP", preparedBy: "t",
  });
  const q = await QuotationModel.create({
    quotationNumber: "GK-QUO-2026-00001", lead: lead._id, finalConfiguration: cfg._id,
    items: [{ description: "Panel", category: "PANEL", quantity: 6, unitPrice: 20000, amount: 120000 }],
    subtotal: 120000, subsidyAmount: 78000, discountAmount: 0, totalAmount: 42000, validUntil: "2099-01-01", status: "DRAFT", preparedBy: "Sales", gstRatePercent: 8.9,
  });

  const sent = await quotationService.sendQuotation({ id: q.id, actorName: "Sales", requestBaseUrl: "https://api.example.in" });
  console.log("status:", sent.quotation.status, "| link:", sent.whatsappLink.slice(0, 60));
  console.log("pdfUrl:", sent.pdfUrl.replace(/[0-9a-f]{48}/, "<token>"));
  const token = sent.pdfUrl.split("/").slice(-2, -1)[0]!;
  const { pdf } = await quotationService.getPdfByShareToken(token);
  console.log("public pdf bytes:", pdf.length, "header:", pdf.subarray(0, 5).toString());
  const again = await quotationService.sendQuotation({ id: q.id, actorName: "Sales", requestBaseUrl: "https://api.example.in" });
  console.log("resend ok, same token:", again.pdfUrl === sent.pdfUrl);
  await quotationService.getPdfByShareToken("nope").catch((e) => console.log("bad token ->", e.message));

  await mongoose.disconnect();
  await mongod.stop();
}
main().catch((e) => { console.error(e); process.exit(1); });
