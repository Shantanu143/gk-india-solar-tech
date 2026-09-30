import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Direction = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

const hidden: Record<Direction, { opacity: number; x?: number; y?: number; scale?: number }> = {
  up: { opacity: 0, y: 32 },
  left: { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  scale: { opacity: 0, scale: 0.92 },
};

/** Consistent entrance animation used across marketing sections as content scrolls into view. */
export function Reveal({ children, delay = 0, direction = "up", className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={hidden[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
