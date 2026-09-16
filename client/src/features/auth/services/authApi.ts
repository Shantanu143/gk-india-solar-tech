import { apiRequest, setAccessToken } from "@/services/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface SignupCustomerPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface EmployeeSetupPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Stores the new access token in memory as a side effect — every call below goes through this. */
function withStoredToken(request: Promise<AuthResponse>): Promise<AuthResponse> {
  return request.then((result) => {
    setAccessToken(result.accessToken);
    return result;
  });
}

export const authApi = {
  signupCustomer(payload: SignupCustomerPayload) {
    return withStoredToken(apiRequest<AuthResponse>("/auth/signup", { method: "POST", body: JSON.stringify(payload) }));
  },

  employeeSetupStatus() {
    return apiRequest<{ available: boolean }>("/auth/employee-signup/status");
  },

  employeeSetup(payload: EmployeeSetupPayload) {
    return withStoredToken(apiRequest<AuthResponse>("/auth/employee-signup", { method: "POST", body: JSON.stringify(payload) }));
  },

  login(payload: LoginPayload) {
    return withStoredToken(apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }));
  },

  /** Silent session restore — relies solely on the httpOnly refresh cookie, no body needed. */
  refresh() {
    return withStoredToken(apiRequest<AuthResponse>("/auth/refresh", { method: "POST" }));
  },

  async logout() {
    await apiRequest<void>("/auth/logout", { method: "POST" });
    setAccessToken(null);
  },

  me() {
    return apiRequest<{ user: AuthUser }>("/auth/me");
  },

  updateProfile(payload: { name?: string; phone?: string }) {
    return apiRequest<{ user: AuthUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiRequest<void>("/auth/change-password", { method: "POST", body: JSON.stringify(payload) });
  },
};
