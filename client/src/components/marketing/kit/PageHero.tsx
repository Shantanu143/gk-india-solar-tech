import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";

export interface HeroChip {
  icon: LucideIcon;
  label: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  imagePosition?: string;
  actions?: ReactNode;
  chips?: HeroChip[];
  /** "tall" for landing-style pages, "short" for utility pages (forms, legal). */
  size?: "tall" | "short";
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } };
const word = {
  hidden: { opacity: 0, y: 28, rotateX: -40 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};
const fade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

/** Full-bleed photographic page header: parallax background, word-by-word title, glass chips. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imagePosition = "center",
  actions,
  chips,
  size = "tall",
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <section
      ref={ref}
      className={`relative isolate overflow-hidden bg-sky-deep text-white ${size === "tall" ? "pt-40 pb-16 sm:pt-48 sm:pb-24" : "pt-36 pb-12 sm:pt-44 sm:pb-16"}`}
    >
      <motion.img
        src={image}
        alt=""
        fetchPriority="high"
        style={{ y, scale, objectPosition: imagePosition }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_47_107/0.85)_0%,rgb(20_80_170/0.45)_60%,rgb(20_80_170/0.15)_100%),linear-gradient(0deg,rgb(8_40_110/0.6)_0%,transparent_50%)]"
      />

      <Container>
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          {eyebrow && (
            <motion.span
              variants={fade}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-light" />
              {eyebrow}
            </motion.span>
          )}
          <h1
            aria-label={title}
            className="mt-5 flex flex-wrap gap-x-[0.28em] font-serif text-5xl leading-[1.05] font-normal tracking-tight text-white [perspective:600px] sm:text-6xl lg:text-7xl"
          >
            {title.split(" ").map((w, i) => (
              <motion.span key={i} variants={word} aria-hidden="true" className="inline-block">
                {w}
              </motion.span>
            ))}
          </h1>
          {description && (
            <motion.p variants={fade} className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              {description}
            </motion.p>
          )}
          {actions && (
            <motion.div variants={fade} className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions}
            </motion.div>
          )}
        </motion.div>

        {chips && chips.length > 0 && (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.7 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {chips.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={fade}
                className="glass flex items-center gap-2 rounded-full py-2 pr-4 pl-2 text-sm font-medium"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sky">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </Container>
    </section>
  );
}
