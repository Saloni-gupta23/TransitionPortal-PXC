import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS, USERS } from "@/data/mock";
import { Card, RagBadge, StatusBadge } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/ppt")({ component: PPT });

function PPT() {
  return (
    <div>
      <PageHeader title="PowerPoint Preview" subtitle="Executive slide preview — what leadership will see" />
      <div className="space-y-6">
        {PROJECTS.slice(0, 3).map((p) => {
          const owner = USERS.find((u) => u.id === p.ownerId);
          return (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-[16/9] w-full bg-card p-8">
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between border-b-2 border-brand pb-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-deep">SSC India · Transition Status</div>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight">{p.serviceArea} — {p.jobPosition}</h2>
                      <p className="text-xs text-muted-foreground">{p.id} · {p.unit} → SSC India · {p.requiredFTE} FTE · {p.capacityType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.overallStatus} /><RagBadge rag={p.rag} />
                    </div>
                  </div>
                  <div className="mt-4 grid flex-1 grid-cols-3 gap-4 text-xs">
                    <Block title="Results since last update" items={p.results} />
                    <Block title="Next steps" items={p.nextSteps} />
                    <Block title="Critical points" items={p.criticalPoints.length ? p.criticalPoints : ["—"]} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground">
                    <span>Owner: {owner?.name} · Cutover: {new Date(p.cutoverDate).toLocaleDateString()}</span>
                    <span>Phoenix Contact · Confidential</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep">{title}</div>
      <ul className="space-y-1">{items.map((i, k) => <li key={k} className="flex gap-1.5"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />{i}</li>)}</ul>
    </div>
  );
}
