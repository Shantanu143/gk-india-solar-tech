/**
 * Flat, vector illustrations for the quotation PDF — original artwork drawn straight into the
 * document with PDFKit primitives (no image files, so they stay crisp at any zoom and cost ~nothing
 * in file size). Every illustration is authored on a 100 × 100 grid and scaled to whatever size the
 * layout asks for.
 *
 * The renderer registers the Poppins fonts as "R" / "M" / "S" / "B"; the few illustrations that
 * print a glyph (₹, EMI) rely on "B".
 */

type Doc = PDFKit.PDFDocument;
type Pt = [number, number];

const P = {
  deep: "#0B2F6B",
  sky: "#2A6BC9",
  light: "#E8F0FB",
  mist: "#CFE0F8",
  orange: "#FD8002",
  amber: "#F5A623",
  sun: "#FFC83D",
  green: "#15803D",
  leaf: "#34A853",
  mint: "#D6F0DF",
  skin: "#F2C6A0",
  skinDk: "#C98B5E",
  hair: "#2B2118",
  grey: "#CBD5E1",
  slate: "#64748B",
  ink: "#1F2937",
  white: "#FFFFFF",
  panel: "#1E4FA8",
  panelLine: "#8FB4EE",
  wood: "#E0A96D",
  woodDk: "#B8803F",
  red: "#E5484D",
  roof: "#C96A3B",
  wall: "#F7E6CF",
} as const;

// ───────────────────────────── drawing helpers ─────────────────────────────
const box = (d: Doc, x: number, y: number, w: number, h: number, fill: string, r = 0) => {
  (r ? d.roundedRect(x, y, w, h, r) : d.rect(x, y, w, h)).fill(fill);
};
const boxS = (d: Doc, x: number, y: number, w: number, h: number, fill: string, stroke: string, lw: number, r = 0) => {
  (r ? d.roundedRect(x, y, w, h, r) : d.rect(x, y, w, h)).lineWidth(lw).fillAndStroke(fill, stroke);
};
const dot = (d: Doc, cx: number, cy: number, r: number, fill: string) => {
  d.circle(cx, cy, r).fill(fill);
};
const dotS = (d: Doc, cx: number, cy: number, r: number, fill: string, stroke: string, lw: number) => {
  d.circle(cx, cy, r).lineWidth(lw).fillAndStroke(fill, stroke);
};
const poly = (d: Doc, pts: Pt[], fill: string) => {
  d.polygon(...pts).fill(fill);
};
const seg = (d: Doc, x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
  d.moveTo(x1, y1).lineTo(x2, y2).lineWidth(w).lineCap("round").strokeColor(color).stroke();
};
const line = (d: Doc, svg: string, color: string, w: number) => {
  d.path(svg).lineWidth(w).lineCap("round").lineJoin("round").strokeColor(color).stroke();
};
const shape = (d: Doc, svg: string, fill: string) => {
  d.path(svg).fill(fill);
};
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const tick = (d: Doc, x: number, y: number, s: number, color: string, w = 3) => {
  line(d, `M${x - s},${y} L${x - s / 3},${y + s * 0.75} L${x + s},${y - s * 0.65}`, color, w);
};
const sparkle = (d: Doc, cx: number, cy: number, r: number, fill: string) => {
  shape(d, `M${cx},${cy - r} Q${cx},${cy} ${cx + r},${cy} Q${cx},${cy} ${cx},${cy + r} Q${cx},${cy} ${cx - r},${cy} Q${cx},${cy} ${cx},${cy - r} Z`, fill);
};
const rupee = (d: Doc, cx: number, cy: number, size: number, color: string) => {
  d.font("B").fontSize(size).fillColor(color).text("₹", cx - size, cy - size * 0.72, { width: size * 2, align: "center", lineBreak: false });
};

/** A solar panel drawn as a quad (tl, tr, br, bl) with its cell grid. */
function solarQuad(d: Doc, q: [Pt, Pt, Pt, Pt], cols: number, rows: number) {
  const [tl, tr, br, bl] = q;
  poly(d, q, P.panel);
  for (let i = 1; i < cols; i++) {
    const a = lerp(tl, tr, i / cols);
    const b = lerp(bl, br, i / cols);
    seg(d, a[0], a[1], b[0], b[1], P.panelLine, 0.9);
  }
  for (let j = 1; j < rows; j++) {
    const a = lerp(tl, bl, j / rows);
    const b = lerp(tr, br, j / rows);
    seg(d, a[0], a[1], b[0], b[1], P.panelLine, 0.9);
  }
  d.polygon(...q).lineWidth(1.4).lineJoin("round").strokeColor("#DCE8FA").stroke();
}

interface PersonLook {
  shirt: string;
  skin?: string;
  hair?: string;
  hat?: "hard" | "none";
  headset?: boolean;
}
function person(d: Doc, o: PersonLook) {
  const skin = o.skin ?? P.skin;
  shape(d, "M16,96 Q16,62 50,62 Q84,62 84,96 Z", o.shirt);
  box(d, 44, 52, 12, 14, skin);
  poly(d, [[42, 62], [58, 62], [50, 74]], P.white);
  dot(d, 50, 40, 15, skin);
  if (o.hat === "hard") {
    shape(d, "M34,38 Q34,16 50,16 Q66,16 66,38 Z", P.sun);
    box(d, 29, 35, 42, 5, P.amber, 2.5);
    box(d, 47, 16, 6, 12, P.amber, 2);
  } else {
    shape(d, "M35,38 Q33,20 50,20 Q67,20 65,38 Q60,29 50,29 Q40,29 35,38 Z", o.hair ?? P.hair);
  }
  dot(d, 44.5, 42, 1.7, P.ink);
  dot(d, 55.5, 42, 1.7, P.ink);
  line(d, "M45,48 Q50,52.5 55,48", P.ink, 1.7);
  if (o.headset) {
    line(d, "M33,40 Q32,19 50,19 Q68,19 67,40", P.deep, 3);
    box(d, 29.5, 36, 6.5, 13, P.deep, 3);
    box(d, 64, 36, 6.5, 13, P.deep, 3);
    line(d, "M32,48 Q35,57 46,56", P.deep, 2);
    dot(d, 47.5, 56, 2.6, P.orange);
  }
}

/** A flat-roofed house with a row of rooftop panels. */
function house(d: Doc) {
  box(d, 18, 54, 64, 34, P.wall, 2);
  box(d, 12, 47, 76, 9, P.deep, 3);
  solarQuad(d, [[20, 47], [29, 29], [46, 29], [37, 47]], 3, 2);
  solarQuad(d, [[50, 47], [59, 29], [76, 29], [67, 47]], 3, 2);
  box(d, 44, 64, 13, 24, P.orange, 2);
  dot(d, 54, 77, 1.2, P.white);
  boxS(d, 24, 62, 14, 13, P.mist, P.white, 1.5, 2);
  boxS(d, 62, 62, 14, 13, P.mist, P.white, 1.5, 2);
}

function tree(d: Doc, x: number, base: number, s: number) {
  box(d, x - 2 * s, base - 14 * s, 4 * s, 14 * s, P.woodDk);
  dot(d, x, base - 22 * s, 12 * s, P.leaf);
  dot(d, x - 7 * s, base - 16 * s, 8 * s, P.green);
  dot(d, x + 7 * s, base - 17 * s, 8 * s, P.leaf);
}

function car(d: Doc, x: number, y: number, s: number) {
  d.save();
  d.translate(x, y);
  d.scale(s);
  shape(d, "M0,22 L4,12 Q6,8 11,8 L29,8 Q34,8 37,12 L44,16 Q50,17 50,22 L50,26 L0,26 Z", P.red);
  poly(d, [[9, 9.5], [14, 9.5], [14, 15], [6, 15]], P.mist);
  poly(d, [[17, 9.5], [29, 9.5], [34, 15], [17, 15]], P.mist);
  dotS(d, 12, 27, 5, P.ink, P.white, 1.2);
  dotS(d, 38, 27, 5, P.ink, P.white, 1.2);
  d.restore();
}

function wheel(d: Doc, cx: number, cy: number, r: number) {
  dot(d, cx, cy, r, P.ink);
  dot(d, cx, cy, r * 0.45, P.grey);
}

function handset(d: Doc, cx: number, cy: number, s: number, color: string) {
  d.save();
  d.translate(cx, cy);
  d.scale(s);
  line(d, "M-8,-8 Q-10,9 8,8", color, 5.5);
  d.rotate(-45);
  box(d, -9.5, -9, 8, 9, color, 3);
  box(d, 5, 0, 8, 9, color, 3);
  d.restore();
}

export const ICON_NAMES = [
  "sun", "panel", "inverter", "meter", "house", "tower", "money", "manager", "clipboard", "design", "calendar", "emi", "bank",
  "boxes", "van", "installer", "cleaning", "support", "ecohome", "shield", "service", "survey", "form", "laptop", "wifi",
  "structure", "cable", "gift", "dbt", "bulb", "fan", "tv", "fridge", "ac", "pump", "cooler", "washer", "geyser", "ev",
  "bill", "co2", "moon", "battery",
] as const;
export type IconName = (typeof ICON_NAMES)[number];

const ICONS: Record<IconName, (d: Doc) => void> = {
  sun(d) {
    dot(d, 50, 50, 20, P.sun);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      seg(d, 50 + 29 * Math.cos(a), 50 + 29 * Math.sin(a), 50 + 41 * Math.cos(a), 50 + 41 * Math.sin(a), P.sun, 6);
    }
    dot(d, 50, 50, 12, "#FFE08A");
  },

  panel(d) {
    solarQuad(d, [[34, 26], [88, 26], [72, 64], [16, 64]], 4, 3);
    seg(d, 40, 64, 40, 82, P.slate, 4);
    seg(d, 62, 64, 62, 82, P.slate, 4);
    seg(d, 26, 84, 78, 84, P.slate, 4);
    sparkle(d, 28, 20, 7, P.sun);
  },

  inverter(d) {
    box(d, 24, 14, 52, 66, P.deep, 8);
    box(d, 31, 21, 38, 22, "#9ED0FF", 3);
    shape(d, "M52,24 L43,34 L49,34 L46,41 L58,30 L52,30 Z", P.sun);
    dot(d, 36, 54, 3, P.leaf);
    dot(d, 46, 54, 3, P.orange);
    dot(d, 56, 54, 3, P.white);
    for (let i = 0; i < 3; i++) box(d, 32, 62 + i * 5, 36, 2, "#3C5C96", 1);
    box(d, 34, 80, 9, 9, P.slate, 2);
    box(d, 57, 80, 9, 9, P.slate, 2);
    seg(d, 38, 89, 38, 96, P.orange, 2.5);
    seg(d, 62, 89, 62, 96, P.sky, 2.5);
  },

  meter(d) {
    boxS(d, 24, 12, 52, 70, P.white, P.deep, 3.5, 9);
    dotS(d, 50, 40, 20, P.light, P.sky, 3);
    line(d, "M40,35 L58,35 M53,30 L58,35 L53,40", P.green, 2.8);
    line(d, "M60,46 L42,46 M47,41 L42,46 L47,51", P.orange, 2.8);
    box(d, 33, 66, 34, 9, P.deep, 2);
    for (let i = 0; i < 4; i++) box(d, 36 + i * 7, 68, 5, 5, "#9ED0FF", 1);
    box(d, 36, 82, 28, 7, P.grey, 2);
  },

  house(d) {
    sparkle(d, 84, 20, 8, P.sun);
    house(d);
  },

  tower(d) {
    line(d, "M50,12 L30,92 M50,12 L70,92", P.deep, 3.5);
    line(d, "M24,30 L76,30 M31,52 L69,52 M36,72 L64,72", P.deep, 3);
    line(d, "M50,30 L36,72 M50,30 L64,72 M38,52 L62,52", P.deep, 1.5);
    line(d, "M24,30 L24,38 M76,30 L76,38 M31,52 L31,58 M69,52 L69,58", P.slate, 3);
    line(d, "M24,38 Q10,52 2,60 M76,38 Q90,52 98,60", P.slate, 1.5);
    dot(d, 50, 10, 4, P.orange);
  },

  money(d) {
    boxS(d, 22, 24, 62, 34, "#8FD0A8", P.green, 2, 4);
    boxS(d, 14, 38, 62, 34, "#4FB57A", P.green, 2, 4);
    dotS(d, 45, 55, 11, P.mint, P.green, 2);
    rupee(d, 45, 55, 11, P.green);
    dot(d, 22, 55, 2.5, P.mint);
    dot(d, 68, 55, 2.5, P.mint);
    dotS(d, 76, 76, 14, P.sun, P.amber, 3);
    rupee(d, 76, 76, 13, P.woodDk);
  },

  manager(d) {
    dot(d, 50, 50, 46, P.light);
    d.save();
    d.translate(0, 4);
    person(d, { shirt: P.sky, headset: true });
    d.restore();
  },


  clipboard(d) {
    box(d, 22, 12, 56, 78, P.amber, 7);
    box(d, 28, 22, 44, 62, P.white, 3);
    box(d, 39, 8, 22, 12, P.deep, 4);
    dot(d, 50, 14, 2.5, P.white);
    for (let i = 0; i < 3; i++) {
      const y = 31 + i * 16;
      boxS(d, 34, y, 9, 9, P.white, P.green, 1.6, 2);
      tick(d, 38.5, y + 4.8, 2.6, P.green, 1.8);
      box(d, 48, y + 1.5, 18, 2.4, P.grey, 1);
      box(d, 48, y + 5.5, 12, 2.4, P.grey, 1);
    }
  },

  design(d) {
    boxS(d, 12, 18, 76, 52, P.deep, P.deep, 1, 6);
    box(d, 17, 23, 66, 42, P.light, 3);
    for (let i = 1; i < 6; i++) seg(d, 17 + i * 11, 23, 17 + i * 11, 65, "#D3E2F8", 0.8);
    for (let j = 1; j < 4; j++) seg(d, 17, 23 + j * 10.5, 83, 23 + j * 10.5, "#D3E2F8", 0.8);
    line(d, "M26,58 L26,44 L50,32 L74,44 L74,58 Z", P.sky, 2);
    solarQuad(d, [[36, 42], [44, 36], [50, 39], [42, 45]], 2, 1);
    solarQuad(d, [[52, 39], [60, 36], [66, 42], [58, 45]], 2, 1);
    box(d, 43, 70, 14, 10, P.deep);
    box(d, 30, 80, 40, 6, P.deep, 3);
    dotS(d, 82, 24, 12, P.green, P.white, 2.5);
    tick(d, 82, 24, 5, P.white, 2.6);
  },

  calendar(d) {
    boxS(d, 16, 20, 68, 66, P.white, P.deep, 3, 7);
    box(d, 16, 20, 68, 20, P.orange, 7);
    box(d, 16, 32, 68, 8, P.orange);
    box(d, 30, 12, 7, 15, P.deep, 3.5);
    box(d, 63, 12, 7, 15, P.deep, 3.5);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) box(d, 24 + c * 14, 48 + r * 13, 9, 8, r === 1 && c === 2 ? P.sky : P.mist, 2);
    }
    tick(d, 24 + 2 * 14 + 4.5, 48 + 13 + 4.2, 3, P.white, 1.8);
  },

  emi(d) {
    d.save();
    d.translate(-6, -4);
    ICONS.calendar(d);
    d.restore();
    for (let i = 0; i < 3; i++) {
      d.ellipse(76, 84 - i * 6, 14, 5.5).lineWidth(1.5).fillAndStroke(P.sun, P.amber);
    }
    d.ellipse(76, 66, 14, 5.5).lineWidth(1.5).fillAndStroke("#FFE08A", P.amber);
    box(d, 52, 16, 40, 16, P.green, 8);
    d.font("B").fontSize(11).fillColor(P.white).text("EMI", 52, 19.5, { width: 40, align: "center", lineBreak: false });
  },

  bank(d) {
    poly(d, [[50, 14], [12, 38], [88, 38]], P.deep);
    box(d, 14, 38, 72, 6, P.sky);
    for (let i = 0; i < 4; i++) box(d, 20 + i * 17, 47, 9, 28, P.mist, 2);
    box(d, 12, 78, 76, 7, P.sky, 2);
    box(d, 8, 85, 84, 7, P.deep, 2);
    dotS(d, 50, 29, 6, P.sun, P.amber, 1.2);
    rupee(d, 50, 29, 6.5, P.woodDk);
  },

  boxes(d) {
    boxS(d, 8, 58, 40, 32, P.wood, P.woodDk, 2, 2);
    boxS(d, 52, 58, 40, 32, P.wood, P.woodDk, 2, 2);
    boxS(d, 30, 26, 40, 32, "#EBBA7F", P.woodDk, 2, 2);
    box(d, 25, 58, 6, 12, P.woodDk);
    box(d, 69, 58, 6, 12, P.woodDk);
    box(d, 47, 26, 6, 12, P.woodDk);
    dotS(d, 82, 24, 12, P.green, P.white, 2.5);
    tick(d, 82, 24, 5, P.white, 2.6);
  },

  van(d) {
    boxS(d, 6, 28, 56, 46, P.white, P.sky, 3, 5);
    shape(d, "M62,40 L80,40 Q86,40 89,46 L94,58 L94,74 L62,74 Z", P.sky);
    poly(d, [[67, 44], [79, 44], [86, 56], [67, 56]], P.mist);
    box(d, 6, 62, 56, 8, P.sky);
    dot(d, 22, 44, 6.5, P.sun);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      seg(d, 22 + 9 * Math.cos(a), 44 + 9 * Math.sin(a), 22 + 12 * Math.cos(a), 44 + 12 * Math.sin(a), P.sun, 1.6);
    }
    solarQuad(d, [[36, 38], [54, 38], [51, 55], [33, 55]], 3, 2);
    wheel(d, 26, 76, 9);
    wheel(d, 76, 76, 9);
    seg(d, 2, 86, 98, 86, P.grey, 3);
  },

  installer(d) {
    // The roof is cropped to the round backdrop so its corners never poke out of it.
    d.save();
    d.circle(50, 50, 50).clip();
    shape(d, "M0,82 L100,50 L100,100 L0,100 Z", P.roof);
    line(d, "M0,82 L100,50", "#E8946A", 3);
    for (let i = 1; i < 8; i++) seg(d, i * 14, 100, i * 14 + 6, 78 - i * 3.3, "#B5552B", 1);
    d.restore();
    d.save();
    d.translate(36, 70);
    d.rotate(-17.5);
    boxS(d, 0, -22, 54, 22, P.panel, "#DCE8FA", 1.5, 1);
    for (let i = 1; i < 6; i++) seg(d, i * 9, -22, i * 9, 0, P.panelLine, 0.8);
    seg(d, 0, -11, 54, -11, P.panelLine, 0.8);
    d.restore();
    box(d, 12, 56, 6, 17, P.deep, 2);
    box(d, 21, 56, 6, 16, P.deep, 2);
    box(d, 9, 30, 21, 28, P.orange, 5);
    box(d, 12, 40, 15, 3, P.sun);
    dot(d, 19.5, 22, 7.5, P.skin);
    shape(d, "M11.5,22 Q11.5,10 19.5,10 Q27.5,10 27.5,22 Z", P.sun);
    box(d, 8, 21, 23, 3.5, P.amber, 1.8);
    seg(d, 28, 40, 40, 52, P.orange, 5);
    sparkle(d, 80, 22, 9, P.sun);
    dot(d, 80, 22, 6, P.sun);
  },

  cleaning(d) {
    seg(d, 72, 10, 38, 66, P.woodDk, 5);
    shape(d, "M24,66 Q40,56 56,64 L62,86 Q42,94 20,88 Z", P.amber);
    for (let i = 0; i < 4; i++) seg(d, 28 + i * 9, 72, 25 + i * 9.5, 87, P.woodDk, 1.4);
    boxS(d, 68, 54, 18, 34, P.sky, P.deep, 2, 5);
    box(d, 70, 44, 16, 10, P.deep, 3);
    box(d, 62, 44, 10, 4, P.deep, 2);
    box(d, 72, 66, 10, 8, P.white, 2);
    for (const [x, y, r] of [[50, 30, 6], [62, 20, 4], [38, 38, 4.5]] as const) dotS(d, x, y, r, "#EAF3FF", P.sky, 1.4);
    sparkle(d, 22, 30, 8, P.sun);
    sparkle(d, 88, 24, 6, P.sun);
  },

  support(d) {
    dotS(d, 32, 62, 22, P.sky, P.white, 3);
    handset(d, 32, 62, 1.1, P.white);
    dotS(d, 62, 36, 22, "#25B864", P.white, 3);
    shape(d, "M50,52 L46,64 L58,57 Z", "#25B864");
    d.save();
    d.translate(62, 36);
    d.scale(0.8);
    handset(d, 0, 0, 1, P.white);
    d.restore();
    boxS(d, 54, 62, 38, 28, P.white, P.red, 2.5, 5);
    line(d, "M56,66 L73,79 L90,66", P.red, 2.4);
  },

  ecohome(d) {
    seg(d, 2, 92, 98, 92, P.grey, 3);
    sparkle(d, 86, 14, 7, P.sun);
    d.save();
    d.translate(-6, -2);
    d.scale(0.86);
    house(d);
    d.restore();
    tree(d, 85, 92, 0.78);
    car(d, 44, 73, 0.55);
  },

  shield(d) {
    shape(d, "M50,8 L84,20 L84,48 Q84,74 50,92 Q16,74 16,48 L16,20 Z", P.deep);
    shape(d, "M50,16 L77,25 L77,48 Q77,69 50,84 Q23,69 23,48 L23,25 Z", P.sky);
    tick(d, 50, 50, 15, P.white, 7);
    sparkle(d, 84, 12, 7, P.sun);
  },

  service(d) {
    seg(d, 24, 78, 56, 46, P.slate, 10);
    dot(d, 64, 38, 17, P.slate);
    dot(d, 72, 30, 8, P.light);
    poly(d, [[66, 32], [80, 18], [84, 24], [70, 38]], P.light);
    dot(d, 24, 78, 7, P.slate);
    dot(d, 24, 78, 3, P.light);
    dotS(d, 78, 74, 14, P.sun, P.amber, 2.5);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      seg(d, 78 + 12 * Math.cos(a), 74 + 12 * Math.sin(a), 78 + 17 * Math.cos(a), 74 + 17 * Math.sin(a), P.amber, 3);
    }
    dot(d, 78, 74, 5, P.white);
  },

  survey(d) {
    box(d, 12, 50, 52, 40, P.wall, 2);
    poly(d, [[6, 52], [38, 24], [70, 52]], P.deep);
    box(d, 32, 66, 12, 24, P.orange, 2);
    box(d, 18, 60, 10, 10, P.mist, 2);
    dotS(d, 66, 46, 17, "#EAF3FF", P.orange, 5);
    seg(d, 78, 58, 92, 74, P.orange, 7);
    solarQuad(d, [[58, 40], [74, 40], [72, 52], [56, 52]], 3, 2);
  },

  form(d) {
    boxS(d, 20, 10, 52, 76, P.white, P.deep, 3, 5);
    for (let i = 0; i < 5; i++) box(d, 28, 22 + i * 10, i % 2 ? 28 : 36, 3, P.grey, 1.5);
    box(d, 28, 70, 20, 3, P.sky, 1.5);
    dotS(d, 68, 72, 17, P.orange, P.white, 3);
    tick(d, 68, 72, 7, P.white, 3.4);
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      seg(d, 68 + 18 * Math.cos(a), 72 + 18 * Math.sin(a), 68 + 21 * Math.cos(a), 72 + 21 * Math.sin(a), P.orange, 2);
    }
  },

  laptop(d) {
    boxS(d, 18, 20, 64, 44, P.deep, P.deep, 1, 5);
    box(d, 23, 25, 54, 34, P.white, 2);
    box(d, 23, 25, 54, 7, P.mist, 2);
    dot(d, 28, 28.5, 1.3, P.red);
    dot(d, 33, 28.5, 1.3, P.sun);
    dot(d, 38, 28.5, 1.3, P.leaf);
    for (let i = 0; i < 3; i++) box(d, 29, 38 + i * 6, 28, 3, P.grey, 1.5);
    box(d, 60, 38, 12, 14, P.orange, 2);
    poly(d, [[8, 70], [92, 70], [86, 80], [14, 80]], P.slate);
    box(d, 40, 70, 20, 3, P.grey, 1.5);
  },

  wifi(d) {
    line(d, "M14,44 Q50,10 86,44", P.sky, 7);
    line(d, "M27,57 Q50,36 73,57", P.sky, 7);
    line(d, "M39,70 Q50,60 61,70", P.sky, 7);
    dot(d, 50, 80, 6, P.orange);
  },

  structure(d) {
    solarQuad(d, [[28, 18], [90, 18], [76, 48], [14, 48]], 4, 2);
    seg(d, 28, 50, 20, 86, P.slate, 5);
    seg(d, 70, 50, 78, 86, P.slate, 5);
    seg(d, 24, 68, 74, 68, P.slate, 3);
    seg(d, 22, 76, 72, 60, P.grey, 2);
    box(d, 10, 86, 24, 5, P.deep, 2);
    box(d, 66, 86, 24, 5, P.deep, 2);
  },

  cable(d) {
    line(d, "M10,70 Q30,20 50,50 T90,30", P.ink, 6);
    line(d, "M10,70 Q30,20 50,50 T90,30", P.orange, 2.6);
    box(d, 4, 64, 12, 12, P.slate, 3);
    box(d, 84, 24, 12, 12, P.slate, 3);
    shape(d, "M60,64 L50,80 L58,80 L54,94 L70,74 L61,74 L66,64 Z", P.sun);
  },

  gift(d) {
    boxS(d, 18, 42, 64, 46, P.sky, P.deep, 2, 3);
    boxS(d, 12, 32, 76, 14, P.mist, P.deep, 2, 3);
    box(d, 45, 32, 10, 56, P.orange);
    shape(d, "M50,32 Q30,8 26,24 Q24,34 50,32 Z", P.orange);
    shape(d, "M50,32 Q70,8 74,24 Q76,34 50,32 Z", P.amber);
    sparkle(d, 90, 16, 7, P.sun);
    sparkle(d, 10, 18, 5, P.sun);
  },

  dbt(d) {
    d.save();
    d.translate(0, 14);
    d.scale(0.8);
    ICONS.bank(d);
    d.restore();
    dotS(d, 50, 16, 11, P.sun, P.amber, 2.5);
    rupee(d, 50, 16, 11, P.woodDk);
    line(d, "M78,10 L78,30 M71,23 L78,31 L85,23", P.green, 3.4);
  },



  bulb(d) {
    dot(d, 50, 40, 22, P.sun);
    shape(d, "M38,56 Q40,68 40,70 L60,70 Q60,68 62,56 Z", P.sun);
    dot(d, 42, 32, 6, "#FFE9A6");
    box(d, 39, 70, 22, 6, P.grey, 2);
    box(d, 41, 77, 18, 6, P.slate, 2);
    seg(d, 50, 6, 50, 12, P.amber, 3);
    seg(d, 20, 18, 25, 23, P.amber, 3);
    seg(d, 80, 18, 75, 23, P.amber, 3);
  },

  fan(d) {
    box(d, 47, 4, 6, 26, P.slate, 2);
    for (const a of [0, 120, 240]) {
      d.save();
      d.translate(50, 52);
      d.rotate(a);
      d.ellipse(0, -22, 8, 19).fill(P.sky);
      d.restore();
    }
    dot(d, 50, 52, 9, P.deep);
    dot(d, 50, 52, 3.5, P.light);
  },

  tv(d) {
    boxS(d, 8, 20, 84, 54, P.deep, P.deep, 1, 6);
    box(d, 14, 26, 72, 42, "#9DC4F5", 3);
    poly(d, [[14, 68], [38, 46], [56, 62], [66, 54], [86, 68]], P.leaf);
    dot(d, 70, 38, 6, P.sun);
    seg(d, 38, 78, 28, 90, P.deep, 4);
    seg(d, 62, 78, 72, 90, P.deep, 4);
  },

  fridge(d) {
    boxS(d, 26, 8, 48, 84, P.light, P.deep, 3.5, 7);
    seg(d, 26, 38, 74, 38, P.deep, 3);
    box(d, 34, 18, 4, 14, P.deep, 2);
    box(d, 34, 47, 4, 22, P.deep, 2);
    dot(d, 62, 22, 2.5, P.leaf);
    box(d, 30, 92, 8, 4, P.slate, 1);
    box(d, 62, 92, 8, 4, P.slate, 1);
  },

  ac(d) {
    boxS(d, 8, 24, 84, 36, P.white, P.deep, 3.5, 9);
    box(d, 16, 46, 68, 6, P.grey, 3);
    dot(d, 78, 34, 3, P.leaf);
    box(d, 16, 32, 22, 4, P.mist, 2);
    line(d, "M22,68 Q28,74 34,68 T46,68 M44,76 Q50,82 56,76 T68,76 M62,66 Q68,72 74,66", P.sky, 3);
    sparkle(d, 86, 78, 6, P.sky);
  },

  pump(d) {
    box(d, 12, 38, 44, 32, P.sky, 7);
    for (let i = 0; i < 4; i++) seg(d, 20 + i * 8, 40, 20 + i * 8, 68, "#1E55A8", 2);
    box(d, 56, 44, 12, 20, P.deep, 3);
    box(d, 68, 50, 24, 9, P.grey, 2);
    box(d, 16, 70, 36, 6, P.deep, 2);
    shape(d, "M34,10 Q42,22 42,26 Q42,32 34,32 Q26,32 26,26 Q26,22 34,10 Z", "#6FB6FF");
    dot(d, 82, 74, 3, "#6FB6FF");
    dot(d, 90, 82, 2.4, "#6FB6FF");
  },

  cooler(d) {
    boxS(d, 24, 8, 52, 76, "#CFE3FF", P.deep, 3.5, 7);
    for (let i = 0; i < 5; i++) seg(d, 31, 18 + i * 6, 69, 18 + i * 6, P.sky, 2);
    dotS(d, 50, 62, 12, P.white, P.deep, 2.5);
    for (const a of [0, 120, 240]) {
      d.save();
      d.translate(50, 62);
      d.rotate(a);
      d.ellipse(0, -5, 2.8, 6).fill(P.sky);
      d.restore();
    }
    box(d, 30, 84, 6, 8, P.slate, 1);
    box(d, 64, 84, 6, 8, P.slate, 1);
  },

  washer(d) {
    boxS(d, 20, 8, 60, 84, P.white, P.deep, 3.5, 7);
    seg(d, 20, 26, 80, 26, P.deep, 2.5);
    dotS(d, 66, 17, 4.5, P.mist, P.sky, 1.5);
    dot(d, 32, 17, 2.5, P.leaf);
    dotS(d, 50, 58, 22, "#CFE3FF", P.deep, 3.5);
    dot(d, 50, 58, 14, P.sky);
    line(d, "M40,60 Q45,54 50,60 T60,60", P.white, 2);
  },

  geyser(d) {
    boxS(d, 28, 8, 44, 66, P.white, P.deep, 3.5, 14);
    dotS(d, 50, 32, 9, P.light, P.deep, 2);
    seg(d, 50, 32, 55, 27, P.orange, 2.5);
    dot(d, 50, 32, 1.8, P.deep);
    box(d, 36, 74, 7, 18, P.sky, 2);
    box(d, 57, 74, 7, 18, P.orange, 2);
    box(d, 40, 46, 20, 4, P.mist, 2);
    box(d, 40, 54, 20, 4, P.mist, 2);
  },

  ev(d) {
    car(d, 8, 38, 1.55);
    box(d, 70, 10, 22, 30, P.deep, 5);
    box(d, 74, 14, 14, 9, P.green, 2);
    seg(d, 81, 40, 81, 56, P.deep, 3);
    shape(d, "M52,18 L44,30 L50,30 L46,42 L60,26 L53,26 L57,18 Z", P.sun);
  },

  bill(d) {
    d.save();
    d.translate(-9, 0);
    shape(d, "M20,8 L80,8 L80,92 L70,86 L60,92 L50,86 L40,92 L30,86 L20,92 Z", P.white);
    d.path("M20,8 L80,8 L80,92 L70,86 L60,92 L50,86 L40,92 L30,86 L20,92 Z").lineWidth(2.5).strokeColor(P.deep).stroke();
    for (let i = 0; i < 4; i++) box(d, 30, 20 + i * 9, i % 2 ? 24 : 36, 3, P.grey, 1.5);
    rupee(d, 50, 66, 11, P.deep);
    d.restore();
    shape(d, "M86,38 L86,70 L94,70 L82,86 L70,70 L78,70 L78,38 Z", P.green);
  },

  moon(d) {
    shape(d, "M62,10 A40,40 0 1 0 90,66 A32,32 0 0 1 62,10 Z", "#FFE08A");
    sparkle(d, 78, 22, 6, P.sun);
    sparkle(d, 88, 40, 4, P.sun);
    dot(d, 34, 56, 3, "#F5CD62");
    dot(d, 44, 74, 4.5, "#F5CD62");
  },

  battery(d) {
    boxS(d, 12, 30, 68, 42, P.white, P.deep, 3.5, 7);
    box(d, 80, 42, 8, 18, P.deep, 2);
    for (let i = 0; i < 3; i++) box(d, 20 + i * 18, 38, 14, 26, i < 2 ? P.leaf : P.mist, 3);
    shape(d, "M52,8 L44,22 L51,22 L47,34 L60,18 L53,18 L57,8 Z", P.sun);
  },

  co2(d) {
    tree(d, 36, 80, 1.5);
    seg(d, 4, 88, 96, 88, P.grey, 3);
    dotS(d, 76, 36, 17, P.mint, P.green, 2.5);
    d.font("B").fontSize(11).fillColor(P.green).text("CO2", 58, 30.5, { width: 36, align: "center", lineBreak: false });
    line(d, "M66,60 L66,78 M60,72 L66,79 L72,72", P.green, 3);
  },

};

export interface IllustrationOptions {
  /** Soft circular tint drawn behind the artwork. */
  backdrop?: string;
}

/** Draws illustration `name` centred on (cx, cy), scaled to fit a `size`-pt square. */
export function drawIllustration(doc: Doc, name: IconName, cx: number, cy: number, size: number, opts: IllustrationOptions = {}) {
  doc.save();
  doc.translate(cx - size / 2, cy - size / 2);
  doc.scale(size / 100);
  if (opts.backdrop) dot(doc, 50, 50, 50, opts.backdrop);
  ICONS[name](doc);
  doc.restore();
}
