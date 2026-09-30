import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Vertical travel in px; the image is oversized so edges never show. */
  strength?: number;
  priority?: boolean;
}

/** Image that drifts slower than the page as it scrolls through the viewport. */
export function ParallaxImage({ src, alt, className, strength = 60, priority = false }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        style={{ y, height: `calc(100% + ${strength * 2}px)`, top: -strength }}
        className="absolute inset-x-0 w-full max-w-none object-cover"
      />
    </div>
  );
}
