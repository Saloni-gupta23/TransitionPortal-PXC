import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS } from "@/data/mock";
import { Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarView,
});

function CalendarView() {
  // Build event list
  const events = PROJECTS.flatMap((p) => [
    { date: p.plannedStart, label: `${p.id} · Planned Start`, kind: "start" as const, project: p.serviceArea },
    { date: p.cutoverDate, label: `${p.id} · Cutover`, kind: "cutover" as const, project: p.serviceArea },
    { date: p.hypercareStart, label: `${p.id} · Hypercare Start`, kind: "hypercare" as const, project: p.serviceArea },
    { date: p.hypercareEnd, label: `${p.id} · Hypercare End`, kind: "hypercare" as const, project: p.serviceArea },
  ]).sort((a, b) => a.date.localeCompare(b.date));

  // Group by month
  const groups: Record<string, typeof events> = {};
  events.forEach((e) => {
    const k = new Date(e.date).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    (groups[k] ||= []).push(e);
  });

  const kindStyles: Record<string, string> = {
    start: "bg-info/10 text-info border-info/30",
    cutover: "bg-brand-soft text-brand-deep border-brand/30",
    hypercare: "bg-teal-soft text-teal-deep border-teal/30",
  };

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Planned starts, cutovers, hypercare and approval deadlines" />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
        {[
          ["start", "Planned Start"],
          ["cutover", "Cutover"],
          ["hypercare", "Hypercare"],
        ].map(([k, l]) => (
          <span key={k as string} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${kindStyles[k as string]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {l}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(groups).map(([month, evs]) => (
          <Card key={month}>
            <CardHeader title={month} subtitle={`${evs.length} events`} />
            <div className="divide-y divide-border">
              {evs.map((e, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-16 text-center">
                    <div className="text-2xl font-bold tracking-tight">{new Date(e.date).getDate()}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{new Date(e.date).toLocaleDateString(undefined, { weekday: "short" })}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{e.project}</div>
                    <div className="text-xs text-muted-foreground">{e.label}</div>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${kindStyles[e.kind]}`}>{e.kind}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
