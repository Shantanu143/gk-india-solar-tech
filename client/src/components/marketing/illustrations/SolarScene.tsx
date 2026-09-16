import { motion } from "framer-motion";

export type SolarSceneVariant = "hero" | "residential" | "commercial" | "industrial";

interface SolarSceneProps {
  variant: SolarSceneVariant;
  className?: string;
}

/**
 * Original geometric illustration standing in for real site photography, which isn't available
 * yet. Swap for photos of actual GK India SolarTech installations as they become available —
 * this keeps a consistent, on-brand visual language until then.
 */
export function SolarScene({ variant, className }: SolarSceneProps) {
  return (
    <svg
      viewBox="0 0 600 460"
      className={className}
      role="img"
      aria-label={sceneLabel[variant]}
    >
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef4ff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <radialGradient id={`sun-${variant}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffb347" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fd8002" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`panel-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a2a63" />
          <stop offset="100%" stopColor="#00163f" />
        </linearGradient>
      </defs>

      <rect width="600" height="460" rx="28" fill={`url(#sky-${variant})`} />

      <motion.circle
        cx="472"
        cy="96"
        r="120"
        fill={`url(#sun-${variant})`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="472" cy="96" r="34" fill="#fd8002" />

      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={120 + i * 60}
          cy={90 + i * 24}
          r={4 - i * 0.6}
          fill="#16a34a"
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}

      <SceneGround variant={variant} gradientId={`panel-${variant}`} />
    </svg>
  );
}

const sceneLabel: Record<SolarSceneVariant, string> = {
  hero: "Illustration of a rooftop solar installation under a bright sky",
  residential: "Illustration of solar panels installed on a home rooftop",
  commercial: "Illustration of solar panels installed on a commercial building roof",
  industrial: "Illustration of a large-scale solar panel array at an industrial facility",
};

function PanelGrid({
  x,
  y,
  cols,
  rows,
  cell = 34,
  tilt = -6,
  gradientId,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  cell?: number;
  tilt?: number;
  gradientId: string;
}) {
  const panels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      panels.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * (cell + 3)}
          y={y + r * (cell * 0.62 + 3)}
          width={cell}
          height={cell * 0.6}
          rx={2}
          fill={`url(#${gradientId})`}
          stroke="#025d18"
          strokeOpacity={0.25}
          strokeWidth={1}
        />,
      );
    }
  }
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`} fillOpacity={0.95}>
      {panels}
    </g>
  );
}

function SceneGround({ variant, gradientId }: { variant: SolarSceneVariant; gradientId: string }) {
  if (variant === "industrial") {
    return (
      <g>
        <rect x="40" y="300" width="520" height="120" rx="10" fill="#00163f" />
        <rect x="40" y="300" width="520" height="14" fill="#0a2a63" />
        <PanelGrid x={80} y={230} cols={7} rows={2} cell={40} tilt={-3} gradientId={gradientId} />
        <rect x="480" y="230" width="16" height="90" fill="#0a2a63" />
      </g>
    );
  }

  if (variant === "commercial") {
    return (
      <g>
        <rect x="90" y="260" width="420" height="160" rx="8" fill="#00163f" />
        <rect x="90" y="260" width="420" height="16" fill="#0a2a63" />
        <PanelGrid x={130} y={200} cols={6} rows={2} cell={36} tilt={-4} gradientId={gradientId} />
        {Array.from({ length: 4 }).map((_, i) => (
          <rect key={i} x={140 + i * 90} y={300} width={50} height={70} fill="#f8fafc" fillOpacity={0.15} rx={4} />
        ))}
      </g>
    );
  }

  if (variant === "residential") {
    return (
      <g>
        <rect x="150" y="290" width="300" height="130" rx="6" fill="#00163f" />
        <polygon points="140,290 300,210 460,290" fill="#0a2a63" />
        <PanelGrid x={190} y={230} cols={4} rows={2} cell={32} tilt={-14} gradientId={gradientId} />
        <rect x="270" y="340" width="60" height="80" rx="4" fill="#f8fafc" fillOpacity={0.2} />
      </g>
    );
  }

  return (
    <g>
      <rect x="60" y="300" width="480" height="130" rx="10" fill="#00163f" />
      <polygon points="60,300 300,190 540,300" fill="#0a2a63" />
      <PanelGrid x={140} y={225} cols={6} rows={2} cell={34} tilt={-10} gradientId={gradientId} />
    </g>
  );
}
