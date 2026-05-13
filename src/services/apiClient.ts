/**
 * services/apiClient.ts
 *
 * Base fetch wrapper used by all service files.
 * - Automatically attaches the JWT token from localStorage
 * - Handles 401 → redirect to /login
 * - Returns parsed JSON or throws a typed ApiError
 */

import CONFIG from "@/config/config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const TOKEN_KEY = "pc.auth.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

  let response: Response;
  try {
    response = await fetch(`${CONFIG.API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw new ApiError("Network error — is the server running?", 0);
  } finally {
    clearTimeout(timeoutId);
  }

  // Session expired — redirect to login
  if (response.status === 401) {
    clearToken();
    window.location.replace("/login");
    throw new ApiError("Session expired", 401);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong", response.status);
  }

  return data.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
