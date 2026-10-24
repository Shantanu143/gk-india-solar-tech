import fs from "node:fs";
import path from "node:path";
import { drawIllustration, type IconName } from "./pdfIllustrations";

/**
 * Page chrome and layout primitives shared by every page of the customer quotation PDF: palette,
 * fonts, page geometry, cards, tables and the running page title. (A4, 44pt margins, 46pt footer.)
 */

export const ASSETS = path.join(process.cwd(), "src", "assets");
export const FONT = {
  regular: path.join(ASSETS, "fonts", "Poppins-Regular.ttf"),
  medium: path.join(ASSETS, "fonts", "Poppins-Medium.ttf"),
  semi: path.join(ASSETS, "fonts", "Poppins-SemiBold.ttf"),
  bold: path.join(ASSETS, "fonts", "Poppins-Bold.ttf"),
};
export const LOGO = path.join(ASSETS, "logo.png");
export const COVER_IMAGE = path.join(ASSETS, "img", "hero.jpg");

export const DEEP = "#0B2F6B";
export const SKY = "#2A6BC9";
export const LIGHT_SKY = "#E8F0FB";
export const ORANGE = "#FD8002";
export const TEXT = "#1F2937";
export const MUTED = "#6B7280";
export const BORDER = "#DDE3EC";
export const PAGE_BG = "#F4F7FB";
export const GREEN = "#15803D";

export const W = 595.28;
export const H = 841.89;
export const M = 44;
export const CW = W - M * 2;
export const FOOTER_H = 46;

export const rupee = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
export const inr = (n: number) => `₹ ${rupee.format(Math.round(n))}`;

export type Doc = PDFKit.PDFDocument;
export const f = {
  reg: (d: Doc) => d.font("R"),
  med: (d: Doc) => d.font("M"),
  semi: (d: Doc) => d.font("S"),
  bold: (d: Doc) => d.font("B"),
};

/**
 * Shrinks (then ellipsises) a single-line string so it always fits `width`, using the doc's current
 * font. Customer names are free text — a long one must never run into the elements beside it.
 */
export function fitLine(doc: Doc, text: string, width: number, maxSize: number, minSize: number): { text: string; size: number } {
  let size = maxSize;
  doc.fontSize(size);
  while (size > minSize && doc.widthOfString(text) > width) {
    size -= 0.5;
    doc.fontSize(size);
  }
  if (doc.widthOfString(text) <= width) return { text, size };
  let clipped = text;
  while (clipped.length > 1 && doc.widthOfString(`${clipped}…`) > width) clipped = clipped.slice(0, -1);
  return { text: `${clipped.trimEnd()}…`, size };
}

export function pageBackground(doc: Doc, color = PAGE_BG) {
  doc.rect(0, 0, W, H).fill(color);
}

export function pageTitle(doc: Doc, plain: string, accent: string, subtitle?: string): number {
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

export function card(doc: Doc, x: number, y: number, w: number, h: number, fill = "#FFFFFF") {
  doc.roundedRect(x, y, w, h, 10).fillAndStroke(fill, BORDER);
}

export function bottom() {
  return H - FOOTER_H - 14;
}

export function newPage(doc: Doc, plain: string, accent: string, subtitle?: string): number {
  doc.addPage();
  pageBackground(doc);
  return pageTitle(doc, plain, accent, subtitle);
}

export function ensure(doc: Doc, y: number, need: number, plain: string, accent: string): number {
  if (y + need <= bottom()) return y;
  return newPage(doc, plain, accent);
}

/** Two-column-or-more table with a sky header row. Returns the y after the table. */
export function table(
  doc: Doc,
  y: number,
  cols: Array<{ label: string; w: number; align?: "left" | "right" | "center" }>,
  rows: string[][],
  opts: { boldLast?: boolean; highlightRow?: number; ctx: [string, string]; icons?: Array<IconName | undefined> },
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
    const rh = Math.max(opts.icons?.[i] ? 38 : 24, Math.max(...heights) + rowPad * 2 - 2);
    if (y + rh > bottom()) {
      y = newPage(doc, opts.ctx[0], opts.ctx[1]);
      y = drawHeader(y);
    }
    const last = opts.boldLast && i === rows.length - 1;
    const hi = opts.highlightRow === i;
    doc.rect(M, y, CW, rh).fill(hi ? LIGHT_SKY : last ? LIGHT_SKY : i % 2 ? "#FFFFFF" : "#FBFCFE");
    let x = M;
    row.forEach((cell, ci) => {
      const icon = ci === 0 ? opts.icons?.[i] : undefined;
      if (icon) {
        drawIllustration(doc, icon, x + cols[0]!.w / 2, y + rh / 2, 28, { backdrop: LIGHT_SKY });
        x += cols[ci]!.w;
        return;
      }
      (last || hi ? f.semi(doc) : f.reg(doc)).fontSize(9).fillColor(last ? DEEP : TEXT);
      // Icon rows are taller than their text, so centre the text against the icon.
      const textY = opts.icons ? y + (rh - heights[ci]!) / 2 : y + rowPad - 1;
      doc.text(cell, x + 10, textY, { width: cols[ci]!.w - 20, align: cols[ci]!.align ?? "left" });
      x += cols[ci]!.w;
    });
    doc.moveTo(M, y + rh).lineTo(M + CW, y + rh).lineWidth(0.6).strokeColor(BORDER).stroke();
    y += rh;
  });
  return y;
}

export function numberedList(doc: Doc, y: number, items: ReadonlyArray<string>, x = M, w = CW, ctx: [string, string]): number {
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
