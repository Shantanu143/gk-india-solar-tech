import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import type { CrmNavEntry, CrmNavLink } from "@/features/crm/utils/navigation";

interface SidebarProps {
  items: CrmNavEntry[];
  badges?: Partial<Record<string, number>>;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function NavLinkRow({ item, badges, collapsed }: { item: CrmNavLink; badges?: Partial<Record<string, number>>; collapsed: boolean }) {
  const badgeValue = item.badgeKey ? badges?.[item.badgeKey] : undefined;
  return (
    <NavLink
      to={item.href}
      end={item.href.endsWith("dashboard")}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white",
          isActive && "border-orange/30 bg-orange/20 text-white shadow-[0_0_0_1px_rgba(253,128,2,0.15)] backdrop-blur-sm",
          collapsed && "justify-center px-2",
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {!!badgeValue && (
            <span className="rounded-full bg-orange px-1.5 py-0.5 text-[10px] font-bold text-white">{badgeValue}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

function NavGroupRow({
  label,
  icon: Icon,
  items,
  badges,
}: {
  label: string;
  icon: CrmNavLink["icon"];
  items: CrmNavLink[];
  badges?: Partial<Record<string, number>>;
}) {
  const { pathname } = useLocation();
  const containsActive = items.some((item) => pathname.startsWith(item.href));
  const [open, setOpen] = useState(containsActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/10 hover:text-white",
          containsActive && !open && "text-white",
        )}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
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
            <div className="flex flex-col gap-0.5 py-0.5 pl-4">
              {items.map((item) => (
                <NavLinkRow key={item.href} item={item} badges={badges} collapsed={false} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLinks({ items, badges, collapsed }: { items: CrmNavEntry[]; badges?: Partial<Record<string, number>>; collapsed: boolean }) {
  // A collapsed icon-only rail has no room for nested groups — flatten everything to single icons.
  const flat = collapsed ? items.flatMap((entry) => (entry.type === "group" ? entry.items : [entry])) : items;

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-2" aria-label="CRM">
      {flat.map((entry) =>
        entry.type === "group" ? (
          <NavGroupRow key={entry.label} label={entry.label} icon={entry.icon} items={entry.items} badges={badges} />
        ) : (
          <NavLinkRow key={entry.href} item={entry} badges={badges} collapsed={collapsed} />
        ),
      )}
    </nav>
  );
}

export function Sidebar({ items, badges, collapsed, onToggleCollapsed, mobileOpen, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      {/* Desktop rail — a floating glass panel over the gradient backdrop */}
      <aside
        className={cn(
          "sticky top-3 hidden h-[calc(100dvh-1.5rem)] shrink-0 flex-col rounded-2xl border border-white/10 bg-navy-dark/75 shadow-soft-lg backdrop-blur-2xl transition-[width] duration-200 lg:ml-3 lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center border-b border-white/10 px-4", collapsed && "justify-center px-0")}>
          {!collapsed && <Logo variant="light" />}
        </div>
        <SidebarLinks items={items} badges={badges} collapsed={collapsed} />
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex shrink-0 items-center gap-2 rounded-b-2xl border-t border-white/10 px-4 py-3 text-xs font-medium text-white/60 hover:text-white"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-navy-dark/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onMobileOpenChange(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-navy-dark/85 backdrop-blur-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Logo variant="light" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => onMobileOpenChange(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarLinks items={items} badges={badges} collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
