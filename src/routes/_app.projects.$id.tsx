import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Edit3, Share2 } from "lucide-react";
import { PROJECTS, USERS } from "@/data/mock";
import { Button, Card, CardHeader, RagBadge, StatusBadge, StatusDot } from "@/components/ui-kit";

export const Route = createFileRoute("/_app/projects/$id")({
  component: ProjectDetail,
});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function ProjectDetail() {
  const { id } = useParams({ from: "/_app/projects/$id" });
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <h2 className="text-lg font-semibold">Project not found</h2>
        <Link to="/projects" className="mt-3 inline-flex items-center gap-1 text-sm text-brand-deep hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </div>
    );
  }

  const owner = USERS.find((u) => u.id === project.ownerId);
  const support = USERS.find((u) => u.id === project.supportId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/projects" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Projects
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{project.serviceArea}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{project.id} · {project.jobPosition} · {project.unit} → SSC India</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export PPT</Button>
          <Button size="sm"><Edit3 className="h-4 w-4" /> Update</Button>
        </div>
      </div>

      {/* Header info card (PowerPoint-style) */}
      <Card>
        <div className="grid gap-px overflow-hidden rounded-xl bg-border md:grid-cols-6">
          {[
            ["Unit", project.unit],
            ["Vertical", project.vertical],
            ["Service Area", project.serviceArea],
            ["Job Position", project.jobPosition],
            ["Capacity Type", project.capacityType],
            ["Total FTE", String(project.requiredFTE)],
          ].map(([l, v]) => (
            <div key={l} className="bg-card p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{l}</div>
              <div className="mt-1 text-sm font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-px bg-border md:grid-cols-4">
          <div className="bg-card p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Overall Status</div>
            <div className="mt-1.5"><StatusBadge status={project.overallStatus} /></div>
          </div>
          <div className="bg-card p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">RAG</div>
            <div className="mt-1.5"><RagBadge rag={project.rag} /></div>
          </div>
          <div className="bg-card p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Responsible SSC</div>
            <div className="mt-1 text-sm font-semibold">{project.responsibleSSC}</div>
          </div>
          <div className="bg-card p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Responsible HQ</div>
            <div className="mt-1 text-sm font-semibold">{project.responsibleHQ}</div>
          </div>
        </div>
      </Card>

      {/* DOI Timeline */}
      <Card>
        <CardHeader title="Degree of Implementation — Timeline" subtitle="Work packages across 12 months · click items to update progress" />
        <div className="overflow-x-auto p-5">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[260px_repeat(12,1fr)] gap-px bg-border text-[11px]">
              <div className="bg-card px-3 py-2 font-medium uppercase tracking-wider text-muted-foreground">Work Package</div>
              {MONTHS.map((m) => (
                <div key={m} className="bg-card px-2 py-2 text-center font-medium uppercase tracking-wider text-muted-foreground">{m}</div>
              ))}
              {project.workPackages.map((wp, i) => (
                <Row key={i} wp={wp} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <Legend dot="green" label="On track" />
              <Legend dot="amber" label="Delivery under risk" />
              <Legend dot="red" label="Delivery not achievable" />
              <Legend dot="white" label="Not started" />
              <span className="inline-flex items-center gap-1.5"><StatusDot status="go" /> Go Live</span>
              <span className="inline-flex items-center gap-1.5"><StatusDot status="milestone" /> Milestone completed</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Bottom narrative */}
      <div className="grid gap-4 lg:grid-cols-3">
        <NarrativeCard title="Results since last update" items={project.results} accent="bg-rag-green" />
        <NarrativeCard title="Next steps until next update" items={project.nextSteps} accent="bg-teal" />
        <NarrativeCard title="Critical open points & decisions" items={project.criticalPoints.length ? project.criticalPoints : ["No critical points"]} accent="bg-rag-red" />
      </div>

      {/* People & dates */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Team" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <Person label="Transition Owner" name={owner?.name ?? ""} initials={owner?.initials ?? ""} />
            <Person label="Transition Support" name={support?.name ?? ""} initials={support?.initials ?? ""} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Key Dates" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <DateBox label="Planned Start at SSC" date={project.plannedStart} />
            <DateBox label="Cutover" date={project.cutoverDate} />
            <DateBox label="Hypercare Start" date={project.hypercareStart} />
            <DateBox label="Hypercare End" date={project.hypercareEnd} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ wp }: { wp: typeof PROJECTS[0]["workPackages"][0] }) {
  return (
    <>
      <div className="bg-card px-3 py-2.5 text-xs font-medium">{wp.name}</div>
      {Array.from({ length: 12 }).map((_, m) => {
        const inRange = m >= wp.start && m <= wp.end;
        return (
          <div key={m} className="relative bg-card">
            {inRange && (
              <div className="absolute inset-y-1.5 inset-x-0.5">
                <div className={`relative h-full overflow-hidden rounded-sm ${barClass(wp.status)}`}>
                  <div className="absolute inset-y-0 left-0 bg-foreground/10" style={{ width: `${wp.progress}%` }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

function barClass(s: string) {
  return s === "green" ? "bg-rag-green/70"
    : s === "amber" ? "bg-rag-amber/70"
    : s === "red" ? "bg-rag-red/70"
    : "bg-muted";
}

function Legend({ dot, label }: { dot: "red" | "amber" | "green" | "white"; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><StatusDot status={dot} /> {label}</span>;
}

function NarrativeCard({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className={`h-1 w-full ${accent}`} />
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Person({ label, name, initials }: { label: string; name: string; initials: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-brand-foreground">{initials}</div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}

function DateBox({ label, date }: { label: string; date: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{new Date(date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</div>
    </div>
  );
}
