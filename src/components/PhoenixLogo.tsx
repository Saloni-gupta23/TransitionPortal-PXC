import { Link } from "@tanstack/react-router";

export function PhoenixLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/dashboard" className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero shadow-elevated">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-foreground" fill="none">
          <path d="M4 20 L12 4 L20 20 L12 14 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight">Phoenix Contact</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Transition Portal</div>
      </div>
    </Link>
  );
}
