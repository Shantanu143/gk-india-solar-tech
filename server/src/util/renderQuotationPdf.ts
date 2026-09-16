import PDFDocument from "pdfkit";
import type { PublicQuotation } from "./serializeQuotation";
import type { LeadDocument } from "../models/Lead.model";
import { formatDateLabel } from "./dateLabels";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function renderQuotationPdf(quotation: PublicQuotation, lead: LeadDocument): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.fillColor("#00163F").fontSize(20).font("Helvetica-Bold").text("GK India SolarTech", 50, 50);
  doc.fillColor("#666").fontSize(9).font("Helvetica").text("Solar EPC & Consultancy · www.gkindiasolartech.in", 50, 74);

  doc.fillColor("#FD8002").fontSize(14).font("Helvetica-Bold").text("QUOTATION", 400, 50, { align: "right" });
  doc.fillColor("#333").fontSize(10).font("Helvetica").text(quotation.quotationNumber, 400, 70, { align: "right" });
  doc.text(`Valid until ${formatDateLabel(quotation.validUntil)}`, 400, 84, { align: "right" });

  doc.moveTo(50, 110).lineTo(545, 110).strokeColor("#E5E7EB").stroke();

  doc.fillColor("#00163F").fontSize(11).font("Helvetica-Bold").text("Prepared For", 50, 125);
  doc.fillColor("#333").fontSize(10).font("Helvetica");
  doc.text(lead.customer.fullName, 50, 142);
  doc.text(lead.customer.address, 50, 157, { width: 250 });
  doc.text(lead.customer.mobile, 50, 187);
  if (lead.customer.email) doc.text(lead.customer.email, 50, 202);

  doc.fillColor("#00163F").fontSize(11).font("Helvetica-Bold").text("Project", 320, 125);
  doc.fillColor("#333").fontSize(10).font("Helvetica");
  doc.text(`Lead ID: ${lead.leadId}`, 320, 142);
  doc.text(`Type: ${lead.projectType}`, 320, 157);
  doc.text(`Prepared by: ${quotation.preparedBy}`, 320, 172);

  let y = 240;
  doc.rect(50, y, 495, 24).fill("#00163F");
  doc.fillColor("#fff").fontSize(9).font("Helvetica-Bold");
  doc.text("DESCRIPTION", 60, y + 8);
  doc.text("QTY", 330, y + 8, { width: 50, align: "right" });
  doc.text("UNIT PRICE", 380, y + 8, { width: 80, align: "right" });
  doc.text("AMOUNT", 465, y + 8, { width: 70, align: "right" });
  y += 24;

  doc.font("Helvetica").fontSize(9.5);
  for (const item of quotation.items) {
    const rowHeight = 24;
    doc.fillColor("#333");
    doc.text(item.description, 60, y + 8, { width: 260 });
    doc.text(String(item.quantity), 330, y + 8, { width: 50, align: "right" });
    doc.text(inr.format(item.unitPrice), 380, y + 8, { width: 80, align: "right" });
    doc.text(inr.format(item.amount), 465, y + 8, { width: 70, align: "right" });
    doc.moveTo(50, y + rowHeight).lineTo(545, y + rowHeight).strokeColor("#E5E7EB").stroke();
    y += rowHeight;
  }

  y += 12;
  function totalsRow(label: string, value: string, bold = false) {
    doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 11 : 10).fillColor(bold ? "#00163F" : "#333");
    doc.text(label, 330, y, { width: 130, align: "right" });
    doc.text(value, 465, y, { width: 70, align: "right" });
    y += bold ? 20 : 16;
  }
  totalsRow("Subtotal", inr.format(quotation.subtotal));
  if (quotation.subsidyAmount > 0) totalsRow("Govt. Subsidy", `- ${inr.format(quotation.subsidyAmount)}`);
  if (quotation.discountAmount > 0) totalsRow("Discount", `- ${inr.format(quotation.discountAmount)}`);
  doc.moveTo(330, y).lineTo(545, y).strokeColor("#E5E7EB").stroke();
  y += 8;
  totalsRow("Total Payable", inr.format(quotation.totalAmount), true);

  if (quotation.emiEstimate) {
    y += 10;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666")
      .text(
        `Estimated EMI: ${inr.format(quotation.emiEstimate.monthlyEmi)}/month over ${quotation.emiEstimate.tenureYears} years (illustrative, not a financing offer).`,
        50,
        y,
        { width: 495 },
      );
    y += 20;
  }

  if (quotation.notes) {
    y += 10;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#00163F").text("Notes", 50, y);
    y += 15;
    doc.font("Helvetica").fontSize(9.5).fillColor("#333").text(quotation.notes, 50, y, { width: 495 });
  }

  doc
    .fontSize(8)
    .fillColor("#999")
    .text(
      "This quotation is an estimate based on the site survey. Final pricing may vary subject to detailed technical assessment.",
      50,
      760,
      { width: 495, align: "center" },
    );

  doc.end();
  return doc;
}
