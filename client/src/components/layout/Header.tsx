import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMPANY_PHONE_NUMBERS } from "@/config/contact";
import { useScrolled } from "@/hooks/useScrolled";
import { ROUTES } from "@/constant/routes";
import { mainNavLinks } from "@/data/navigation";
import { HeaderAuthLinks } from "@/features/auth/components/HeaderAuthLinks";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const navLinkClasses = (isActive: boolean) =>
  cn(
    "rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white",
    isActive && "bg-white/15 text-white",
  );

function SolutionsDropdown({ items }: { items: { label: string; href: string }[] }) {
  const { pathname } = useLocation();
  const containsActive = items.some((item) => pathname === item.href);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className={cn(navLinkClasses(containsActive), "flex items-center gap-1")}>
          Solutions
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          className="z-50 w-52 rounded-2xl border border-white/20 bg-sky-deep/90 p-1.5 shadow-soft-lg backdrop-blur-2xl"
        >
          {items.map((item) => (
            <DropdownMenu.Item key={item.href} asChild className="outline-none">
              <Link
                to={item.href}
                className={cn(
                  "block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white",
                  pathname === item.href && "bg-white/15 text-white",
                )}
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function Header() {
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const phone = COMPANY_PHONE_NUMBERS.find((p) => p.whatsapp) ?? COMPANY_PHONE_NUMBERS[0];

  return (
    <header
      className="sticky top-3 z-40 -mb-[76px] px-3 sm:-mb-[84px] sm:px-5 lg:px-8"
    >
      <div
        className={cn(
          "glass-blue mx-auto flex h-[64px] w-full max-w-[1280px] items-center justify-between rounded-full pr-2 pl-5 text-white transition-shadow duration-300 sm:h-[72px] sm:pl-7",
          scrolled ? "shadow-soft-lg" : "shadow-none",
        )}
      >
        <Link to={ROUTES.home} className="shrink-0" aria-label="GK India SolarTech home">
          <Logo variant="light" />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {mainNavLinks.map((entry) =>
            entry.type === "dropdown" ? (
              <SolutionsDropdown key={entry.label} items={entry.items} />
            ) : (
              <NavLink key={entry.href} to={entry.href} className={({ isActive }) => navLinkClasses(isActive)}>
                {entry.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 xl:flex [&_button]:text-white [&_button]:hover:text-white/80">
            <HeaderAuthLinks variant="desktop" />
          </div>

          <Button asChild variant="white" size="md" className="hidden h-12 px-6 xl:inline-flex">
            <a href={phone.href}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call us: {phone.display}
            </a>
          </Button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
