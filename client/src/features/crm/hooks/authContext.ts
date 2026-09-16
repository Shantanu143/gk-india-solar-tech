import { useAuth as useRealAuth } from "@/features/auth/hooks/authContext";
import type { AuthUser } from "@/features/auth/types/auth";
import { can as canForRole, type Permission } from "@/features/crm/types/permissions";

/**
 * The CRM's `useAuth()` — a thin adapter over the real, backend-authenticated session
 * (`features/auth/hooks/authContext.ts`), reshaped to the `{ user, can, logout }` surface every CRM
 * component already expects. There used to be a second, parallel, localStorage-only mock auth system
 * here; it has been removed in favor of this adapter, so no CRM component needed to change.
 */
export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  can: (permission: Permission) => boolean;
  logout: () => Promise<void>;
}

export function useAuth(): AuthContextValue {
  const { user, isAuthenticated, isInitializing, logout } = useRealAuth();
  return {
    user,
    isAuthenticated,
    isInitializing,
    can: (permission) => (user ? canForRole(user.role, permission) : false),
    logout,
  };
}
