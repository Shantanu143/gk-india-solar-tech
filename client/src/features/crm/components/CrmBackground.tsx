/**
 * Fixed gradient-mesh backdrop for the CRM's glassmorphism surfaces — every translucent panel
 * (Sidebar, Topbar, GlassPanel, Modal) needs something colorful behind it to actually blur/refract,
 * otherwise "glass" over a flat background is indistinguishable from a plain tinted box.
 */
export function CrmBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-orange/25 blur-[130px]" />
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-navy/15 blur-[130px]" />
      <div className="absolute -bottom-40 right-1/4 h-[26rem] w-[26rem] rounded-full bg-green/20 blur-[130px]" />
    </div>
  );
}
