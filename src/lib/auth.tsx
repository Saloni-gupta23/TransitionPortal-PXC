/**
 * lib/auth.tsx
 *
 * Drop-in replacement for the mock auth.
 * Now calls the real backend via authService.
 *
 * What changed vs the mock version:
 *  - login() now takes email + password and hits /api/auth/login
 *  - logout() calls /api/auth/logout then clears the token
 *  - On mount, verifies the stored token is still valid via /api/auth/me
 *  - switchRole() is REMOVED — not for production
 *  - canEdit() and visibleSSCFilter() remain unchanged
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as authService from "@/services/authService";
import { getToken } from "@/services/apiClient";
import type { Role, User } from "@/data/mock";

interface AuthCtx {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: if a token exists, verify it and restore the session
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .getMe()
      .then((u) => setUser(u))
      .catch(() => {
        // Token invalid or expired — let the apiClient's 401 handler redirect
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}

export function canEdit(role: Role | undefined): boolean {
  if (!role) return false;
  return [
    "TRANSITION_OWNER",
    "TRANSITION_SUPPORT",
    "TSSC_LEAD",
    "CSSC_LEAD",
    "ITSSC_LEAD",
    "SSC_HEAD",
  ].includes(role);
}

export function visibleSSCFilter(
  role: Role | undefined
): "ALL" | "TSSC" | "CSSC" | "ITSSC" {
  if (role === "TSSC_LEAD") return "TSSC";
  if (role === "CSSC_LEAD") return "CSSC";
  if (role === "ITSSC_LEAD") return "ITSSC";
  return "ALL";
}
