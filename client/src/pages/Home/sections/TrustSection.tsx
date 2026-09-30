import { Marquee } from "@/components/motion/Marquee";
import { trustItems } from "@/data/whyChooseUs";

export function TrustSection() {
  return (
    <div className="border-b border-border bg-surface py-5">
      <Marquee>
        {[...trustItems, ...trustItems].map(({ icon: Icon, label }, i) => (
          <span key={i} className="flex items-center gap-2.5 text-sm font-semibold whitespace-nowrap text-navy/80">
            <Icon className="h-5 w-5 text-sky" aria-hidden="true" />
            {label}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
