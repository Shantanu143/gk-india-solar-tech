import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/** Number that counts up from zero the first time it scrolls into view. */
export function CountUp({ to, prefix = "", suffix = "", decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
