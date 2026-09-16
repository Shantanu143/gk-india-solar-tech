import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/features/auth/hooks/authContext";
import { authApi, type EmployeeSetupPayload, type LoginPayload, type SignupCustomerPayload } from "@/features/auth/services/authApi";
import { setAccessToken } from "@/services/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";

/** Proactively refresh a bit before the 15-minute access token actually expires. */
const SILENT_REFRESH_INTERVAL_MS = 14 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authApi
      .refresh()
      .then((result) => {
        if (!cancelled) setUser(result.user);
      })
      .catch(() => {
        // No valid session cookie yet — a normal state for a first-time visitor.
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      authApi.refresh().then(
        (result) => setUser(result.user),
        () => setUser(null), // the session died server-side (revoked/expired) — sign the tab out
      );
    }, SILENT_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      isAuthenticated: user !== null,
      login: async (payload: LoginPayload) => {
        const result = await authApi.login(payload);
        setUser(result.user);
        return result.user;
      },
      signupCustomer: async (payload: SignupCustomerPayload) => {
        const result = await authApi.signupCustomer(payload);
        setUser(result.user);
        return result.user;
      },
      employeeSetup: async (payload: EmployeeSetupPayload) => {
        const result = await authApi.employeeSetup(payload);
        setUser(result.user);
        return result.user;
      },
      logout: async () => {
        await authApi.logout();
        setAccessToken(null);
        setUser(null);
      },
      updateProfile: async (payload: { name?: string; phone?: string }) => {
        const result = await authApi.updateProfile(payload);
        setUser(result.user);
        return result.user;
      },
      changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
        await authApi.changePassword(payload);
      },
    }),
    [user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
