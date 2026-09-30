import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import type { PublicQuotation } from "./serializeQuotation";
import type { LeadDocument } from "../models/Lead.model";
import type { FinalSolarConfigurationDocument } from "../models/FinalSolarConfiguration.model";
import type { SurveyDocument } from "../models/Survey.model";
import { formatDateLabel } from "./dateLabels";
import { calculateEmi, LOAN_CONFIG } from "./emiCalculator";
import {
  AVERAGE_TARIFF_PER_UNIT,
  COMPANY,
  CUSTOMER_RESPONSIBILITIES,
  JOURNEY_STEPS,
  NOT_COVERED,
  PAYMENT_TERMS,
  QUOTATION_TERMS,
  SYSTEM_GUIDE,
  SYSTEM_PRICE_LIST,
  UNITS_PER_KW_PER_DAY,
  WARRANTY_TABLE,
  WHAT_YOU_GET,
} from "../config/company";

export interface QuotationPdfContext {
  finalConfig?: FinalSolarConfigurationDocument | null;
  survey?: SurveyDocument | null;
}

const ASSETS = path.join(process.cwd(), "src", "assets");
const FONT = {
  regular: path.join(ASSETS, "fonts", "Poppins-Regular.ttf"),
  medium: path.join(ASSETS, "fonts", "Poppins-Medium.ttf"),
  semi: path.join(ASSETS, "fonts", "Poppins-SemiBold.ttf"),
  bold: path.join(ASSETS, "fonts", "Poppins-Bold.ttf"),
};
const LOGO = path.join(ASSETS, "logo.png");
const COVER_IMAGE = path.join(ASSETS, "img", "hero.jpg");

const DEEP = "#0B2F6B";
const SKY = "#2A6BC9";
const LIGHT_SKY = "#E8F0FB";
const ORANGE = "#FD8002";
const TEXT = "#1F2937";
const MUTED = "#6B7280";
const BORDER = "#DDE3EC";
const PAGE_BG = "#F4F7FB";
const GREEN = "#15803D";

const W = 595.28;
const H = 841.89;
const M = 44;
const CW = W - M * 2;
const FOOTER_H = 46;

const rupee = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr = (n: number) => `₹ ${rupee.format(Math.round(n))}`;

type Doc = PDFKit.PDFDocument;
const f = {
  reg: (d: Doc) => d.font("R"),
  med: (d: Doc) => d.font("M"),
  semi: (d: Doc) => d.font("S"),
  bold: (d: Doc) => d.font("B"),
};

function pageBackground(doc: Doc, color = PAGE_BG) {
  doc.rect(0, 0, W, H).fill(color);
}

function pageTitle(doc: Doc, plain: string, accent: string, subtitle?: string): number {
  const y = 34;
  // logo chip, top-right
  if (fs.existsSync(LOGO)) doc.image(LOGO, W - M - 34, y - 6, { width: 34 });
  f.bold(doc).fontSize(21).fillColor(TEXT);
  const plainW = doc.widthOfString(`${plain} `);
  doc.text(`${plain} `, M, y, { continued: false, lineBreak: false });
  f.bold(doc).fillColor(SKY).fontSize(21).text(accent, M + plainW, y, { lineBreak: false });
  let next = y + 32;
  if (subtitle) {
    f.reg(doc).fontSize(9.5).fillColor(MUTED).text(subtitle, M, next - 4, { width: CW - 50 });
    next += 18;
  }
  return next + 6;
}

function card(doc: Doc, x: number, y: number, w: number, h: number, fill = "#FFFFFF") {
  doc.roundedRect(x, y, w, h, 10).fillAndStroke(fill, BORDER);
}

function bottom() {
  return H - FOOTER_H - 14;
}

function newPage(doc: Doc, plain: string, accent: string, subtitle?: string): number {
  doc.addPage();
  pageBackground(doc);
  return pageTitle(doc, plain, accent, subtitle);
}

function ensure(doc: Doc, y: number, need: number, plain: string, accent: string): number {
  if (y + need <= bottom()) return y;
  return newPage(doc, plain, accent);
}

/** Two-column-or-more table with a sky header row. Returns the y after the table. */
function table(
  doc: Doc,
  y: number,
  cols: Array<{ label: string; w: number; align?: "left" | "right" | "center" }>,
  rows: string[][],
  opts: { boldLast?: boolean; highlightRow?: number; ctx: [string, string] },
): number {
  const rowPad = 8;
  const drawHeader = (yy: number) => {
    doc.roundedRect(M, yy, CW, 26, 6).fill(SKY);
    let x = M;
    f.semi(doc).fontSize(8.5).fillColor("#FFFFFF");
    cols.forEach((c) => {
      doc.text(c.label, x + 10, yy + 8, { width: c.w - 20, align: c.align ?? "left", lineBreak: false });
      x += c.w;
    });
    return yy + 26;
  };
  y = drawHeader(y);
  rows.forEach((row, i) => {
    f.reg(doc).fontSize(9);
    const heights = row.map((cell, ci) => doc.heightOfString(cell, { width: cols[ci]!.w - 20 }));
    const rh = Math.max(24, Math.max(...heights) + rowPad * 2 - 2);
    if (y + rh > bottom()) {
      y = newPage(doc, opts.ctx[0], opts.ctx[1]);
      y = drawHeader(y);
    }
    const last = opts.boldLast && i === rows.length - 1;
    const hi = opts.highlightRow === i;
    doc.rect(M, y, CW, rh).fill(hi ? LIGHT_SKY : last ? LIGHT_SKY : i % 2 ? "#FFFFFF" : "#FBFCFE");
    let x = M;
    row.forEach((cell, ci) => {
      (last || hi ? f.semi(doc) : f.reg(doc)).fontSize(9).fillColor(last ? DEEP : TEXT);
      doc.text(cell, x + 10, y + rowPad - 1, { width: cols[ci]!.w - 20, align: cols[ci]!.align ?? "left" });
      x += cols[ci]!.w;
    });
    doc.moveTo(M, y + rh).lineTo(M + CW, y + rh).lineWidth(0.6).strokeColor(BORDER).stroke();
    y += rh;
  });
  return y;
}

function numberedList(doc: Doc, y: number, items: ReadonlyArray<string>, x = M, w = CW, ctx: [string, string]): number {
  items.forEach((item, i) => {
    f.reg(doc).fontSize(8.5).fillColor(MUTED);
    const h = doc.heightOfString(item, { width: w - 20 });
    if (y + h > bottom()) y = newPage(doc, ctx[0], ctx[1]);
    doc.text(`${i + 1}.`, x, y, { width: 16, lineBreak: false });
    doc.text(item, x + 16, y, { width: w - 16 });
    y += h + 5;
  });
  return y;
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
  f.bold(doc).fontSize(38).fillColor("#FFFFFF").text("Power your home", M, 222, { width: CW });
  f.bold(doc).fontSize(38).fillColor("#FFFFFF").text("with the sun.", M, 266, { width: CW });
  f.reg(doc).fontSize(12).fillColor("#E3EDFB").text(`Prepared exclusively for`, M, 330);
  f.bold(doc).fontSize(24).fillColor("#FFFFFF").text(lead.customer.fullName, M, 348, { width: CW });
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
  f.bold(doc).fontSize(13).fillColor(TEXT).text(lead.customer.fullName, M + 18, y + 14);
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
    ["Installation type", cfg ? cfg.installationType.replace(/_/g, " ").replace(/\w+/g, (w) => (w.length <= 3 ? w : w[0] + w.slice(1).toLowerCase())) : "Rooftop"],
    ["Roof", roof ? `${roof.roofType.length <= 3 ? roof.roofType : roof.roofType[0] + roof.roofType.slice(1).toLowerCase()} roof · ${rupee.format(roof.roofAreaSqft)} sq.ft` : "Verified at site survey"],
    ["Offering", "Turnkey EPC + AMC support"],
  ];
  const gw = (CW - 14) / 2;
  specs.forEach(([label, value], i) => {
    const x = M + (i % 2) * (gw + 14);
    const yy = y + Math.floor(i / 2) * 50;
    card(doc, x, yy, gw, 42, "#FFFFFF");
    doc.circle(x + 22, yy + 21, 12).fill(LIGHT_SKY);
    f.bold(doc).fontSize(9).fillColor(SKY).text(String(i + 1), x + 17, yy + 15, { width: 10, align: "center", lineBreak: false });
    f.reg(doc).fontSize(7.8).fillColor(MUTED).text(label, x + 42, yy + 7, { width: gw - 50, lineBreak: false });
    f.semi(doc).fontSize(9).fillColor(TEXT).text(value, x + 42, yy + 19, { width: gw - 50, height: 20, ellipsis: true });
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

// ───────────────────────────── PAGE 3 — BILL OF MATERIALS ─────────────────────────────
function drawBom(doc: Doc, q: PublicQuotation) {
  let y = newPage(doc, "Bill of", "materials", "What is included in your rooftop system price.");
  const cols = [
    { label: "#", w: 34 },
    { label: "Description", w: CW - 34 - 50 - 95 - 100 },
    { label: "Qty", w: 50, align: "right" as const },
    { label: "Unit price", w: 95, align: "right" as const },
    { label: "Amount", w: 100, align: "right" as const },
  ];
  const rows = q.items.map((it, i) => [String(i + 1), it.description, String(it.quantity), inr(it.unitPrice), inr(it.amount)]);
  rows.push(["", "Subtotal", "", "", inr(q.subtotal)]);
  y = table(doc, y, cols, rows, { boldLast: true, ctx: ["Bill of", "materials"] });

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
    f.semi(doc).fontSize(9.5).fillColor(DEEP).text(item.title, x + 16, yy + 10, { width: gw - 26 });
    f.reg(doc).fontSize(8.3).fillColor(MUTED).text(item.body, x + 16, yy + 26, { width: gw - 26 });
  });
}

// ───────────────────────────── PAGE 4 — SAVINGS & SIZING GUIDE ─────────────────────────────
function drawSavings(doc: Doc, q: PublicQuotation, lead: LeadDocument, kw: number) {
  let y = newPage(doc, "Your", "savings", "Illustrative estimate — actual generation depends on location, shading and grid availability.");

  const unitsPerMonth = Math.round(kw * UNITS_PER_KW_PER_DAY * 30);
  const monthlySaving = unitsPerMonth * AVERAGE_TARIFF_PER_UNIT;
  const yearlySaving = monthlySaving * 12;
  const payback = q.totalAmount > 0 && yearlySaving > 0 ? q.totalAmount / yearlySaving : 0;
  const co2Tonnes = (unitsPerMonth * 12 * 0.82) / 1000;

  const kpis: Array<[string, string, string]> = [
    ["Estimated generation", `${rupee.format(unitsPerMonth)} units`, "per month"],
    ["Estimated bill saving", inr(monthlySaving), "per month"],
    ["Yearly saving", inr(yearlySaving), "per year"],
    ["Payback period", payback ? `${payback.toFixed(1)} yrs` : "—", "on net effective price"],
  ];
  const kw4 = (CW - 3 * 10) / 4;
  kpis.forEach(([label, value, sub], i) => {
    const x = M + i * (kw4 + 10);
    card(doc, x, y, kw4, 82, i === 1 ? SKY : "#FFFFFF");
    f.reg(doc).fontSize(7.8).fillColor(i === 1 ? "#DCE8FA" : MUTED).text(label, x + 12, y + 12, { width: kw4 - 20 });
    f.bold(doc).fontSize(14).fillColor(i === 1 ? "#FFFFFF" : DEEP).text(value, x + 12, y + 32, { width: kw4 - 16 });
    f.reg(doc).fontSize(7.8).fillColor(i === 1 ? "#DCE8FA" : MUTED).text(sub, x + 12, y + 58, { width: kw4 - 20 });
  });
  y += 100;

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
  y += 112;

  f.reg(doc).fontSize(8.3).fillColor(MUTED).text(
    `Based on ${UNITS_PER_KW_PER_DAY} units per kW per day and an average tariff of ₹ ${AVERAGE_TARIFF_PER_UNIT}/unit. Avoids about ${co2Tonnes.toFixed(1)} tonnes of CO2 every year.`,
    M, y, { width: CW },
  );
  y += 30;

  // sizing guide
  f.bold(doc).fontSize(12).fillColor(TEXT).text("Which system suits which home?", M, y);
  y += 20;
  const nearest = SYSTEM_GUIDE.reduce((best, row, i) => (Math.abs(row.kw - kw) < Math.abs(SYSTEM_GUIDE[best]!.kw - kw) ? i : best), 0);
  y = table(
    doc,
    y,
    [
      { label: "Size", w: 50 },
      { label: "Per day", w: 60, align: "right" },
      { label: "Per month", w: 70, align: "right" },
      { label: "What it can run", w: CW - 50 - 60 - 70 - 118 },
      { label: "Best for", w: 118 },
    ],
    SYSTEM_GUIDE.map((r) => [`${r.kw} kW`, String(r.unitsPerDay), String(r.unitsPerMonth), r.runs, r.bestFor]),
    { highlightRow: nearest, ctx: ["Your", "savings"] },
  );

  // price list
  y += 20;
  y = ensure(doc, y, 60 + SYSTEM_PRICE_LIST.length * 6, "Your", "savings");
  f.bold(doc).fontSize(12).fillColor(TEXT).text("Standard rooftop system price guide", M, y);
  y += 18;
  const chipW = (CW - 6 * 8) / 7;
  SYSTEM_PRICE_LIST.forEach((row, i) => {
    const x = M + i * (chipW + 8);
    const active = row.kw === Math.round(kw);
    doc.roundedRect(x, y, chipW, 54, 8).fillAndStroke(active ? DEEP : "#FFFFFF", active ? DEEP : BORDER);
    f.bold(doc).fontSize(11).fillColor(active ? "#FFFFFF" : SKY).text(`${row.kw} kW`, x, y + 9, { width: chipW, align: "center" });
    f.semi(doc).fontSize(7.6).fillColor(active ? "#FFFFFF" : TEXT).text(inr(row.price), x, y + 30, { width: chipW, align: "center" });
  });
  y += 62;
  f.reg(doc).fontSize(7.8).fillColor(MUTED).text("Indicative prices inclusive of GST, before subsidy. Final price is confirmed after the site survey.", M, y, { width: CW });
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
  y = table(
    doc,
    y,
    [
      { label: "Project milestone", w: 165 },
      { label: "If you choose EMI", w: 165 },
      { label: "If you pay directly", w: CW - 330 },
    ],
    PAYMENT_TERMS.milestones.map((m) => [m.milestone, m.emi, m.direct]),
    { ctx: ["Flexible", "financing"] },
  );
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
  y = table(doc, y, [{ label: "Component", w: CW - 170 }, { label: "Coverage", w: 170 }], WARRANTY_TABLE.map((r) => [r.component, r.years]), {
    ctx: ["Warranty and", "services"],
  });
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

  y = ensure(doc, y, 60, "Warranty and", "services");
  card(doc, M, y, CW, 54, LIGHT_SKY);
  f.semi(doc).fontSize(9.5).fillColor(DEEP).text("Service promise", M + 16, y + 11);
  f.reg(doc).fontSize(8.5).fillColor(TEXT).text(
    "Periodic panel-cleaning and performance-check visits, and a dedicated support team by call, WhatsApp and email throughout the warranty period.",
    M + 16, y + 26, { width: CW - 32 },
  );
}

// ───────────────────────────── PAGE 7 — JOURNEY ─────────────────────────────
function drawJourney(doc: Doc) {
  let y = newPage(doc, "Your solar", "journey with us", "From booking to switch-on — here is how we take care of everything.");
  y += 6;
  const rowH = 66;
  const cx = W / 2;
  // spine
  doc.moveTo(cx, y + 12).lineTo(cx, y + rowH * (JOURNEY_STEPS.length - 1) + 12).lineWidth(2).dash(4, { space: 4 }).strokeColor(SKY).stroke().undash();
  JOURNEY_STEPS.forEach((step, i) => {
    const yy = y + i * rowH;
    const left = i % 2 === 0;
    doc.circle(cx, yy + 12, 13).fill(i === JOURNEY_STEPS.length - 1 ? GREEN : SKY);
    f.bold(doc).fontSize(10).fillColor("#FFFFFF").text(String(i + 1), cx - 13, yy + 6.5, { width: 26, align: "center", lineBreak: false });
    const bw = cx - M - 28;
    const bx = left ? M : cx + 28;
    card(doc, bx, yy - 6, bw, 52);
    f.semi(doc).fontSize(9.3).fillColor(DEEP).text(step.title, bx + 12, yy + 1, { width: bw - 24, align: left ? "right" : "left" });
    f.reg(doc).fontSize(7.9).fillColor(MUTED).text(step.body, bx + 12, yy + 15, { width: bw - 24, align: left ? "right" : "left" });
  });
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
  drawBom(doc, quotation);
  drawSavings(doc, quotation, lead, kw);
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
