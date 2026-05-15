/**
 * routes/_app.projects.$id.tsx
 *
 * Project detail page. The "Update" button opens <UpdateProjectPanel>
 * as a slide-over drawer. All other UI is unchanged.
 */
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, Edit3, Share2 } from "lucide-react";
import { PROJECTS, USERS } from "@/data/mock";
import {
  Button,
  Card,
  CardHeader,
  RagBadge,
  StatusBadge,
  StatusDot,
} from "@/components/ui-kit";
import { DOIPanel } from "@/components/DOIPanel";
import { UpdateProjectPanel } from "@/components/UpdateProjectPanel";

export const Route = createFileRoute("/_app/projects/$id")({
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = useParams({ from: "/_app/projects/$id" });
  const [updateOpen, setUpdateOpen] = useState(false);

  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <h2 className="text-lg font-semibold">Project not found</h2>
        <Link
          to="/projects"
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
      </div>
    );
  }

  const owner = USERS.find((u) => u.id === project.ownerId);
  const support = USERS.find((u) => u.id === project.supportId);

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Projects
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {project.serviceArea}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.id} · {project.jobPosition} · {project.unit} → SSC India
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Export PPT
            </Button>
            {/* ← This opens the slide-over */}
            <Button size="sm" onClick={() => setUpdateOpen(true)}>
              <Edit3 className="h-4 w-4" /> Update
            </Button>
          </div>
        </div>

        {/* ── Header info card ── */}
        <Card>
          <div className="grid gap-px overflow-hidden rounded-t-xl bg-border md:grid-cols-6">
            {[
              ["Unit", project.unit],
              ["Vertical", project.vertical],
              ["Service Area", project.serviceArea],
              ["Job Position", project.jobPosition],
              ["Capacity Type", project.capacityType],
              ["Total FTE", String(project.requiredFTE)],
            ].map(([l, v]) => (
              <div key={l} className="bg-card p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {l}
                </div>
                <div className="mt-1 text-sm font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-px bg-border md:grid-cols-4">
            <div className="bg-card p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Overall Status
              </div>
              <div className="mt-1.5">
                <StatusBadge status={project.overallStatus} />
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                RAG
              </div>
              <div className="mt-1.5">
                <RagBadge rag={project.rag} />
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Responsible SSC
              </div>
              <div className="mt-1 text-sm font-semibold">
                {project.responsibleSSC}
              </div>
            </div>
            <div className="bg-card p-4 rounded-br-xl">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Responsible HQ
              </div>
              <div className="mt-1 text-sm font-semibold">
                {project.responsibleHQ}
              </div>
            </div>
          </div>
        </Card>

        {/* ── DOI Panel ── */}
        <DOIPanel project={project} />

        {/* ── Bottom narrative ── */}
        <div className="grid gap-4 lg:grid-cols-3">
          <NarrativeCard
            title="Results since last update"
            items={project.results}
            accent="bg-rag-green"
          />
          <NarrativeCard
            title="Next steps until next update"
            items={project.nextSteps}
            accent="bg-teal"
          />
          <NarrativeCard
            title="Critical open points & decisions"
            items={
              project.criticalPoints.length
                ? project.criticalPoints
                : ["No critical points"]
            }
            accent="bg-rag-red"
          />
        </div>

        {/* ── People & Dates ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Team" />
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <Person
                label="Transition Owner"
                name={owner?.name ?? ""}
                initials={owner?.initials ?? ""}
              />
              <Person
                label="Transition Support"
                name={support?.name ?? ""}
                initials={support?.initials ?? ""}
              />
            </div>
          </Card>
          <Card>
            <CardHeader title="Key Dates" />
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <DateBox
                label="Planned Start at SSC"
                date={project.plannedStart}
              />
              <DateBox label="Cutover" date={project.cutoverDate} />
              <DateBox label="Hypercare Start" date={project.hypercareStart} />
              <DateBox label="Hypercare End" date={project.hypercareEnd} />
            </div>
          </Card>
        </div>
      </div>

      {/* ── Slide-over update panel ── */}
      <UpdateProjectPanel
        project={project}
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onSave={(updated) => {
          // TODO: wire to projectService.updateProject(project.id, updated)
          console.log("Project update:", updated);
          setUpdateOpen(false);
        }}
      />
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */
function NarrativeCard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className={`h-1 w-full ${accent}`} />
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Person({
  label,
  name,
  initials,
}: {
  label: string;
  name: string;
  initials: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-brand-foreground">
        {initials}
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}

function DateBox({ label, date }: { label: string; date: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">
        {new Date(date).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
