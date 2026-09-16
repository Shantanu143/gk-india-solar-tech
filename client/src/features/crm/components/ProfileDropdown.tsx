import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constant/routes";
import { Avatar } from "@/features/crm/components/Avatar";
import { useAuth } from "@/features/crm/hooks/authContext";
import { CRM_ROUTES } from "@/features/crm/utils/routes";
import { USER_ROLE_LABEL } from "@/features/auth/types/auth";

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const settingsPath = user.role === "ADMIN" || user.role === "SALES_MANAGER" ? CRM_ROUTES.adminSettings : CRM_ROUTES.employeeSettings;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-transparent py-1 pr-2 pl-1 transition-colors hover:border-white/60 hover:bg-white/50"
        >
          <Avatar name={user.name} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold text-navy">{user.name}</span>
            <span className="block text-xs text-muted-foreground">{USER_ROLE_LABEL[user.role]}</span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-52 rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-soft-lg backdrop-blur-2xl"
        >
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none hover:bg-surface-muted"
            onSelect={() => navigate(settingsPath)}
          >
            <UserCircle className="h-4 w-4" aria-hidden="true" />
            My Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none hover:bg-surface-muted"
            onSelect={() => navigate(settingsPath)}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-error outline-none hover:bg-error/10"
            onSelect={() => {
              // Navigate away first so `ProtectedRoute` unmounts before `isAuthenticated` flips —
              // otherwise it briefly re-renders on this page and redirects to /login with
              // `state.from` pointing at it, which would carry over to whoever logs in next.
              navigate(ROUTES.login, { replace: true });
              void logout();
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
