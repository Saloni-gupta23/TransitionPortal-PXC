import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, FolderKanban, Plus, Calendar, AlertTriangle,
  FileBarChart, Presentation, Users, ScrollText, Settings,
  Bell, Search, ChevronsLeft, ChevronsRight, LogOut, ChevronDown,
} from "lucide-react";
import { PhoenixLogo } from "./PhoenixLogo";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL, type Role } from "@/data/mock";

interface NavItem { to: string; label: string; icon: typeof LayoutDashboard; roles?: Role[]; }

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/projects/new", label: "Create Transition", icon: Plus, roles: ["TRANSITION_OWNER", "SSC_HEAD"] },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/risks", label: "Risks & Issues", icon: AlertTriangle },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/ppt", label: "PowerPoint Preview", icon: Presentation },
  { to: "/users", label: "Users", icon: Users, roles: ["GLOBAL_BOARD", "SSC_HEAD"] },
  { to: "/audit", label: "Audit Logs", icon: ScrollText, roles: ["GLOBAL_BOARD", "SSC_HEAD"] },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout, switchRole } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const items = NAV.filter((n) => !n.roles || (user && n.roles.includes(user.role)));

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-all duration-200 md:flex ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && <PhoenixLogo />}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {items.map((it) => {
            const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-soft text-brand-deep"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-brand" : ""}`} />
                {!collapsed && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="border-t border-border p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">v1.0 · India SSC</div>
            <div>© Phoenix Contact</div>
          </div>
        )}
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
          <div className="md:hidden"><PhoenixLogo /></div>
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search projects, risks, users…"
              className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm outline-none ring-ring/30 focus:border-ring focus:ring-2"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Role switcher (demo) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <span className="hidden sm:inline">View as</span>
                <span className="text-brand-deep">{user ? ROLE_LABEL[user.role] : ""}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-elevated">
                  {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => { switchRole(r); setRoleMenuOpen(false); }}
                      className="block w-full rounded px-2.5 py-1.5 text-left text-xs hover:bg-muted"
                    >
                      {ROLE_LABEL[r]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
            </button>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-hero text-[11px] font-semibold text-brand-foreground">
                {user?.initials}
              </div>
              <div className="hidden text-xs leading-tight sm:block">
                <div className="font-medium">{user?.name}</div>
                <div className="text-muted-foreground">{user ? ROLE_LABEL[user.role] : ""}</div>
              </div>
              <button onClick={logout} className="ml-1 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Logout">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
