import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useScrolled";
import { ROUTES } from "@/constant/routes";
import { mainNavLinks } from "@/data/navigation";
import { HeaderAuthLinks } from "@/features/auth/components/HeaderAuthLinks";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const navLinkClasses = (isActive: boolean) =>
  cn(
    "rounded-full px-3 py-2 text-sm font-semibold text-navy/80 transition-colors duration-200 hover:bg-navy/5 hover:text-navy",
    isActive && "bg-navy/8 text-navy",
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
          className="z-50 w-52 rounded-2xl border border-white/60 bg-white/95 p-1.5 shadow-soft-lg backdrop-blur-2xl"
        >
          {items.map((item) => (
            <DropdownMenu.Item key={item.href} asChild className="outline-none">
              <Link
                to={item.href}
                className={cn(
                  "block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-navy/5 hover:text-navy",
                  pathname === item.href && "bg-navy/8 text-navy",
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

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[72px] transition-all duration-300 md:h-20",
        scrolled
          ? "border-b border-border bg-surface/90 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-full items-center justify-between">
        <Link to={ROUTES.home} className="shrink-0" aria-label="GK India SolarTech home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
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

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 xl:flex">
            <HeaderAuthLinks variant="desktop" />
          </div>

          <Button asChild size="md" className="hidden xl:inline-flex">
            <Link to={ROUTES.solarEstimate}>Get Free Solar Estimate</Link>
          </Button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5 xl:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
