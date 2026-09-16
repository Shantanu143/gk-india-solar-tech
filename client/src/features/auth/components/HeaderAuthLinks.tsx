import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LayoutDashboard, LogIn, LogOut, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constant/routes";
import { Avatar } from "@/features/crm/components/Avatar";
import { useAuth } from "@/features/auth/hooks/authContext";
import { USER_ROLE_LABEL } from "@/features/auth/types/auth";
import { dashboardPathForRole } from "@/features/auth/utils/roleRedirect";

interface HeaderAuthLinksProps {
  /** "desktop" renders a compact inline account menu; "mobile" renders full-width stacked buttons. */
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function HeaderAuthLinks({ variant, onNavigate }: HeaderAuthLinksProps) {
  const { user, isInitializing, logout } = useAuth();
  const navigate = useNavigate();

  // Avoid a flash of "Log In / Sign Up" before the silent session-restore resolves.
  if (isInitializing) return null;

  function handleLogout() {
    void logout().then(() => {
      onNavigate?.();
      navigate(ROUTES.home);
    });
  }

  if (variant === "mobile") {
    if (!user) {
      return (
        <div className="flex flex-col gap-3">
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link to={ROUTES.login} onClick={onNavigate}>
              Log In
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link to={ROUTES.signup} onClick={onNavigate}>
              Sign Up
            </Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{user.name}</p>
            <p className="text-xs text-muted-foreground">{USER_ROLE_LABEL[user.role]}</p>
          </div>
        </div>
        {user.role !== "CUSTOMER" && (
          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link to={dashboardPathForRole(user.role)} onClick={onNavigate}>
              Go to Dashboard
            </Link>
          </Button>
        )}
        <Button asChild variant="secondary" size="lg" className="w-full">
          <Link to={ROUTES.account} onClick={onNavigate}>
            My Account
          </Link>
        </Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="tertiary" className="gap-1">
            Log In / Sign Up
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={10}
            className="z-50 w-48 rounded-2xl border border-border bg-surface p-1.5 shadow-soft-lg"
          >
            <DropdownMenu.Item asChild className="outline-none">
              <Link
                to={ROUTES.login}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-surface-muted"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Log In
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="outline-none">
              <Link
                to={ROUTES.signup}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-surface-muted"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Sign Up
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-transparent py-1 pr-2.5 pl-1 transition-colors hover:border-border hover:bg-navy/5"
        >
          <Avatar name={user.name} size="sm" />
          <span className="hidden text-sm font-semibold text-navy sm:block">{user.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-52 rounded-2xl border border-border bg-surface p-1.5 shadow-soft-lg"
        >
          {user.role !== "CUSTOMER" && (
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none hover:bg-surface-muted"
              onSelect={() => navigate(dashboardPathForRole(user.role))}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 outline-none hover:bg-surface-muted"
            onSelect={() => navigate(ROUTES.account)}
          >
            <User className="h-4 w-4" aria-hidden="true" />
            My Account
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-error outline-none hover:bg-error/10"
            onSelect={handleLogout}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
