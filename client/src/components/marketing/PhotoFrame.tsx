import { cn } from "@/lib/utils";

interface PhotoFrameProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

/** Rounded, lazy-loaded photograph used by the marketing sections. */
export function PhotoFrame({ src, alt, className, children }: PhotoFrameProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-soft-lg", className)}>
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      {children}
    </div>
  );
}
