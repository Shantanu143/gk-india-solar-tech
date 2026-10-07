import type { ComponentType, SVGProps } from "react";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/BrandIcons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SOCIAL_LINKS, getWhatsAppLink } from "@/config/contact";
import type { SocialPlatform } from "@/config/contact";
import { cn } from "@/lib/utils";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface SocialItem {
  key: SocialPlatform | "whatsapp";
  label: string;
  href: string;
  Icon: Icon;
  /** Brand-coloured fill that fades in behind the glyph on hover. */
  brand: string;
}

const PLATFORM_STYLE: Record<SocialPlatform, { Icon: Icon; brand: string }> = {
  facebook: { Icon: FacebookIcon, brand: "bg-[#1877F2]" },
  instagram: {
    Icon: InstagramIcon,
    brand: "bg-[linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)]",
  },
  youtube: { Icon: YouTubeIcon, brand: "bg-[#FF0000]" },
};

function getSocialItems(): SocialItem[] {
  const items: SocialItem[] = SOCIAL_LINKS.map(({ platform, label, href }) => ({
    key: platform,
    label,
    href,
    ...PLATFORM_STYLE[platform],
  }));

  const whatsappHref = getWhatsAppLink("Hi GK India SolarTech, I'd like to know more about solar for my property.");
  if (whatsappHref) {
    items.push({ key: "whatsapp", label: "WhatsApp", href: whatsappHref, Icon: WhatsAppIcon as Icon, brand: "bg-[#25D366]" });
  }
  return items;
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {getSocialItems().map(({ key, label, href, Icon, brand }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GK India SolarTech on ${label}`}
            title={label}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:text-white hover:shadow-lg hover:shadow-black/30 focus-visible:-translate-y-1 focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                brand,
              )}
            />
            <Icon className="relative h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
