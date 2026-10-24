import {
  COMPANY,
  HOW_IT_WORKS_DAY_CYCLE,
  HOW_IT_WORKS_FLOW,
  JOURNEY_STEPS,
  PAYMENT_TERMS,
  SUBSIDY_DOCUMENTS,
  SUBSIDY_STEPS,
  SYSTEM_GUIDE,
  SYSTEM_PARTS,
  SYSTEM_PRICE_LIST,
  UNITS_PER_KW_PER_DAY,
  WARRANTY_TABLE,
  type SubsidyOwner,
} from "../config/company";
import type { PublicQuotation } from "./serializeQuotation";
import { drawIllustration } from "./pdfIllustrations";
import {
  BORDER, CW, DEEP, GREEN, LIGHT_SKY, M, MUTED, ORANGE, SKY, TEXT,
  bottom, card, ensure, f, inr, newPage, type Doc,
} from "./pdfLayout";

/**
 * The illustrated, explain-it-with-a-picture parts of the quotation: how solar works, the appliance
 * guide, the subsidy route, payment milestones, warranty cards and the full-page journey map. Copy and
 * figures live in config/company.ts; the artwork lives in pdfIllustrations.ts.
 */

type Pt = [number, number];

const TINTS = ["#E8F0FB", "#FFF1E0", "#E4F5EA"] as const;

// ───────────────────────────── shared drawing bits ─────────────────────────────

/** A navy pennant with a step number, planted beside an illustration. */
function flag(doc: Doc, x: number, y: number, n: number, color: string = DEEP) {
  doc.rect(x, y, 1.6, 30).fill(color);
  doc.path(`M${x + 1.6},${y} L${x + 23},${y} L${x + 19},${y + 7.5} L${x + 23},${y + 15} L${x + 1.6},${y + 15} Z`).fill(color);
  f.bold(doc).fontSize(8).fillColor("#FFFFFF").text(String(n), x + 2, y + 3.6, { width: 17, align: "center", lineBreak: false });
}

function arrowHead(doc: Doc, x: number, y: number, angleRad: number, size: number, color: string) {
  doc.save();
  doc.translate(x, y);
  doc.rotate((angleRad * 180) / Math.PI);
  doc.polygon([0, 0], [-size, -size * 0.55], [-size, size * 0.55]).fill(color);
  doc.restore();
}

/** A dashed bezier with an arrowhead on the end (and optionally the start). */
function dashedArrow(doc: Doc, from: Pt, c1: Pt, c2: Pt, to: Pt, color: string, both = false) {
  doc.moveTo(from[0], from[1]).bezierCurveTo(c1[0], c1[1], c2[0], c2[1], to[0], to[1]).lineWidth(1.5).lineCap("round").dash(3, { space: 3.4 }).strokeColor(color).stroke().undash();
  arrowHead(doc, to[0], to[1], Math.atan2(to[1] - c2[1], to[0] - c2[0]), 5.5, color);
  if (both) arrowHead(doc, from[0], from[1], Math.atan2(from[1] - c1[1], from[0] - c1[0]), 5.5, color);
}

function sectionHeading(doc: Doc, text: string, y: number): number {
  f.bold(doc).fontSize(12).fillColor(TEXT).text(text, M, y);
  return y + 22;
}

/** Centred text block; returns its height. */
function centred(doc: Doc, text: string, cx: number, y: number, w: number): number {
  const h = doc.heightOfString(text, { width: w });
  doc.text(text, cx - w / 2, y, { width: w, align: "center" });
  return h;
}

// ───────────────────────────── HOW YOUR SOLAR WORKS ─────────────────────────────
export function drawHowItWorks(doc: Doc, kw: number) {
  const ctx: [string, string] = ["How your", "solar works"];
  let y = newPage(doc, ctx[0], ctx[1], "Sunlight in, savings out — the whole story in one page.");

  // sunlight → grid flow
  const flowH = 146;
  card(doc, M, y, CW, flowH);
  const n = HOW_IT_WORKS_FLOW.length;
  const colW = CW / n;
  HOW_IT_WORKS_FLOW.forEach((step, i) => {
    const cx = M + colW * (i + 0.5);
    const cy = y + 46;
    drawIllustration(doc, step.icon, cx, cy, 54, { backdrop: TINTS[i % 3] });
    doc.circle(cx - 24, cy - 24, 8).fill(ORANGE);
    f.bold(doc).fontSize(8).fillColor("#FFFFFF").text(String(i + 1), cx - 32, cy - 27.5, { width: 16, align: "center", lineBreak: false });
    f.semi(doc).fontSize(8.8).fillColor(DEEP);
    const th = centred(doc, step.title, cx, y + 82, colW - 6);
    f.reg(doc).fontSize(7.4).fillColor(MUTED);
    centred(doc, step.body, cx, y + 85 + th, colW - 12);
    if (i < n - 1) {
      const x1 = cx + 31;
      const x2 = cx + colW - 31;
      dashedArrow(doc, [x1, cy], [x1 + 8, cy - 8], [x2 - 8, cy - 8], [x2, cy], ORANGE, i === n - 2);
    }
  });
  y += flowH + 22;

  // the daily cycle
  y = sectionHeading(doc, "How it plays out day to day", y);
  const gap = 12;
  const cw3 = (CW - gap * 2) / 3;
  const tints = ["#FFF8E6", "#EEF2FF", "#EAF7EF"];
  const cardH = 138;
  HOW_IT_WORKS_DAY_CYCLE.forEach((c, i) => {
    const x = M + i * (cw3 + gap);
    card(doc, x, y, cw3, cardH, tints[i]);
    drawIllustration(doc, c.icon, x + cw3 / 2, y + 40, 56);
    f.semi(doc).fontSize(9.5).fillColor(DEEP);
    const th = centred(doc, c.title, x + cw3 / 2, y + 74, cw3 - 20);
    f.reg(doc).fontSize(8).fillColor(TEXT);
    centred(doc, c.body, x + cw3 / 2, y + 78 + th, cw3 - 24);
  });
  y += cardH + 22;

  // what each part does
  y = sectionHeading(doc, "What each part does", y);
  const gw = (CW - gap) / 2;
  const partH = 62;
  SYSTEM_PARTS.forEach((p, i) => {
    const x = M + (i % 2) * (gw + gap);
    const yy = y + Math.floor(i / 2) * (partH + 8);
    card(doc, x, yy, gw, partH);
    drawIllustration(doc, p.icon, x + 34, yy + partH / 2, 44, { backdrop: LIGHT_SKY });
    f.semi(doc).fontSize(9.3).fillColor(DEEP).text(p.title, x + 66, yy + 11, { width: gw - 78 });
    f.reg(doc).fontSize(8).fillColor(MUTED).text(p.body, x + 66, yy + 25, { width: gw - 78 });
  });
  y += Math.ceil(SYSTEM_PARTS.length / 2) * (partH + 8) + 8;

  // personalised callout
  y = ensure(doc, y, 62, ctx[0], ctx[1]);
  const perDay = Math.round(kw * UNITS_PER_KW_PER_DAY * 10) / 10;
  card(doc, M, y, CW, 56, LIGHT_SKY);
  drawIllustration(doc, "sun", M + 38, y + 28, 44);
  f.semi(doc).fontSize(10).fillColor(DEEP).text(`Your ${kw} kW system should generate about ${perDay} units on a sunny day`, M + 72, y + 12, { width: CW - 90 });
  f.reg(doc).fontSize(8.3).fillColor(MUTED).text("Real output varies with season, shade, dust and grid availability — the savings page shows a careful monthly estimate.", M + 72, y + 29, { width: CW - 90 });
}

// ───────────────────────────── WHICH SYSTEM SUITS YOUR HOME ─────────────────────────────
export function drawSizingGuide(doc: Doc, kw: number) {
  const ctx: [string, string] = ["Which system", "suits your home?"];
  let y = newPage(doc, ctx[0], ctx[1], "Find your size — your system is highlighted.");

  const nearest = SYSTEM_GUIDE.reduce((best, row, i) => (Math.abs(row.kw - kw) < Math.abs(SYSTEM_GUIDE[best]!.kw - kw) ? i : best), 0);
  const rowH = 62;
  const slot = 36;
  SYSTEM_GUIDE.forEach((row, i) => {
    const active = i === nearest;
    doc.roundedRect(M, y, CW, rowH, 10).lineWidth(active ? 1.6 : 1).fillAndStroke(active ? LIGHT_SKY : "#FFFFFF", active ? SKY : BORDER);

    // size badge
    f.bold(doc).fontSize(17).fillColor(active ? SKY : DEEP).text(`${row.kw} kW`, M + 12, y + 10, { width: 84, lineBreak: false });
    f.reg(doc).fontSize(7.4).fillColor(MUTED)
      .text(`${row.unitsPerDay} units / day`, M + 12, y + 33, { width: 84, lineBreak: false })
      .text(`${row.unitsPerMonth} units / month`, M + 12, y + 43, { width: 84, lineBreak: false });
    if (active) {
      doc.roundedRect(M + 12, y - 6, 62, 13, 6.5).fill(ORANGE);
      f.semi(doc).fontSize(6.8).fillColor("#FFFFFF").text("YOUR SYSTEM", M + 12, y - 3, { width: 62, align: "center", lineBreak: false });
    }

    // what it can run
    const ix = M + 104;
    row.appliances.forEach((a, ai) => {
      const cx = ix + ai * slot + slot / 2;
      drawIllustration(doc, a.icon, cx, y + 23, 28);
      f.reg(doc).fontSize(6.2).fillColor(TEXT).text(a.label, cx - slot / 2, y + 42, { width: slot, align: "center", lineBreak: false });
    });

    // bill range
    const bx = M + CW - 96;
    doc.moveTo(bx - 8, y + 12).lineTo(bx - 8, y + rowH - 12).lineWidth(0.6).strokeColor(BORDER).stroke();
    f.reg(doc).fontSize(6.8).fillColor(MUTED).text("Ideal monthly bill", bx, y + 15, { width: 90, lineBreak: false });
    f.semi(doc).fontSize(8.2).fillColor(DEEP).text(row.monthlyBill, bx, y + 28, { width: 90, lineBreak: false });
    y += rowH + 8;
  });

  // standard price guide
  y += 10;
  y = sectionHeading(doc, "Standard rooftop system price guide", y);
  const chipCount = SYSTEM_PRICE_LIST.length;
  const chipGap = 5;
  const chipW = (CW - (chipCount - 1) * chipGap) / chipCount;
  SYSTEM_PRICE_LIST.forEach((row, i) => {
    const x = M + i * (chipW + chipGap);
    const active = row.kw === Math.round(kw);
    doc.roundedRect(x, y, chipW, 54, 7).fillAndStroke(active ? DEEP : "#FFFFFF", active ? DEEP : BORDER);
    f.bold(doc).fontSize(10).fillColor(active ? "#FFFFFF" : SKY).text(`${row.kw} kW`, x, y + 9, { width: chipW, align: "center" });
    f.semi(doc).fontSize(7).fillColor(active ? "#FFFFFF" : TEXT).text(inr(row.price), x, y + 30, { width: chipW, align: "center" });
  });
  y += 62;
  f.reg(doc).fontSize(7.8).fillColor(MUTED).text("Indicative prices inclusive of GST, before subsidy. Final price is confirmed after the site survey.", M, y, { width: CW });
}

// ───────────────────────────── YOUR SAVINGS: 25-YEAR PICTURE ─────────────────────────────
/** Cumulative-savings bars against the net price. Flat tariff, no escalation — deliberately conservative. */
export function drawLongTermSavings(doc: Doc, y: number, netPrice: number, yearlySaving: number): number {
  const years = [5, 10, 15, 20, 25];
  const h = 240;
  card(doc, M, y, CW, h);
  f.semi(doc).fontSize(10).fillColor(TEXT).text("Your 25-year picture", M + 16, y + 14);
  f.reg(doc).fontSize(8).fillColor(MUTED).text("Total bill savings, year by year, against what you invest today.", M + 16, y + 28);

  const labelW = 46;
  const valueW = 78;
  const x0 = M + 16 + labelW;
  const barMax = CW - 32 - labelW - valueW - 8;
  const top = y + 66;
  const maxSaving = yearlySaving * years[years.length - 1]!;
  const scale = barMax / Math.max(maxSaving, netPrice, 1);

  years.forEach((yr, i) => {
    const by = top + i * 24;
    const saved = yearlySaving * yr;
    f.reg(doc).fontSize(8.2).fillColor(MUTED).text(`Year ${yr}`, M + 16, by + 4, { width: labelW, lineBreak: false });
    doc.roundedRect(x0, by, barMax, 15, 7.5).fill("#EEF2F7");
    const recovered = Math.min(saved, netPrice) * scale;
    const profit = Math.max(0, saved - netPrice) * scale;
    if (recovered > 0) doc.roundedRect(x0, by, Math.max(recovered, 6), 15, 7.5).fill(SKY);
    if (profit > 0) {
      // Square off the seam where the "recovered" bar meets the "profit" bar.
      doc.save();
      doc.rect(x0 + recovered, by, barMax, 15).clip();
      doc.roundedRect(x0 + recovered - 8, by, profit + 8, 15, 7.5).fill(GREEN);
      doc.restore();
    }
    f.semi(doc).fontSize(8.5).fillColor(TEXT).text(inr(saved), x0 + barMax + 8, by + 3.5, { width: valueW, lineBreak: false });
  });

  // net-price marker
  const mx = x0 + netPrice * scale;
  if (netPrice > 0 && mx < x0 + barMax) {
    doc.moveTo(mx, top - 8).lineTo(mx, top + years.length * 24 - 6).lineWidth(1.2).dash(3, { space: 3 }).strokeColor(ORANGE).stroke().undash();
    f.semi(doc).fontSize(7.4).fillColor(ORANGE).text(`Your net price ${inr(netPrice)}`, Math.min(mx - 50, x0 + barMax - 100), top - 22, { width: 120, lineBreak: false });
  }

  // legend + note
  const ly = y + h - 50;
  doc.roundedRect(M + 16, ly, 10, 10, 3).fill(SKY);
  f.reg(doc).fontSize(7.8).fillColor(TEXT).text("Paying back your investment", M + 31, ly + 1.5, { lineBreak: false });
  doc.roundedRect(M + 170, ly, 10, 10, 3).fill(GREEN);
  f.reg(doc).fontSize(7.8).fillColor(TEXT).text("Pure savings after payback", M + 185, ly + 1.5, { lineBreak: false });
  f.reg(doc).fontSize(7.3).fillColor(MUTED).text("Illustrative: today's tariff held flat for 25 years (no increase assumed). Real savings typically grow as tariffs rise.", M + 16, ly + 16, { width: CW - 32 });
  return y + h;
}

// ───────────────────────────── SUBSIDY ─────────────────────────────
const OWNER: Record<SubsidyOwner, { label: string; color: string }> = {
  us: { label: COMPANY.name, color: SKY },
  discom: { label: "Discom / Govt.", color: ORANGE },
  you: { label: "You", color: GREEN },
};

export function drawSubsidy(doc: Doc, q: PublicQuotation) {
  const ctx: [string, string] = ["Your government", "subsidy"];
  let y = newPage(doc, ctx[0], ctx[1], "How the central subsidy travels from the portal to your bank account.");

  // hero
  const netPrice = Math.max(0, q.subtotal - q.discountAmount);
  doc.roundedRect(M, y, CW, 98, 14).fill(DEEP);
  drawIllustration(doc, "gift", M + 56, y + 49, 74, { backdrop: "#1B4488" });
  f.reg(doc).fontSize(8.5).fillColor("#BBD3F7").text("ESTIMATED CENTRAL GOVT. SUBSIDY", M + 108, y + 18, { characterSpacing: 1 });
  f.bold(doc).fontSize(27).fillColor("#FFFFFF").text(inr(q.subsidyAmount), M + 108, y + 33, { lineBreak: false });
  f.reg(doc).fontSize(8.5).fillColor("#D7E4F8").text("credited directly to your bank account after commissioning", M + 108, y + 68, { width: 250 });
  const rx = M + CW - 150;
  doc.moveTo(rx - 14, y + 18).lineTo(rx - 14, y + 80).lineWidth(0.6).strokeColor("#3A5E9C").stroke();
  f.reg(doc).fontSize(7.6).fillColor("#BBD3F7").text("Net price (incl. GST)", rx, y + 18, { width: 140, lineBreak: false });
  f.semi(doc).fontSize(10.5).fillColor("#FFFFFF").text(inr(netPrice), rx, y + 30, { width: 140, lineBreak: false });
  f.reg(doc).fontSize(7.6).fillColor("#BBD3F7").text("After subsidy", rx, y + 52, { width: 140, lineBreak: false });
  f.bold(doc).fontSize(12).fillColor("#FFB45A").text(inr(q.totalAmount), rx, y + 64, { width: 140, lineBreak: false });
  y += 98 + 16;

  // legend
  f.semi(doc).fontSize(8).fillColor(MUTED).text("WHO DOES WHAT", M, y + 3, { characterSpacing: 0.8, lineBreak: false });
  let lx = M + 98;
  (Object.keys(OWNER) as SubsidyOwner[]).forEach((k) => {
    const { label, color } = OWNER[k];
    f.semi(doc).fontSize(7.6);
    const w = doc.widthOfString(label) + 22;
    doc.roundedRect(lx, y, w, 16, 8).fill(color);
    f.semi(doc).fontSize(7.6).fillColor("#FFFFFF").text(label, lx, y + 4.2, { width: w, align: "center", lineBreak: false });
    lx += w + 8;
  });
  y += 28;

  // steps
  const rowH = 60;
  const gap = 9;
  const iconX = M + 62;
  doc.moveTo(iconX, y + rowH / 2).lineTo(iconX, y + (rowH + gap) * (SUBSIDY_STEPS.length - 1) + rowH / 2).lineWidth(1.6).dash(3, { space: 3.4 }).strokeColor(SKY).stroke().undash();
  SUBSIDY_STEPS.forEach((step, i) => {
    const yy = y + i * (rowH + gap);
    card(doc, M, yy, CW, rowH);
    flag(doc, M + 12, yy + 14, i + 1);
    doc.circle(iconX, yy + rowH / 2, 25).fill("#FFFFFF");
    drawIllustration(doc, step.icon, iconX, yy + rowH / 2, 46, { backdrop: TINTS[i % 3] });
    f.semi(doc).fontSize(9.8).fillColor(DEEP).text(step.title, M + 100, yy + 12, { width: CW - 100 - 126 });
    f.reg(doc).fontSize(8.1).fillColor(MUTED).text(step.body, M + 100, yy + 27, { width: CW - 100 - 126 });
    const owner = OWNER[step.by];
    f.semi(doc).fontSize(7.4);
    const pw = doc.widthOfString(owner.label) + 20;
    doc.roundedRect(M + CW - pw - 14, yy + rowH / 2 - 8, pw, 16, 8).fill(owner.color);
    f.semi(doc).fontSize(7.4).fillColor("#FFFFFF").text(owner.label, M + CW - pw - 14, yy + rowH / 2 - 4, { width: pw, align: "center", lineBreak: false });
  });
  y += SUBSIDY_STEPS.length * (rowH + gap) + 4;

  // documents + disclaimer
  y = ensure(doc, y, 78, ctx[0], ctx[1]);
  card(doc, M, y, CW, 50, LIGHT_SKY);
  drawIllustration(doc, "form", M + 32, y + 25, 38);
  f.semi(doc).fontSize(9).fillColor(DEEP).text("Keep these ready", M + 62, y + 9);
  f.reg(doc).fontSize(8.3).fillColor(TEXT).text(SUBSIDY_DOCUMENTS.join("   ·   "), M + 62, y + 25, { width: CW - 76 });
  y += 60;
  f.reg(doc).fontSize(7.6).fillColor(MUTED).text("The subsidy amount, eligibility and timelines are set by the government scheme in force at the time of application and may change. The figure above is an estimate.", M, y, { width: CW });
}

// ───────────────────────────── PAYMENT MILESTONES ─────────────────────────────
export function drawMilestones(doc: Doc, y: number): number {
  const items = PAYMENT_TERMS.milestones;
  const gap = 10;
  const w = (CW - gap * (items.length - 1)) / items.length;
  const h = 164;
  items.forEach((m, i) => {
    const x = M + i * (w + gap);
    card(doc, x, y, w, h);
    flag(doc, x + 10, y + 10, i + 1);
    drawIllustration(doc, m.icon, x + w / 2, y + 44, 50, { backdrop: TINTS[i % 3] });
    f.semi(doc).fontSize(8.8).fillColor(DEEP);
    const th = centred(doc, m.milestone, x + w / 2, y + 78, w - 16);
    let ty = y + 84 + th;
    f.semi(doc).fontSize(6.6).fillColor(SKY).text("IF YOU CHOOSE EMI", x + 10, ty, { width: w - 20, characterSpacing: 0.4 });
    f.reg(doc).fontSize(7.8).fillColor(TEXT);
    const eh = doc.heightOfString(m.emi, { width: w - 20 });
    doc.text(m.emi, x + 10, ty + 9, { width: w - 20 });
    ty += 9 + eh + 6;
    f.semi(doc).fontSize(6.6).fillColor(ORANGE).text("IF YOU PAY DIRECTLY", x + 10, ty, { width: w - 20, characterSpacing: 0.4 });
    f.reg(doc).fontSize(7.8).fillColor(TEXT).text(m.direct, x + 10, ty + 9, { width: w - 20 });
    if (i < items.length - 1) arrowHead(doc, x + w + gap - 1, y + 44, 0, 5, SKY);
  });
  return y + h;
}

// ───────────────────────────── WARRANTY CARDS ─────────────────────────────
export function drawWarrantyCards(doc: Doc, y: number): number {
  const cols = 3;
  const gap = 12;
  const w = (CW - gap * (cols - 1)) / cols;
  const h = 108;
  WARRANTY_TABLE.forEach((row, i) => {
    const x = M + (i % cols) * (w + gap);
    const yy = y + Math.floor(i / cols) * (h + gap);
    card(doc, x, yy, w, h);
    drawIllustration(doc, row.icon, x + 34, yy + 34, 46, { backdrop: TINTS[i % 3] });
    f.bold(doc).fontSize(15).fillColor(SKY).text(row.years, x + 66, yy + 18, { width: w - 74, lineBreak: false });
    f.reg(doc).fontSize(7).fillColor(MUTED).text("coverage", x + 66, yy + 38, { width: w - 74, lineBreak: false });
    f.semi(doc).fontSize(8.6).fillColor(DEEP).text(row.component, x + 14, yy + 62, { width: w - 28 });
    if (row.note) {
      f.semi(doc).fontSize(6.8);
      const pw = doc.widthOfString(row.note) + 14;
      doc.roundedRect(x + 14, yy + h - 24, pw, 13, 6.5).fill(ORANGE);
      f.semi(doc).fontSize(6.8).fillColor("#FFFFFF").text(row.note, x + 14, yy + h - 21, { width: pw, align: "center", lineBreak: false });
    }
  });
  return y + Math.ceil(WARRANTY_TABLE.length / cols) * (h + gap) - gap;
}

// ───────────────────────────── YOUR SOLAR JOURNEY ─────────────────────────────
/** Full-page illustrated map: numbered stops snaking left → right → left, joined by dashed arrows. */
export function drawJourney(doc: Doc) {
  const ctx: [string, string] = ["Your solar", "journey with us"];
  const y0 = newPage(doc, ctx[0], ctx[1], "From booking to switch-on — here is how we take care of everything.");

  const perRow = 3;
  const colW = CW / perRow;
  const rows = Math.ceil(JOURNEY_STEPS.length / perRow);
  const top = y0 + 8;
  const rowH = Math.min(142, (bottom() - top) / rows);
  const pos = (i: number): { cx: number; cy: number; col: number } => {
    const r = Math.floor(i / perRow);
    const c = i % perRow;
    const col = r % 2 === 0 ? c : perRow - 1 - c;
    return { cx: M + colW * (col + 0.5), cy: top + r * rowH + 40, col };
  };

  // connectors first so illustrations sit on top of them
  for (let i = 0; i < JOURNEY_STEPS.length - 1; i++) {
    const a = pos(i);
    const b = pos(i + 1);
    if (Math.abs(a.cy - b.cy) < 1) {
      const dx = Math.sign(b.cx - a.cx);
      const x1 = a.cx + dx * 42;
      const x2 = b.cx - dx * 48;
      dashedArrow(doc, [x1, a.cy], [x1 + dx * 14, a.cy - 22], [x2 - dx * 14, a.cy - 22], [x2, a.cy], SKY);
    } else {
      // row end: loop out around the margin and back in to the first stop of the next row
      const side = a.col === perRow - 1 ? 1 : -1;
      dashedArrow(doc, [a.cx + side * 42, a.cy + 6], [a.cx + side * 96, a.cy + 6], [b.cx + side * 96, b.cy - 6], [b.cx + side * 46, b.cy - 6], SKY);
    }
  }

  JOURNEY_STEPS.forEach((step, i) => {
    const { cx, cy } = pos(i);
    drawIllustration(doc, step.icon, cx, cy, 64, { backdrop: TINTS[i % 3] });
    flag(doc, cx - 54, cy - 40, i + 1, i === JOURNEY_STEPS.length - 1 ? GREEN : DEEP);
    f.bold(doc).fontSize(9.2).fillColor(DEEP);
    const th = centred(doc, step.title, cx, cy + 40, 150);
    f.reg(doc).fontSize(7.8).fillColor(MUTED);
    centred(doc, step.body, cx, cy + 43 + th, 138);
  });

  // spare cell on the last row: how to reach us
  const lastRow = Math.floor((JOURNEY_STEPS.length - 1) / perRow);
  const used = JOURNEY_STEPS.length - lastRow * perRow;
  if (used < perRow) {
    const x = M + colW * used + 10;
    const yy = top + lastRow * rowH + 4;
    const w = CW - colW * used - 10;
    doc.roundedRect(x, yy, w, 126, 14).fill(ORANGE);
    drawIllustration(doc, "support", x + w / 2, yy + 34, 52);
    f.bold(doc).fontSize(9.5).fillColor("#FFFFFF");
    const th = centred(doc, "Questions on any step?", x + w / 2, yy + 66, w - 20);
    f.reg(doc).fontSize(7.8).fillColor("#FFFFFF");
    centred(doc, `Call or WhatsApp us\n${COMPANY.phones.join("\n")}`, x + w / 2, yy + 69 + th, w - 20);
  }
}
