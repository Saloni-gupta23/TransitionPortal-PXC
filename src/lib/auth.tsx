import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { USERS, type Role, type User } from "@/data/mock";

interface AuthCtx {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "pc.session.userId";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem(STORAGE_KEY);
    if (id) {
      const u = USERS.find((x) => x.id === id);
      if (u) setUser(u);
    }
  }, []);

  const login = (email: string) => {
    const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase()) ?? USERS[3];
    setUser(u);
    localStorage.setItem(STORAGE_KEY, u.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: Role) => {
    const u = USERS.find((x) => x.role === role);
    if (u) {
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
    }
  };

  return <Ctx.Provider value={{ user, login, logout, switchRole }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider missing");
  return v;
}

export function canEdit(role: Role | undefined): boolean {
  if (!role) return false;
  return ["TRANSITION_OWNER", "TRANSITION_SUPPORT", "TSSC_LEAD", "CSSC_LEAD", "ITSSC_LEAD", "SSC_HEAD"].includes(role);
}

export function visibleSSCFilter(role: Role | undefined): "ALL" | "TSSC" | "CSSC" | "ITSSC" {
  if (role === "TSSC_LEAD") return "TSSC";
  if (role === "CSSC_LEAD") return "CSSC";
  if (role === "ITSSC_LEAD") return "ITSSC";
  return "ALL";
}
