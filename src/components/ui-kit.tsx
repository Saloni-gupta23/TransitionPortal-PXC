import type { ReactNode } from "react";

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-xl border border-border bg-card shadow-card ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusDot({ status }: { status: "red" | "amber" | "green" | "white" | "go" | "milestone" }) {
  if (status === "go") return <span className="inline-block h-0 w-0 border-x-[6px] border-b-[10px] border-x-transparent border-b-foreground" aria-label="Go Live" />;
  if (status === "milestone") return <span className="inline-block h-0 w-0 border-x-[6px] border-b-[10px] border-x-transparent border-b-teal" aria-label="Milestone" />;
  const map: Record<string, string> = {
    red: "bg-rag-red", amber: "bg-rag-amber", green: "bg-rag-green",
    white: "bg-card border border-border",
  };
  return <span className={`inline-block h-3 w-3 rounded-full ${map[status]}`} />;
}

export function RagBadge({ rag }: { rag: "Red" | "Amber" | "Green" }) {
  const styles: Record<string, string> = {
    Red: "bg-rag-red/10 text-rag-red border-rag-red/30",
    Amber: "bg-rag-amber/15 text-yellow-700 border-rag-amber/40 dark:text-yellow-400",
    Green: "bg-rag-green/10 text-emerald-700 border-rag-green/30 dark:text-emerald-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles[rag]}`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${rag === "Red" ? "bg-rag-red" : rag === "Amber" ? "bg-rag-amber" : "bg-rag-green"}`} />
      {rag}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Yet to Start": "bg-muted text-muted-foreground border-border",
    "In Process": "bg-teal-soft text-teal-deep border-teal/30",
    "Hold": "bg-rag-amber/15 text-yellow-700 border-rag-amber/40 dark:text-yellow-400",
    "Cut Over": "bg-rag-green/10 text-emerald-700 border-rag-green/30 dark:text-emerald-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

export function KpiCard({ label, value, accent = "brand", hint }: { label: string; value: string | number; accent?: "brand" | "teal" | "danger" | "success" | "warning"; hint?: string }) {
  const accents: Record<string, string> = {
    brand: "from-brand to-brand-deep",
    teal: "from-teal to-teal-deep",
    danger: "from-rag-red to-rag-red",
    success: "from-rag-green to-emerald-600",
    warning: "from-rag-amber to-amber-500",
  };
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[accent]}`} />
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function Button({
  children, variant = "primary", size = "md", className = "", ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"; size?: "sm" | "md" | "lg" }) {
  const variants: Record<string, string> = {
    primary: "bg-brand text-brand-foreground hover:bg-brand-deep shadow-elevated",
    secondary: "bg-teal text-white hover:bg-teal-deep",
    outline: "border border-border bg-card hover:bg-muted",
    ghost: "hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
