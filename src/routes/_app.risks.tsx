import { createFileRoute } from "@tanstack/react-router";
import { PROJECTS, RISKS, USERS } from "@/data/mock";
import { Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/risks")({
  component: Risks,
});

const SEV_COLOR: Record<string, string> = {
  Critical: "bg-rag-red text-white",
  High: "bg-rag-red/15 text-rag-red border border-rag-red/30",
  Medium: "bg-rag-amber/15 text-yellow-700 border border-rag-amber/40 dark:text-yellow-400",
  Low: "bg-rag-green/15 text-emerald-700 border border-rag-green/30 dark:text-emerald-400",
};

function Risks() {
  // Risk matrix
  const cells: Record<string, number> = {};
  RISKS.forEach((r) => { const k = `${r.probability}-${r.impact}`; cells[k] = (cells[k] || 0) + 1; });
  const levels = ["Low", "Medium", "High"];

  return (
    <div>
      <PageHeader title="Risks & Issues" subtitle={`${RISKS.length} active risks across portfolio`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Risk Register" subtitle="Prioritized by severity" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Risk</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {RISKS.map((r) => {
                  const proj = PROJECTS.find((p) => p.id === r.projectId);
                  const owner = USERS.find((u) => u.id === r.ownerId);
                  return (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.description}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium">{proj?.id}</div>
                        <div className="text-muted-foreground">{proj?.serviceArea}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${SEV_COLOR[r.severity]}`}>{r.severity}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">{owner?.name}</td>
                      <td className="px-4 py-3 text-xs">{new Date(r.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                      <td className="px-4 py-3 text-xs">{r.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Risk Matrix" subtitle="Probability × Impact" />
          <div className="p-5">
            <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1 text-xs">
              <div />
              {levels.map((l) => <div key={l} className="text-center font-medium text-muted-foreground">{l}</div>)}
              {[...levels].reverse().map((prob) => (
                <>
                  <div key={prob} className="flex items-center justify-end pr-2 font-medium text-muted-foreground">{prob}</div>
                  {levels.map((imp) => {
                    const c = cells[`${prob}-${imp}`] || 0;
                    const heat = (prob === "High" && imp === "High") ? "bg-rag-red/30"
                      : (prob === "High" || imp === "High") ? "bg-rag-amber/30"
                      : (prob === "Medium" && imp === "Medium") ? "bg-rag-amber/15"
                      : "bg-rag-green/15";
                    return (
                      <div key={`${prob}-${imp}`} className={`flex aspect-square items-center justify-center rounded-md border border-border ${heat}`}>
                        <span className="text-lg font-bold">{c}</span>
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">Probability (rows) · Impact (columns)</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
