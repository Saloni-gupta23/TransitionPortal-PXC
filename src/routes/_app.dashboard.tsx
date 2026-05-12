import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, Clock, AlertTriangle, FileCheck } from "lucide-react";
import { Card, CardHeader, KpiCard, RagBadge, StatusBadge } from "@/components/ui-kit";
import { PROJECTS, RISKS, ROLE_LABEL } from "@/data/mock";
import { useAuth, visibleSSCFilter } from "@/lib/auth";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const filter = visibleSSCFilter(user?.role);
  const projects = PROJECTS.filter((p) => filter === "ALL" || p.sscType === filter);

  const totalFTE = projects.reduce((s, p) => s + p.requiredFTE, 0);
  const counts = {
    yet: projects.filter((p) => p.overallStatus === "Yet to Start").length,
    inp: projects.filter((p) => p.overallStatus === "In Process").length,
    hold: projects.filter((p) => p.overallStatus === "Hold").length,
    cut: projects.filter((p) => p.overallStatus === "Cut Over").length,
  };
  const critical = RISKS.filter((r) => r.severity === "Critical").length;

  // Simple distribution data
  const sscDist: Record<string, number> = { TSSC: 0, CSSC: 0, ITSSC: 0 };
  projects.forEach((p) => (sscDist[p.sscType] = (sscDist[p.sscType] ?? 0) + 1));
  const max = Math.max(...Object.values(sscDist), 1);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Team"}`}
        subtitle={user ? `${ROLE_LABEL[user.role]} · India SSC operational overview` : ""}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Total Projects" value={projects.length} accent="brand" hint="Across all SSC types" />
        <KpiCard label="Total FTE" value={totalFTE} accent="teal" hint="Required headcount" />
        <KpiCard label="In Process" value={counts.inp} accent="success" hint={`${counts.cut} cut over · ${counts.hold} hold`} />
        <KpiCard label="Critical Risks" value={critical} accent="danger" hint="Need attention" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Projects by SSC Type" subtitle="Distribution across technical, commercial and IT shared services" />
          <div className="space-y-4 p-5">
            {Object.entries(sscDist).map(([k, v]) => (
              <div key={k}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{k}</span>
                  <span className="text-muted-foreground">{v} projects</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-hero"
                    style={{ width: `${(v / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Status Mix" />
          <div className="grid grid-cols-2 gap-3 p-5 text-xs">
            {[
              ["Yet to Start", counts.yet, "bg-muted-foreground"],
              ["In Process", counts.inp, "bg-teal"],
              ["Hold", counts.hold, "bg-rag-amber"],
              ["Cut Over", counts.cut, "bg-rag-green"],
            ].map(([l, v, c]) => (
              <div key={l as string} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${c as string}`} />
                  <span className="text-muted-foreground">{l}</span>
                </div>
                <div className="mt-1 text-2xl font-bold">{v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Active Projects" subtitle="Most recently updated" action={<Link to="/projects" className="text-xs font-medium text-brand-deep hover:underline inline-flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></Link>} />
          <div className="divide-y divide-border">
            {projects.slice(0, 5).map((p) => (
              <Link key={p.id} to="/projects/$id" params={{ id: p.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-soft text-xs font-bold text-brand-deep">{p.sscType}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.serviceArea} · {p.jobPosition}</div>
                  <div className="truncate text-xs text-muted-foreground">{p.unit} → SSC India · {p.requiredFTE} FTE</div>
                </div>
                <RagBadge rag={p.rag} />
                <StatusBadge status={p.overallStatus} />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Attention Needed" subtitle="Approvals, risks and overdue items" />
          <div className="divide-y divide-border">
            {[
              { icon: FileCheck, color: "text-brand", title: "2 approvals pending", desc: "Budget exception · DOI gate review" },
              { icon: AlertTriangle, color: "text-rag-red", title: `${critical} critical risk${critical === 1 ? "" : "s"}`, desc: "PRJ-002 documentation, PRJ-004 budget" },
              { icon: Clock, color: "text-rag-amber", title: "3 milestones this week", desc: "Recruitment closure · IT readiness review" },
              { icon: CheckCircle2, color: "text-rag-green", title: "PRJ-003 hypercare closed", desc: "Moved into steady state monitoring" },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <Icon className={`mt-0.5 h-4 w-4 ${it.color}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{it.title}</div>
                    <div className="text-xs text-muted-foreground">{it.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
