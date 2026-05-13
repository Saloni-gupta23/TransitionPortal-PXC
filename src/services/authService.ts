/**
 * services/authService.ts
 *
 * All auth-related API calls.
 * Called by lib/auth.tsx (replaces the current mock implementation).
 */

import { apiClient, setToken, clearToken } from "./apiClient";
import type { User } from "@/data/mock"; // reuse the User type until you migrate it

interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Sign in with email + password.
 * Stores the returned JWT in localStorage.
 */
export async function login(email: string, password: string): Promise<User> {
  const data = await apiClient.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });
  setToken(data.token);
  return data.user;
}

/**
 * Sign out — tells the server to audit the logout,
 * then wipes the local token.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout", {});
  } finally {
    clearToken();
  }
}

/**
 * Fetch the currently authenticated user's profile.
 * Useful on app boot to verify the token is still valid.
 */
export async function getMe(): Promise<User> {
  return apiClient.get<User>("/api/auth/me");
}

/**
 * Change password.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiClient.post("/api/auth/change-password", {
    currentPassword,
    newPassword,
  });
}
