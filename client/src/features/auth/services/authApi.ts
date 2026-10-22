import { apiRequest, ApiError, setAccessToken } from "@/services/apiClient";
import type { AuthUser } from "@/features/auth/types/auth";

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
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

const REFRESH_TOKEN_STORAGE_KEY = "gk_refresh_token";

export function getStoredRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredRefreshToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore restricted/private browsing storage errors
  }
}

/** Stores the new access token in memory and refresh token in local storage as a side effect. */
function withStoredToken(request: Promise<AuthResponse>): Promise<AuthResponse> {
  return request.then((result) => {
    setAccessToken(result.accessToken);
    if (result.refreshToken) {
      setStoredRefreshToken(result.refreshToken);
    }
    return result;
  });
}

/**
 * Refresh tokens are single-use (the server revokes-and-rotates on every call), so two refresh
 * requests firing close together — e.g. React StrictMode mounting `AuthProvider` twice in dev —
 * would race: whichever reaches the server second finds the cookie's token already revoked by the
 * first and fails, signing the user out even though their session was fine. Sharing one in-flight
 * promise means a second caller just waits for the first call's result instead of firing its own.
 */
let inFlightRefresh: Promise<AuthResponse> | null = null;

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

  /** Silent session restore — uses httpOnly cookie + local storage token fallback if 3rd-party cookies are blocked. */
  refresh() {
    if (!inFlightRefresh) {
      const stored = getStoredRefreshToken();
      inFlightRefresh = withStoredToken(
        apiRequest<AuthResponse>("/auth/refresh", {
          method: "POST",
          body: JSON.stringify(stored ? { refreshToken: stored } : {}),
          headers: stored ? { "x-refresh-token": stored } : {},
        }),
      )
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) {
            setStoredRefreshToken(null);
          }
          throw err;
        })
        .finally(() => {
          inFlightRefresh = null;
        });
    }
    return inFlightRefresh;
  },

  async logout() {
    const stored = getStoredRefreshToken();
    try {
      await apiRequest<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(stored ? { refreshToken: stored } : {}),
        headers: stored ? { "x-refresh-token": stored } : {},
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredRefreshToken(null);
      setAccessToken(null);
    }
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
