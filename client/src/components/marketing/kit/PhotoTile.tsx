import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoTileProps {
  image: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
  className?: string;
}

/** Photo card with a bottom gradient, zoom-on-hover image and a description that lifts into view. */
export function PhotoTile({ image, title, description, icon: Icon, href, className }: PhotoTileProps) {
  const body = (
    <>
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/tile:scale-110"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sky-deep/95 via-sky-deep/40 to-transparent" />
      {Icon && (
        <span className="glass-blue absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-full text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      {href && (
        <span className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky opacity-0 transition-all duration-300 group-hover/tile:opacity-100">
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-serif text-2xl font-medium text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85 [@media(hover:hover)]:max-h-0 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-all [@media(hover:hover)]:duration-500 [@media(hover:hover)]:group-hover/tile:max-h-32 [@media(hover:hover)]:group-hover/tile:translate-y-0 [@media(hover:hover)]:group-hover/tile:opacity-100">
          {description}
        </p>
      </div>
    </>
  );
  const cls = cn(
    "group/tile relative block min-h-[22rem] overflow-hidden rounded-[2rem] shadow-soft transition-shadow duration-300 hover:shadow-soft-lg",
    className,
  );
  return href ? (
    <Link to={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
