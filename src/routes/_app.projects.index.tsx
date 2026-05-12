import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Filter, Plus, Search } from "lucide-react";
import { PROJECTS, USERS, type SSCType, type OverallStatus } from "@/data/mock";
import { useAuth, visibleSSCFilter } from "@/lib/auth";
import { Button, Card, RagBadge, StatusBadge } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/projects/")({
  component: ProjectsList,
});

function ProjectsList() {
  const { user } = useAuth();
  const sscScope = visibleSSCFilter(user?.role);
  const [q, setQ] = useState("");
  const [ssc, setSsc] = useState<"ALL" | SSCType>("ALL");
  const [status, setStatus] = useState<"ALL" | OverallStatus>("ALL");

  const list = useMemo(() => {
    return PROJECTS.filter((p) => sscScope === "ALL" || p.sscType === sscScope)
      .filter((p) => ssc === "ALL" || p.sscType === ssc)
      .filter((p) => status === "ALL" || p.overallStatus === status)
      .filter((p) => {
        if (!q) return true;
        const s = q.toLowerCase();
        return p.serviceArea.toLowerCase().includes(s) || p.jobPosition.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.unit.toLowerCase().includes(s);
      });
  }, [q, ssc, status, sscScope]);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${list.length} transition projects`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
            <Link to="/projects/new"><Button size="sm"><Plus className="h-4 w-4" /> New Transition</Button></Link>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="h-9 w-64 rounded-md border border-border bg-card pl-8 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select value={ssc} onChange={(e) => setSsc(e.target.value as never)} className="h-9 rounded-md border border-border bg-card px-2 text-sm">
              <option value="ALL">All SSC Types</option>
              <option value="TSSC">TSSC</option>
              <option value="CSSC">CSSC</option>
              <option value="ITSSC">ITSSC</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="h-9 rounded-md border border-border bg-card px-2 text-sm">
              <option value="ALL">All statuses</option>
              <option>Yet to Start</option>
              <option>In Process</option>
              <option>Hold</option>
              <option>Cut Over</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Unit · Vertical</th>
                <th className="px-4 py-3 font-medium">SSC</th>
                <th className="px-4 py-3 font-medium">FTE</th>
                <th className="px-4 py-3 font-medium">DOI</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">RAG</th>
                <th className="px-4 py-3 font-medium">Cutover</th>
                <th className="px-4 py-3 font-medium">Owner</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const owner = USERS.find((u) => u.id === p.ownerId);
                return (
                  <tr key={p.id} className="group border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link to="/projects/$id" params={{ id: p.id }} className="block">
                        <div className="font-medium group-hover:text-brand-deep">{p.serviceArea}</div>
                        <div className="text-xs text-muted-foreground">{p.id} · {p.jobPosition}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div>{p.unit}</div>
                      <div className="text-xs text-muted-foreground">{p.vertical}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 items-center rounded bg-brand-soft px-2 text-[11px] font-bold text-brand-deep">{p.sscType}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.requiredFTE}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`h-1.5 w-5 rounded-full ${s <= p.currentDOI ? "bg-brand" : "bg-muted"}`} />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">{p.currentDOI}/5</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.overallStatus} /></td>
                    <td className="px-4 py-3"><RagBadge rag={p.rag} /></td>
                    <td className="px-4 py-3 text-xs">{new Date(p.cutoverDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-hero text-[10px] font-semibold text-brand-foreground">{owner?.initials}</div>
                        <span className="text-xs">{owner?.name}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-16 text-center text-sm text-muted-foreground">No projects match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
