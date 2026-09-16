import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import { mainNavLinks, type NavLink as NavLinkData } from "@/data/navigation";
import { HeaderAuthLinks } from "@/features/auth/components/HeaderAuthLinks";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MobileSolutionsGroup({ items, onNavigate }: { items: NavLinkData[]; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(items.some((item) => pathname === item.href));

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-base font-semibold text-navy"
      >
        Solutions
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pb-2 pl-4">
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onNavigate}
                  className={({ isActive }) => cn("py-2.5 text-sm font-medium", isActive ? "text-orange" : "text-navy/80")}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-navy-dark/40 backdrop-blur-[2px] xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-x-0 top-0 z-50 max-h-[100dvh] overflow-y-auto rounded-b-2xl bg-surface p-6 shadow-soft-lg xl:hidden"
                initial={{ y: "-100%", opacity: 0.6 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0.6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Browse GK India SolarTech pages and start a free solar estimate.
                </Dialog.Description>

                <div className="flex items-center justify-between">
                  <Link to={ROUTES.home} onClick={() => onOpenChange(false)}>
                    <Logo />
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-navy/5"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="mt-6 flex flex-col" aria-label="Mobile">
                  {mainNavLinks.map((entry) =>
                    entry.type === "dropdown" ? (
                      <MobileSolutionsGroup key={entry.label} items={entry.items} onNavigate={() => onOpenChange(false)} />
                    ) : (
                      <NavLink
                        key={entry.href}
                        to={entry.href}
                        onClick={() => onOpenChange(false)}
                        className={({ isActive }) =>
                          `border-b border-border py-4 text-base font-semibold ${isActive ? "text-orange" : "text-navy"}`
                        }
                      >
                        {entry.label}
                      </NavLink>
                    ),
                  )}
                </nav>

                <div className="mt-6 flex flex-col gap-3">
                  <Button asChild size="lg" className="w-full">
                    <Link to={ROUTES.solarEstimate} onClick={() => onOpenChange(false)}>
                      Get Free Solar Estimate
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <HeaderAuthLinks variant="mobile" onNavigate={() => onOpenChange(false)} />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
