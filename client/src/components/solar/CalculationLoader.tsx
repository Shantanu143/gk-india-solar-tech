import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sun } from "lucide-react";

const STATUS_MESSAGES = [
  "Reviewing electricity usage",
  "Estimating solar capacity",
  "Calculating savings",
  "Preparing your recommendation",
];

export function CalculationLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-orange/10 text-orange"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <Sun className="h-8 w-8" aria-hidden="true" />
      </motion.span>
      <h2 className="mt-6 text-xl font-bold text-navy">Analyzing Your Energy Usage</h2>
      <div className="mt-2 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {STATUS_MESSAGES[messageIndex]}…
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
