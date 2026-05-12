import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui-kit";
import { USERS } from "@/data/mock";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(USERS[3].email);
  const [pw, setPw] = useState("••••••••");
  const [show, setShow] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-elevated">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor"><path d="M4 20 L12 4 L20 20 L12 14 Z" /></svg>
            </div>
            <div>
              <div className="text-sm font-bold">Phoenix Contact</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Transition Portal</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access the SSC India transition control center.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                placeholder="name@phoenixcontact.com"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium">Password</label>
                <a className="text-xs text-brand-deep hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-card px-3 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" defaultChecked />
              <span>Remember me on this device</span>
            </label>
            <Button type="submit" size="lg" className="w-full">Sign in</Button>
            <div className="relative my-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="bg-background px-2 relative z-10">or</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            </div>
            <Button type="button" variant="outline" size="lg" className="w-full">
              <ShieldCheck className="h-4 w-4" /> Continue with Single Sign-On
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            Internal use only · Phoenix Contact India SSC
          </p>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="relative hidden overflow-hidden bg-gradient-hero md:block">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px, 48px 48px" }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-90">Transition Portal</div>
          <div>
            <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
              From Excel trackers to a precision control center.
            </h2>
            <p className="mt-4 max-w-md text-sm opacity-90">
              Govern, monitor and report every SSC India transition — from strategic planning through hypercare — in one secure, executive-ready platform.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-xs">
              {[
                ["18", "Active projects"],
                ["30", "Total FTE"],
                ["5", "DOI stages"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur">
                  <div className="text-2xl font-bold">{v}</div>
                  <div className="opacity-80">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] opacity-75">© Phoenix Contact India · Confidential</div>
        </div>
      </div>
    </div>
  );
}
