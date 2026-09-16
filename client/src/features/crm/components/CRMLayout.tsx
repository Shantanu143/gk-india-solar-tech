import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { CrmBackground } from "@/features/crm/components/CrmBackground";
import { Sidebar } from "@/features/crm/components/Sidebar";
import { Topbar } from "@/features/crm/components/Topbar";
import type { CrmNavEntry } from "@/features/crm/utils/navigation";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { setEmployeeCache } from "@/features/employees/utils/employeeCache";

interface CRMLayoutProps {
  navItems: CrmNavEntry[];
  badges?: Partial<Record<string, number>>;
  leadDetailPath: (leadId: string) => string;
  searchTargetPath: string;
}

function currentPageTitle(pathname: string, navItems: CrmNavEntry[]): string {
  const links = navItems.flatMap((entry) => (entry.type === "group" ? entry.items : [entry]));
  const match = [...links].sort((a, b) => b.href.length - a.href.length).find((item) => pathname.startsWith(item.href));
  return match?.label ?? "Dashboard";
}

export function CRMLayout({ navItems, badges, leadDetailPath, searchTargetPath }: CRMLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: employees } = useEmployees();
  useEffect(() => {
    if (employees) setEmployeeCache(employees);
  }, [employees]);

  // Close the mobile drawer whenever the route changes — adjusted during render (React's
  // recommended pattern) rather than in an effect, which would cause an extra commit.
  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setMobileOpen(false);
  }

  return (
    <div className="flex min-h-dvh">
      <CrmBackground />
      <Sidebar
        items={navItems}
        badges={badges}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={currentPageTitle(location.pathname, navItems)}
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSearch={(value) => {
            if (value.trim()) navigate(`${searchTargetPath}?q=${encodeURIComponent(value.trim())}`);
          }}
          leadDetailPath={leadDetailPath}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-orange" aria-hidden="true" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
