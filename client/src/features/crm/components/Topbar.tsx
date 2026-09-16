import { Menu } from "lucide-react";
import { NotificationDropdown } from "@/features/crm/components/NotificationDropdown";
import { ProfileDropdown } from "@/features/crm/components/ProfileDropdown";
import { SearchInput } from "@/features/crm/components/SearchInput";

interface TopbarProps {
  title: string;
  onMobileMenuOpen: () => void;
  onSearch?: (value: string) => void;
  searchValue?: string;
  leadDetailPath: (leadId: string) => string;
}

export function Topbar({ title, onMobileMenuOpen, onSearch, searchValue, leadDetailPath }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 mx-3 mt-3 flex h-16 items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/55 px-4 shadow-[0_8px_32px_-8px_rgba(0,22,63,0.1)] backdrop-blur-xl sm:px-5">
      {/* Left: menu + title, allowed to shrink so the right cluster never gets pushed off */}
      <div className="flex min-w-0 shrink items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMobileMenuOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-navy hover:bg-navy/5 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="hidden shrink-0 text-lg font-bold text-navy sm:block">{title}</h2>
      </div>

      {/* Middle: search, flexible but capped */}
      {onSearch && (
        <SearchInput
          value={searchValue ?? ""}
          onChange={onSearch}
          placeholder="Search by name, mobile, email or Lead ID…"
          className="hidden min-w-0 flex-1 sm:block sm:max-w-sm"
        />
      )}

      {/* Right: notifications + profile, always pinned to the far corner */}
      <div className="flex shrink-0 items-center gap-1.5">
        <NotificationDropdown leadDetailPath={leadDetailPath} />
        <ProfileDropdown />
      </div>
    </header>
  );
}
