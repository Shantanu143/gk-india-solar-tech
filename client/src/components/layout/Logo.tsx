import logoImage from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "default" for light/white backgrounds, "light" for dark navy backgrounds (e.g. the footer). */
  variant?: "default" | "light";
  showTagline?: boolean;
  className?: string;
}

/**
 * The supplied logo is a detailed circular badge — legible as a mark at small sizes, but its
 * baked-in wordmark and tagline aren't readable until it's shown quite large. So the compact
 * header/footer lockup pairs the untouched badge image with a separately set text wordmark,
 * rather than resizing the image alone. The badge artwork itself is never altered.
 */
export function Logo({ variant = "default", showTagline = false, className }: LogoProps) {
  const isLight = variant === "light";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src={logoImage} alt="GK India SolarTech" className="h-9 w-9 shrink-0 object-contain" />
      <span className="flex flex-col leading-none">
        <span className={cn("text-[1.05rem] font-extrabold tracking-tight", isLight ? "text-white" : "text-navy")}>
          GK India <span className="text-orange">SolarTech</span>
        </span>
        {showTagline && (
          <span className={cn("mt-1 text-xs font-medium", isLight ? "text-white/60" : "text-muted-foreground")}>
            Powering Your Future, Today.
          </span>
        )}
      </span>
    </span>
  );
}
