// /**
//  * lib/auth.tsx
//  *
//  * Drop-in replacement for the mock auth.
//  * Now calls the real backend via authService.
//  *
//  * What changed vs the mock version:
//  *  - login() now takes email + password and hits /api/auth/login
//  *  - logout() calls /api/auth/logout then clears the token
//  *  - On mount, verifies the stored token is still valid via /api/auth/me
//  *  - switchRole() is REMOVED — not for production
//  *  - canEdit() and visibleSSCFilter() remain unchanged
//  */

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";
// import * as authService from "@/services/authService";
// import { getToken } from "@/services/apiClient";
// import type { Role, User } from "@/data/mock";

// interface AuthCtx {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const Ctx = createContext<AuthCtx | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // On mount: if a token exists, verify it and restore the session
//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       setIsLoading(false);
//       return;
//     }

//     authService
//       .getMe()
//       .then((u) => setUser(u))
//       .catch(() => {
//         // Token invalid or expired — let the apiClient's 401 handler redirect
//         setUser(null);
//       })
//       .finally(() => setIsLoading(false));
//   }, []);

//   const login = async (email: string, password: string) => {
//     const u = await authService.login(email, password);
//     setUser(u);
//   };

//   const logout = async () => {
//     await authService.logout();
//     setUser(null);
//   };

//   return (
//     <Ctx.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </Ctx.Provider>
//   );
// }

// export function useAuth() {
//   const v = useContext(Ctx);
//   if (!v) throw new Error("useAuth must be used inside AuthProvider");
//   return v;
// }

// export function canEdit(role: Role | undefined): boolean {
//   if (!role) return false;
//   return [
//     "TRANSITION_OWNER",
//     "TRANSITION_SUPPORT",
//     "TSSC_LEAD",
//     "CSSC_LEAD",
//     "ITSSC_LEAD",
//     "SSC_HEAD",
//   ].includes(role);
// }

// export function visibleSSCFilter(
//   role: Role | undefined
// ): "ALL" | "TSSC" | "CSSC" | "ITSSC" {
//   if (role === "TSSC_LEAD") return "TSSC";
//   if (role === "CSSC_LEAD") return "CSSC";
//   if (role === "ITSSC_LEAD") return "ITSSC";
//   return "ALL";
// }

//! (without api)

/**
 * lib/auth.tsx
 *
 * 100% mock auth — no API calls.
 * Supports role switching via the "View as" dropdown in AppLayout.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { USERS, type User, type Role } from "@/data/mock";

const SESSION_KEY = "pc.session.userId";

/* ─── Role helpers ───────────────────────────────────────────────────────── */

/** Roles that can edit DOI stages / create projects */
const EDIT_ROLES: Role[] = [
  "GLOBAL_BOARD",
  "SSC_HEAD",
  "TRANSITION_OWNER",
  "TRANSITION_SUPPORT",
  "TSSC_LEAD",
  "CSSC_LEAD",
  "ITSSC_LEAD",
];

export function canEdit(role?: Role): boolean {
  if (!role) return false;
  return EDIT_ROLES.includes(role);
}

/** Which SSC types a role can see. "ALL" = no filter. */
export function visibleSSCFilter(
  role?: Role
): "ALL" | "TSSC" | "CSSC" | "ITSSC" {
  if (!role) return "ALL";
  if (role === "TSSC_LEAD") return "TSSC";
  if (role === "CSSC_LEAD") return "CSSC";
  if (role === "ITSSC_LEAD") return "ITSSC";
  return "ALL";
}

/* ─── Context ────────────────────────────────────────────────────────────── */

interface AuthContextValue {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  /* Rehydrate from localStorage on mount */
  useEffect(() => {
    const id = localStorage.getItem(SESSION_KEY);
    if (id) {
      const found = USERS.find((u) => u.id === id) ?? USERS[3]; // default: Anis Mohanty
      setUser(found);
    }
  }, []);

  /** Log in by matching email — falls back to first user if not found */
  const login = (email: string) => {
    const found = USERS.find((u) => u.email === email) ?? USERS[3];
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
  };

  /** Clear session */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  /**
   * Switch the active role for demo purposes.
   * Finds the first user with that role; if none exists, mutates a
   * clone of the current user so the UI always has a valid user object.
   */
  const switchRole = (role: Role) => {
    const match = USERS.find((u) => u.role === role);
    if (match) {
      setUser(match);
      localStorage.setItem(SESSION_KEY, match.id);
    } else if (user) {
      // Role exists in ROLE_LABEL but has no user — synthesise one
      const synthetic: User = { ...user, role };
      setUser(synthetic);
      // Keep the same session id so _app.tsx guard stays happy
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
