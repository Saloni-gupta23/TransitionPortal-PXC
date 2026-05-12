import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Welcome,
});

const GREETINGS = ["Hello", "Willkommen", "Namaste", "Bonjour", "Hola", "Ciao", "こんにちは"];

function Welcome() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const seen = typeof window !== "undefined" && sessionStorage.getItem("pc.welcomed");
    const total = seen ? 1600 : 3600;
    const per = total / GREETINGS.length;
    const t = setInterval(() => setI((x) => (x + 1) % GREETINGS.length), per);
    const done = setTimeout(() => {
      sessionStorage.setItem("pc.welcomed", "1");
      navigate({ to: user ? "/dashboard" : "/login" });
    }, total);
    return () => { clearInterval(t); clearTimeout(done); };
  }, [navigate, user]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative flex h-32 items-center justify-center">
        <span key={i} className="animate-greet bg-gradient-hero bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-8xl">
          {GREETINGS[i]}
        </span>
      </div>
      <div className="mt-12 h-[2px] w-64 origin-left animate-line bg-brand md:w-96" />
      <div className="mt-10 flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
            <path d="M4 20 L12 4 L20 20 L12 14 Z" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-slate-900">Phoenix Contact</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Transition Portal</div>
        </div>
      </div>
    </div>
  );
}
