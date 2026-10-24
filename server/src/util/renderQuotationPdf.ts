import fs from "node:fs";
import PDFDocument from "pdfkit";
import type { PublicQuotation } from "./serializeQuotation";
import type { LeadDocument } from "../models/Lead.model";
import type { InstallationType } from "../models/FinalSolarConfiguration.model";
import type { SurveyDocument } from "../models/Survey.model";
import { formatDateLabel } from "./dateLabels";
import { calculateEmi, LOAN_CONFIG } from "./emiCalculator";
import {
  AVERAGE_TARIFF_PER_UNIT,
  COMPANY,
  CUSTOMER_RESPONSIBILITIES,
  NOT_COVERED,
  PAYMENT_TERMS,
  QUOTATION_TERMS,
  UNITS_PER_KW_PER_DAY,
  WHAT_YOU_GET,
} from "../config/company";
import {
  BORDER, COVER_IMAGE, CW, DEEP, FONT, GREEN, H, LIGHT_SKY, LOGO, M, MUTED, ORANGE, SKY, TEXT, W, FOOTER_H,
  bottom, card, ensure, f, fitLine, inr, newPage, numberedList, pageBackground, pageTitle, rupee, table,
  type Doc,
} from "./pdfLayout";
import { drawIllustration, type IconName } from "./pdfIllustrations";
import {
  drawHowItWorks,
  drawJourney,
  drawLongTermSavings,
  drawMilestones,
  drawSizingGuide,
  drawSubsidy,
  drawWarrantyCards,
} from "./quotationInfographics";

/** What the offer page prints about the system — the surveyed final configuration, or (no survey) the lead's recommended system. */
export interface QuotationPdfSystem {
  systemCapacityKw: number;
  panelModel: string;
  panelWattage: number;
  numberOfPanels: number;
  inverterCapacityKw: number;
  structureType: string;
  /** Only known once a survey has been done. */
  installationType?: InstallationType;
}

export interface QuotationPdfContext {
  finalConfig?: QuotationPdfSystem | null;
  survey?: SurveyDocument | null;
}


// ───────────────────────────── PAGE 1 — COVER ─────────────────────────────
function drawCover(doc: Doc, q: PublicQuotation, lead: LeadDocument, kw: number) {
  pageBackground(doc, DEEP);
  const photoH = 470;
  doc.save();
  doc.rect(0, 0, W, photoH).clip();
  if (fs.existsSync(COVER_IMAGE)) doc.image(COVER_IMAGE, 0, 0, { cover: [W, photoH], align: "center", valign: "center" });
  const grad = doc.linearGradient(0, 0, 0, photoH);
  grad.stop(0, DEEP, 0.55).stop(0.55, SKY, 0.25).stop(1, DEEP, 1);
  doc.rect(0, 0, W, photoH).fill(grad);
  doc.restore();

  // brand row
  doc.circle(M + 21, 58, 21).fill("#FFFFFF");
  if (fs.existsSync(LOGO)) doc.image(LOGO, M + 3, 40, { width: 36 });
  f.bold(doc).fontSize(15).fillColor("#FFFFFF").text(COMPANY.name, M + 52, 46, { lineBreak: false });
  f.reg(doc).fontSize(8.5).fillColor("#D7E4F8").text(`${COMPANY.tagline} · ${COMPANY.website}`, M + 52, 66, { lineBreak: false });

  // headline
  f.med(doc).fontSize(10).fillColor("#BBD3F7").text("ROOFTOP SOLAR QUOTATION", M, 200, { characterSpacing: 2 });
  f.bold(doc).fontSize(38).fillColor("#FFFFFF").text(lead.projectType === "RESIDENTIAL" ? "Power your home" : "Power your business", M, 222, { width: CW });
  f.bold(doc).fontSize(38).fillColor("#FFFFFF").text("with the sun.", M, 266, { width: CW });
  f.reg(doc).fontSize(12).fillColor("#E3EDFB").text(`Prepared exclusively for`, M, 330);
  // Name sits left of the "system size" pill (170pt wide + gap), so it gets the remaining width on one line.
  const coverName = fitLine(f.bold(doc), lead.customer.fullName, CW - 170 - 24, 24, 15);
  f.bold(doc).fontSize(coverName.size).fillColor("#FFFFFF").text(coverName.text, M, 348 + (24 - coverName.size) / 2, { lineBreak: false });
  f.reg(doc).fontSize(11).fillColor("#D7E4F8").text(`${lead.location.city} · ${lead.location.pincode}`, M, 380);

  // system pill
  const pillW = 170;
  doc.roundedRect(W - M - pillW, 330, pillW, 84, 16).fill("#FFFFFF");
  f.reg(doc).fontSize(9).fillColor(MUTED).text("SYSTEM SIZE", W - M - pillW + 16, 342, { width: pillW - 32 });
  f.bold(doc).fontSize(30).fillColor(DEEP).text(`${kw} kW`, W - M - pillW + 16, 356, { width: pillW - 32, lineBreak: false });
  f.reg(doc).fontSize(8.5).fillColor(SKY).text("Grid-tied rooftop solar", W - M - pillW + 16, 392, { width: pillW - 32 });

  // info strip
  const y = photoH + 26;
  const items: Array<[string, string]> = [
    ["QUOTATION NO.", q.quotationNumber],
    ["DATE", formatDateLabel(q.createdAt.slice(0, 10))],
    ["VALID UNTIL", formatDateLabel(q.validUntil)],
    ["PREPARED BY", q.preparedBy],
  ];
  const colW = CW / 2;
  items.forEach(([label, value], i) => {
    const x = M + (i % 2) * colW;
    const yy = y + Math.floor(i / 2) * 50;
    f.reg(doc).fontSize(8).fillColor("#9DB6DE").text(label, x, yy, { characterSpacing: 1 });
    f.semi(doc).fontSize(13).fillColor("#FFFFFF").text(value, x, yy + 13, { width: colW - 10 });
  });

  // headline number
  const boxY = y + 112;
  doc.roundedRect(M, boxY, CW, 74, 14).fill(SKY);
  f.reg(doc).fontSize(9.5).fillColor("#DCE8FA").text("NET EFFECTIVE PRICE AFTER SUBSIDY", M + 20, boxY + 15, { characterSpacing: 0.8 });
  f.bold(doc).fontSize(27).fillColor("#FFFFFF").text(inr(q.totalAmount), M + 20, boxY + 31, { lineBreak: false });
  if (q.subsidyAmount > 0) {
    f.med(doc).fontSize(10).fillColor("#FFFFFF").text(`incl. est. govt. subsidy of ${inr(q.subsidyAmount)}`, M + 250, boxY + 40, { width: CW - 270, align: "right" });
  }

  // contact bar
  doc.rect(0, H - 40, W, 40).fill(ORANGE);
  f.semi(doc).fontSize(10).fillColor("#FFFFFF").text(COMPANY.website, M, H - 26, { lineBreak: false });
  f.semi(doc).fontSize(10).fillColor("#FFFFFF").text(COMPANY.phones.join("  |  "), M, H - 26, { width: CW, align: "right" });
}

// ───────────────────────────── PAGE 2 — OFFER ─────────────────────────────
function drawOffer(doc: Doc, q: PublicQuotation, lead: LeadDocument, ctx: QuotationPdfContext, kw: number): number {
  doc.addPage();
  pageBackground(doc);
  let y = pageTitle(doc, "Our offer for", "you");

  // customer card
  card(doc, M, y, CW, 88);
  const cardName = fitLine(f.bold(doc), lead.customer.fullName, CW - 222, 13, 9.5);
  f.bold(doc).fontSize(cardName.size).fillColor(TEXT).text(cardName.text, M + 18, y + 14, { lineBreak: false });
  f.reg(doc).fontSize(9).fillColor(MUTED).text(`${lead.customer.mobile} · ${lead.location.city}, ${lead.location.pincode}`, M + 18, y + 33);
  f.reg(doc).fontSize(9).fillColor(MUTED).text(lead.customer.address, M + 18, y + 47, { width: CW - 220, height: 26 });
  const rx = M + CW - 190;
  f.reg(doc).fontSize(8.5).fillColor(MUTED).text("Lead ID", rx, y + 15).text("Project type", rx, y + 31).text("Email", rx, y + 47);
  f.med(doc).fontSize(8.5).fillColor(TEXT)
    .text(lead.leadId, rx + 62, y + 15, { width: 120, lineBreak: false })
    .text(`${lead.projectType[0]}${lead.projectType.slice(1).toLowerCase()}`, rx + 62, y + 31, { width: 120, lineBreak: false })
    .text(lead.customer.email ?? "—", rx + 62, y + 47, { width: 120, lineBreak: false });
  y += 104;

  // spec grid
  const cfg = ctx.finalConfig;
  const roof = ctx.survey?.roofAssessment;
  const panelTotalWp = cfg ? cfg.numberOfPanels * cfg.panelWattage : 0;
  const specs: Array<[string, string]> = [
    ["System size", `${kw} kWp`],
    ["Solar panels", cfg ? `${cfg.panelModel} · ${cfg.numberOfPanels} × ${cfg.panelWattage} Wp` : "As per final design"],
    ["Inverter", cfg ? `${cfg.inverterCapacityKw} kW grid-tied inverter` : "As per final design"],
    ["Total panel capacity", panelTotalWp ? `${(panelTotalWp / 1000).toFixed(2)} kWp` : `${kw} kWp`],
    ["Mounting structure", cfg?.structureType ?? "Hot-dip galvanised structure"],
    ["Installation type", cfg?.installationType ? cfg.installationType.replace(/_/g, " ").replace(/\w+/g, (w) => (w.length <= 3 ? w : w[0] + w.slice(1).toLowerCase())) : "Rooftop"],
    ["Roof", roof ? `${roof.roofType.length <= 3 ? roof.roofType : roof.roofType[0] + roof.roofType.slice(1).toLowerCase()} roof · ${rupee.format(roof.roofAreaSqft)} sq.ft` : "Verified at site survey"],
    ["Offering", "Turnkey EPC + AMC support"],
  ];
  const specIcons: IconName[] = ["house", "panel", "inverter", "sun", "structure", "installer", "survey", "shield"];
  const gw = (CW - 14) / 2;
  specs.forEach(([label, value], i) => {
    const x = M + (i % 2) * (gw + 14);
    const yy = y + Math.floor(i / 2) * 50;
    card(doc, x, yy, gw, 42, "#FFFFFF");
    drawIllustration(doc, specIcons[i]!, x + 24, yy + 21, 32, { backdrop: LIGHT_SKY });
    f.reg(doc).fontSize(7.8).fillColor(MUTED).text(label, x + 48, yy + 7, { width: gw - 56, lineBreak: false });
    f.semi(doc).fontSize(9).fillColor(TEXT).text(value, x + 48, yy + 19, { width: gw - 56, height: 20, ellipsis: true });
  });
  y += Math.ceil(specs.length / 2) * 50 + 8;

  // price summary
  const gstRate = q.gstRatePercent;
  const netPrice = Math.max(0, q.subtotal - q.discountAmount);
  const gstIncluded = Math.round((netPrice * gstRate) / (100 + gstRate));
  const rows: string[][] = [["Rooftop solar system (supply, install, commission)", inr(q.subtotal)]];
  if (q.discountAmount > 0) rows.push(["Discount", `- ${inr(q.discountAmount)}`]);
  rows.push([`Net price (inclusive of ${gstRate}% GST · GST component ${inr(gstIncluded)})`, inr(netPrice)]);
  if (q.subsidyAmount > 0) rows.push(["Central Govt. direct benefit transfer (est.)", `- ${inr(q.subsidyAmount)}`]);
  rows.push(["Net effective price*", inr(q.totalAmount)]);
  y = table(doc, y, [{ label: "Price", w: CW - 150 }, { label: "Cost", w: 150, align: "right" }], rows, { boldLast: true, ctx: ["Our offer for", "you"] });

  y += 12;
  y = ensure(doc, y, 90, "Our offer for", "you");
  f.bold(doc).fontSize(9).fillColor(TEXT).text("Note", M, y);
  y += 14;
  y = numberedList(
    doc,
    y,
    [
      "*Net effective price is after the estimated government subsidy. Once commissioning is completed, the subsidy is transferred directly to the beneficiary's bank account.",
      "The applicable subsidy is determined according to the MNRE / scheme declaration at the time of application and may change.",
      `This quotation is valid until ${formatDateLabel(q.validUntil)}.`,
      "The booking amount is non-refundable once design work begins.",
      ...(q.notes ? [q.notes] : []),
    ],
    M,
    CW,
    ["Our offer for", "you"],
  );
  return y;
}

// ───────────────────────────── SITE SURVEY PHOTOS ─────────────────────────────
const ACRONYMS = new Set(["RCC"]);
const labelCase = (value: string) =>
  value
    .split("_")
    .map((w) => (ACRONYMS.has(w) ? w : `${w[0]}${w.slice(1).toLowerCase()}`))
    .join(" ");

/**
 * Turns a stored `data:image/jpeg|png;base64,…` URI into bytes. Only validated data URIs are ever
 * decoded — never handed to PDFKit as a string, which would treat anything else as a file path.
 */
function decodeImage(url: string): Buffer | null {
  const comma = url.indexOf(",");
  if (comma < 0 || !/^data:image\/(?:jpeg|png);base64$/i.test(url.slice(0, comma))) return null;
  const bytes = Buffer.from(url.slice(comma + 1), "base64");
  return bytes.length > 0 ? bytes : null;
}

/**
 * One framed tile per photo (two per row), each photo scaled to fit whole inside its frame — never
 * cropped, so a roof or meter shot stays fully visible — and flowing onto extra pages as needed.
 * Prints nothing when the quotation has no photos.
 */
function drawSurveyPhotos(doc: Doc, q: PublicQuotation, survey: SurveyDocument | null | undefined) {
  const photos = q.surveyImages ?? [];
  if (photos.length === 0) return;

  const ctx: [string, string] = ["Site survey", "photos"];
  let y = newPage(doc, ctx[0], ctx[1], "Photos taken at your property during the site survey.");

  const roof = survey?.roofAssessment;
  if (survey && roof) {
    const facts: Array<[string, string]> = [
      ["Surveyed on", formatDateLabel(survey.date)],
      ["Roof", `${labelCase(roof.roofType)} · ${rupee.format(roof.roofAreaSqft)} sq.ft`],
      ["Condition", labelCase(roof.roofCondition)],
      ["Shadow", labelCase(roof.shadowLevel)],
      ["Meter", labelCase(roof.meterType)],
    ];
    card(doc, M, y, CW, 46, LIGHT_SKY);
    const fw = CW / facts.length;
    facts.forEach(([label, value], i) => {
      f.reg(doc).fontSize(7.5).fillColor(MUTED).text(label, M + 14 + i * fw, y + 10, { width: fw - 16, lineBreak: false });
      f.semi(doc).fontSize(9).fillColor(DEEP).text(value, M + 14 + i * fw, y + 24, { width: fw - 16, lineBreak: false });
    });
    y += 62;
  }

  const gap = 14;
  const tileW = (CW - gap) / 2;
  const frameH = 178;
  const labelH = 22;
  const rowH = frameH + labelH + gap;
  const pad = 6;

  for (let i = 0; i < photos.length; i += 2) {
    if (y + frameH + labelH > bottom()) y = newPage(doc, ctx[0], ctx[1]);
    for (let col = 0; col < 2 && i + col < photos.length; col++) {
      const n = i + col;
      const x = M + col * (tileW + gap);
      card(doc, x, y, tileW, frameH + labelH, "#FFFFFF");
      const bytes = decodeImage(photos[n]!.url);
      try {
        if (!bytes) throw new Error("unsupported image");
        doc.save();
        doc.roundedRect(x + 1, y + 1, tileW - 2, frameH - 2, 9).clip();
        doc.rect(x, y, tileW, frameH).fill("#EEF2F7");
        doc.image(bytes, x + pad, y + pad, { fit: [tileW - pad * 2, frameH - pad * 2], align: "center", valign: "center" });
        doc.restore();
      } catch {
        // A photo PDFKit can't decode must not take the whole quotation down — leave a visible placeholder instead.
        doc.restore();
        f.reg(doc).fontSize(8.5).fillColor(MUTED).text("Photo unavailable", x, y + frameH / 2 - 5, { width: tileW, align: "center", lineBreak: false });
      }
      f.reg(doc).fontSize(8.3).fillColor(MUTED).text(`Photo ${n + 1} of ${photos.length}`, x + 12, y + frameH + 6, { width: tileW - 24, lineBreak: false });
    }
    y += rowH;
  }
}

// ───────────────────────────── PAGE 3 — BILL OF MATERIALS ─────────────────────────────
const CATEGORY_ICON: Record<string, IconName> = {
  PANEL: "panel",
  INVERTER: "inverter",
  STRUCTURE: "structure",
  BATTERY: "battery",
  ACCESSORY: "cable",
  OTHER: "service",
};

function drawBom(doc: Doc, q: PublicQuotation) {
  let y = newPage(doc, "Bill of", "materials", "What is included in your rooftop system price.");
  const cols = [
    { label: "Item", w: 48 },
    { label: "Description", w: CW - 48 - 50 - 95 - 100 },
    { label: "Qty", w: 50, align: "right" as const },
    { label: "Unit price", w: 95, align: "right" as const },
    { label: "Amount", w: 100, align: "right" as const },
  ];
  const rows = q.items.map((it) => ["", it.description, String(it.quantity), inr(it.unitPrice), inr(it.amount)]);
  rows.push(["", "Subtotal", "", "", inr(q.subtotal)]);
  const icons = q.items.map((it) => CATEGORY_ICON[it.category] ?? "cable");
  y = table(doc, y, cols, rows, { boldLast: true, ctx: ["Bill of", "materials"], icons });

  y += 22;
  y = ensure(doc, y, 150, "Bill of", "materials");
  f.bold(doc).fontSize(12).fillColor(TEXT).text("What you get with GK India SolarTech", M, y);
  y += 22;
  const gw = (CW - 14) / 2;
  WHAT_YOU_GET.forEach((item, i) => {
    const x = M + (i % 2) * (gw + 14);
    const yy = y + Math.floor(i / 2) * 84;
    card(doc, x, yy, gw, 74);
    doc.roundedRect(x, yy, 5, 74, 2).fill(i % 2 ? ORANGE : SKY);
    drawIllustration(doc, item.icon, x + 38, yy + 37, 44, { backdrop: LIGHT_SKY });
    f.semi(doc).fontSize(9.5).fillColor(DEEP).text(item.title, x + 70, yy + 10, { width: gw - 80 });
    f.reg(doc).fontSize(8.3).fillColor(MUTED).text(item.body, x + 70, yy + 26, { width: gw - 80 });
  });
}

// ───────────────────────────── SAVINGS ─────────────────────────────
function drawSavings(doc: Doc, q: PublicQuotation, lead: LeadDocument, kw: number) {
  let y = newPage(doc, "Your", "savings", "Illustrative estimate — actual generation depends on location, shading and grid availability.");

  const unitsPerMonth = Math.round(kw * UNITS_PER_KW_PER_DAY * 30);
  const monthlySaving = unitsPerMonth * AVERAGE_TARIFF_PER_UNIT;
  const yearlySaving = monthlySaving * 12;
  const payback = q.totalAmount > 0 && yearlySaving > 0 ? q.totalAmount / yearlySaving : 0;
  const co2Tonnes = (unitsPerMonth * 12 * 0.82) / 1000;

  const kpis: Array<[string, string, string, IconName]> = [
    ["Estimated generation", `${rupee.format(unitsPerMonth)} units`, "per month", "sun"],
    ["Estimated bill saving", inr(monthlySaving), "per month", "bill"],
    ["Yearly saving", inr(yearlySaving), "per year", "money"],
    ["Payback period", payback ? `${payback.toFixed(1)} yrs` : "—", "on net effective price", "calendar"],
  ];
  const kw4 = (CW - 3 * 10) / 4;
  kpis.forEach(([label, value, sub, icon], i) => {
    const x = M + i * (kw4 + 10);
    card(doc, x, y, kw4, 88, i === 1 ? SKY : "#FFFFFF");
    drawIllustration(doc, icon, x + kw4 - 25, y + 26, 34, { backdrop: i === 1 ? "#FFFFFF" : LIGHT_SKY });
    f.reg(doc).fontSize(7.8).fillColor(i === 1 ? "#DCE8FA" : MUTED).text(label, x + 12, y + 12, { width: kw4 - 52 });
    f.bold(doc).fontSize(14).fillColor(i === 1 ? "#FFFFFF" : DEEP).text(value, x + 12, y + 46, { width: kw4 - 16 });
    f.reg(doc).fontSize(7.8).fillColor(i === 1 ? "#DCE8FA" : MUTED).text(sub, x + 12, y + 68, { width: kw4 - 20 });
  });
  y += 104;

  // before/after bars
  const bill = lead.monthlyBill || monthlySaving;
  const after = Math.max(0, bill - monthlySaving);
  card(doc, M, y, CW, 96);
  f.semi(doc).fontSize(10).fillColor(TEXT).text("Your monthly electricity bill — before vs after solar", M + 16, y + 12);
  const barMax = CW - 190;
  ([["Before solar", bill, ORANGE], ["After solar (est.)", after, GREEN]] as const).forEach(([label, val, col], i) => {
    const by = y + 36 + i * 28;
    f.reg(doc).fontSize(8.5).fillColor(MUTED).text(label, M + 16, by + 4, { width: 90, lineBreak: false });
    doc.roundedRect(M + 110, by, barMax, 16, 8).fill("#EEF2F7");
    const bw = Math.max(6, barMax * (bill ? val / bill : 0));
    doc.roundedRect(M + 110, by, bw, 16, 8).fill(col);
    f.semi(doc).fontSize(9).fillColor(TEXT).text(inr(val), M + 110 + barMax + 10, by + 3, { width: 70, lineBreak: false });
  });
  y += 108;

  f.reg(doc).fontSize(8.3).fillColor(MUTED).text(
    `Based on ${UNITS_PER_KW_PER_DAY} units per kW per day and an average tariff of ₹ ${AVERAGE_TARIFF_PER_UNIT}/unit.`,
    M, y, { width: CW },
  );
  y += 26;

  // cleaner air callout
  card(doc, M, y, CW, 62, "#EAF7EF");
  drawIllustration(doc, "co2", M + 38, y + 31, 50);
  f.semi(doc).fontSize(10).fillColor(GREEN).text("Cleaner air, too", M + 76, y + 13);
  f.reg(doc).fontSize(8.5).fillColor(TEXT).text(
    `Your system avoids about ${co2Tonnes.toFixed(1)} tonnes of CO2 every year by replacing grid electricity with sunshine.`,
    M + 76, y + 29, { width: CW - 96 },
  );
  y += 78;

  drawLongTermSavings(doc, y, q.totalAmount, yearlySaving);
}

// ───────────────────────────── PAGE 5 — FINANCING ─────────────────────────────
function drawFinancing(doc: Doc, q: PublicQuotation) {
  let y = newPage(doc, "Flexible", "financing", "Choose a payment plan that suits your budget.");
  const netPrice = Math.max(0, q.subtotal - q.discountAmount);
  const down = Math.round((netPrice * PAYMENT_TERMS.downPaymentPercent) / 100);
  const loan = netPrice - down;
  const tenures = PAYMENT_TERMS.emiTenuresMonths;
  const lw = 132;
  const cw = (CW - lw) / tenures.length;

  f.bold(doc).fontSize(12).fillColor(TEXT).text("EMI options", M, y);
  y += 20;
  const emiFor = (months: number) => calculateEmi(loan, LOAN_CONFIG.annualInterestRate, months / 12);
  const emiRows: string[][] = [
    ["Project cost", ...tenures.map(() => inr(netPrice))],
    [`Down payment (${PAYMENT_TERMS.downPaymentPercent}%)`, ...tenures.map(() => inr(down))],
    ["Loan amount", ...tenures.map(() => inr(loan))],
    ["Monthly EMI", ...tenures.map((m) => inr(emiFor(m)))],
    ["Processing fee", ...tenures.map(() => inr(PAYMENT_TERMS.processingFee))],
  ];
  y = table(
    doc,
    y,
    [{ label: "Tenure", w: lw }, ...tenures.map((m) => ({ label: `${m} months`, w: cw, align: "right" as const }))],
    emiRows,
    { ctx: ["Flexible", "financing"] },
  );
  y += 8;
  f.reg(doc).fontSize(8).fillColor(MUTED).text(
    `Illustrative EMI at ${LOAN_CONFIG.annualInterestRate}% p.a. reducing balance. Actual rate, tenure and approval are decided by the financing partner.`,
    M, y, { width: CW },
  );
  y += 34;

  f.bold(doc).fontSize(12).fillColor(TEXT).text("Payment terms", M, y);
  y += 20;
  y = drawMilestones(doc, y);
  y += 22;
  y = ensure(doc, y, 90, "Flexible", "financing");
  f.bold(doc).fontSize(9).fillColor(TEXT).text("Financing terms", M, y);
  y += 14;
  numberedList(
    doc,
    y,
    [
      "EMI approval is at the discretion of our financing partners and depends on CIBIL score, existing loans and other parameters.",
      "GK India SolarTech is not responsible for financing approval or rejection decisions.",
      "If a loan application is rejected, you will need to make a direct payment or apply with a co-applicant.",
    ],
    M,
    CW,
    ["Flexible", "financing"],
  );
}

// ───────────────────────────── PAGE 6 — WARRANTY ─────────────────────────────
function drawWarranty(doc: Doc) {
  let y = newPage(doc, "Warranty and", "services", "Peace of mind that continues long after commissioning.");
  y = drawWarrantyCards(doc, y);
  y += 24;
  y = ensure(doc, y, 220, "Warranty and", "services");

  const gw = (CW - 14) / 2;
  const colBox = (x: number, title: string, items: ReadonlyArray<string>, accent: string) => {
    f.semi(doc).fontSize(10).fillColor(accent);
    let h = 34;
    f.reg(doc).fontSize(8.5);
    items.forEach((it) => (h += doc.heightOfString(it, { width: gw - 44 }) + 8));
    card(doc, x, y, gw, h);
    f.semi(doc).fontSize(10).fillColor(accent).text(title, x + 16, y + 12, { width: gw - 32 });
    let yy = y + 32;
    items.forEach((it) => {
      doc.circle(x + 20, yy + 5, 2.4).fill(accent);
      f.reg(doc).fontSize(8.5).fillColor(TEXT).text(it, x + 32, yy, { width: gw - 44 });
      yy += doc.heightOfString(it, { width: gw - 44 }) + 8;
    });
    return h;
  };
  const h1 = colBox(M, "What we need from you", CUSTOMER_RESPONSIBILITIES, SKY);
  const h2 = colBox(M + gw + 14, "What is not covered", NOT_COVERED, ORANGE);
  y += Math.max(h1, h2) + 18;

  y = ensure(doc, y, 70, "Warranty and", "services");
  card(doc, M, y, CW, 64, LIGHT_SKY);
  drawIllustration(doc, "support", M + 38, y + 32, 50);
  f.semi(doc).fontSize(9.5).fillColor(DEEP).text("Service promise", M + 74, y + 12);
  f.reg(doc).fontSize(8.5).fillColor(TEXT).text(
    "Periodic panel-cleaning and performance-check visits, and a dedicated support team by call, WhatsApp and email throughout the warranty period.",
    M + 74, y + 27, { width: CW - 92 },
  );
}

// ───────────────────────────── PAGE 8 — TERMS & ACCEPTANCE ─────────────────────────────
function drawTermsAndAcceptance(doc: Doc, q: PublicQuotation, lead: LeadDocument) {
  let y = newPage(doc, "Terms and", "acceptance");
  y = numberedList(doc, y, QUOTATION_TERMS, M, CW, ["Terms and", "acceptance"]);
  y += 14;
  y = ensure(doc, y, 190, "Terms and", "acceptance");

  card(doc, M, y, CW, 122, "#FFFFFF");
  f.bold(doc).fontSize(11).fillColor(DEEP).text("Accept this quotation", M + 18, y + 14);
  f.reg(doc).fontSize(8.5).fillColor(MUTED).text(
    `By signing, ${lead.customer.fullName} accepts quotation ${q.quotationNumber} for a net effective price of ${inr(q.totalAmount)}.`,
    M + 18, y + 30, { width: CW - 36 },
  );
  const sw = (CW - 36 - 30) / 2;
  [["Customer signature & date", M + 18], [`For ${COMPANY.name}`, M + 18 + sw + 30]].forEach(([label, x]) => {
    doc.moveTo(x as number, y + 92).lineTo((x as number) + sw, y + 92).lineWidth(0.8).strokeColor(MUTED).stroke();
    f.reg(doc).fontSize(8).fillColor(MUTED).text(String(label), x as number, y + 97, { width: sw });
  });
  y += 140;

  y = ensure(doc, y, 90, "Terms and", "acceptance");
  doc.roundedRect(M, y, CW, 84, 14).fill(DEEP);
  drawIllustration(doc, "support", M + CW - 52, y + 42, 62, { backdrop: "#1B4488" });
  f.bold(doc).fontSize(13).fillColor("#FFFFFF").text("Questions? We're one message away.", M + 20, y + 14);
  f.reg(doc).fontSize(9.5).fillColor("#D7E4F8")
    .text(`${COMPANY.phones.join("  ·  ")}`, M + 20, y + 36)
    .text(`${COMPANY.email}  ·  ${COMPANY.website}`, M + 20, y + 51)
    .text(COMPANY.address, M + 20, y + 66);
}

function stampFooters(doc: Doc, q: PublicQuotation) {
  const range = doc.bufferedPageRange();
  for (let i = range.start + 1; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const y = H - FOOTER_H + 10;
    doc.moveTo(M, y).lineTo(W - M, y).lineWidth(0.6).strokeColor(BORDER).stroke();
    f.reg(doc).fontSize(7.5).fillColor(MUTED).text(`${COMPANY.name} · ${COMPANY.website} · ${COMPANY.phones[0]}`, M, y + 8, { width: 340, lineBreak: false });
    f.reg(doc).fontSize(7.5).fillColor(MUTED).text(`${q.quotationNumber} · Page ${i - range.start + 1} of ${range.count}`, M, y + 8, { width: CW, align: "right", lineBreak: false });
  }
}

export function renderQuotationPdf(quotation: PublicQuotation, lead: LeadDocument, ctx: QuotationPdfContext = {}): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: "A4", margin: 0, bufferPages: true, autoFirstPage: true, info: { Title: `Solar Quotation ${quotation.quotationNumber}`, Author: COMPANY.name } });
  doc.registerFont("R", FONT.regular);
  doc.registerFont("M", FONT.medium);
  doc.registerFont("S", FONT.semi);
  doc.registerFont("B", FONT.bold);

  const kw = ctx.finalConfig?.systemCapacityKw ?? lead.solarRecommendation.recommendedCapacity;

  drawCover(doc, quotation, lead, kw);
  drawOffer(doc, quotation, lead, ctx, kw);
  drawHowItWorks(doc, kw);
  drawSurveyPhotos(doc, quotation, ctx.survey);
  drawBom(doc, quotation);
  drawSavings(doc, quotation, lead, kw);
  drawSizingGuide(doc, kw);
  if (quotation.subsidyAmount > 0) drawSubsidy(doc, quotation);
  drawFinancing(doc, quotation);
  drawWarranty(doc);
  drawJourney(doc);
  drawTermsAndAcceptance(doc, quotation, lead);
  stampFooters(doc, quotation);

  doc.end();
  return doc;
}

export function renderQuotationPdfBuffer(quotation: PublicQuotation, lead: LeadDocument, ctx: QuotationPdfContext = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = renderQuotationPdf(quotation, lead, ctx);
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}
