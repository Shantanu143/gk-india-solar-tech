/**
 * Thin fetch wrapper. Most of the app's mock services never call this — they short-circuit to
 * mock data and just document the future `apiRequest(...)` call in a TODO comment. The `features/auth`
 * module is the first real consumer, talking to the actual server/ backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

let accessToken: string | null = null;

/** In-memory only — never localStorage — so a short-lived access token can't be read out via XSS. */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include", // sends/receives the httpOnly refresh-token cookie
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = (body && typeof body === "object" && "message" in body ? String(body.message) : null) ?? `Request to ${path} failed with status ${res.status}`;
    throw new ApiError(message, res.status, body && typeof body === "object" && "details" in body ? body.details : undefined);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Simulates network latency for mock service calls so loading states are realistic in the UI. */
export function mockDelay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** For endpoints that return a binary body (e.g. a generated PDF) — `apiRequest` always parses JSON. */
export async function apiRequestBlob(path: string, init?: RequestInit): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = (body && typeof body === "object" && "message" in body ? String(body.message) : null) ?? `Request to ${path} failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }
  return res.blob();
}
