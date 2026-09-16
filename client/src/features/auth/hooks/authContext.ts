import { createContext, useContext } from "react";
import type { AuthUser } from "@/features/auth/types/auth";
import type { EmployeeSetupPayload, LoginPayload, SignupCustomerPayload } from "@/features/auth/services/authApi";

export interface AuthContextValue {
  user: AuthUser | null;
  /** True only while the initial silent session-restore (via the refresh cookie) is in flight. */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  signupCustomer: (payload: SignupCustomerPayload) => Promise<AuthUser>;
  employeeSetup: (payload: EmployeeSetupPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  updateProfile: (payload: { name?: string; phone?: string }) => Promise<AuthUser>;
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within features/auth's AuthProvider.");
  return ctx;
}
