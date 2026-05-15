/**
 * components/UpdateProjectPanel.tsx
 *
 * Slide-over drawer that opens when the user clicks the "Update" button
 * on a project detail page. Lets users edit:
 *   - Overall Status & RAG
 *   - Key Dates (plannedStart, cutoverDate, hypercareStart, hypercareEnd)
 *   - Responsible SSC & HQ
 *   - Results / Next Steps / Critical Points narrative
 *
 * Usage:
 *   <UpdateProjectPanel
 *     project={project}
 *     open={panelOpen}
 *     onClose={() => setPanelOpen(false)}
 *     onSave={(updated) => { ... }}
 *   />
 *
 * Note: `onSave` receives a Partial<Project> with only changed fields.
 * Wire it to your projectService.updateProject() when the backend is ready.
 * For now it saves to localStorage under "pc.project.edit.<id>".
 */
import { useState, useEffect } from "react";
import { X, Save, CheckCircle2 } from "lucide-react";
import { type Project } from "@/data/mock";
import { Button } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const OVERALL_STATUSES = [
  "Yet to Start",
  "In Process",
  "Hold",
  "Cut Over",
] as const;
const RAG_OPTIONS = ["Green", "Amber", "Red"] as const;

const INPUT =
  "h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none " +
  "focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors";

const TEXTAREA =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none " +
  "focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none transition-colors";

interface UpdateProjectPanelProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  onSave?: (updated: Partial<Project>) => void;
}

interface EditState {
  overallStatus: string;
  rag: string;
  plannedStart: string;
  cutoverDate: string;
  hypercareStart: string;
  hypercareEnd: string;
  responsibleSSC: string;
  responsibleHQ: string;
  results: string;
  nextSteps: string;
  criticalPoints: string;
}

function storageKey(id: string) {
  return `pc.project.edit.${id}`;
}

export function UpdateProjectPanel({
  project,
  open,
  onClose,
  onSave,
}: UpdateProjectPanelProps) {
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState<EditState>(() => ({
    overallStatus: project.overallStatus,
    rag: project.rag,
    plannedStart: project.plannedStart,
    cutoverDate: project.cutoverDate,
    hypercareStart: project.hypercareStart,
    hypercareEnd: project.hypercareEnd,
    responsibleSSC: project.responsibleSSC,
    responsibleHQ: project.responsibleHQ,
    results: project.results.join("\n"),
    nextSteps: project.nextSteps.join("\n"),
    criticalPoints: project.criticalPoints.join("\n"),
  }));

  /* Rehydrate from localStorage on open */
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(storageKey(project.id));
      if (raw) {
        const data = JSON.parse(raw) as Partial<EditState>;
        setForm((f) => ({ ...f, ...data }));
      }
    } catch {
      /* ignore */
    }
    setSaved(false);
  }, [open, project.id]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const set = <K extends keyof EditState>(key: K, val: EditState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    // Persist locally
    localStorage.setItem(storageKey(project.id), JSON.stringify(form));

    // Build partial update for the API
    const updated: Partial<Project> = {
      overallStatus: form.overallStatus as Project["overallStatus"],
      rag: form.rag as Project["rag"],
      plannedStart: form.plannedStart,
      cutoverDate: form.cutoverDate,
      hypercareStart: form.hypercareStart,
      hypercareEnd: form.hypercareEnd,
      responsibleSSC: form.responsibleSSC,
      responsibleHQ: form.responsibleHQ,
      results: form.results.split("\n").filter(Boolean),
      nextSteps: form.nextSteps.split("\n").filter(Boolean),
      criticalPoints: form.criticalPoints.split("\n").filter(Boolean),
    };

    onSave?.(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-[480px] flex-col bg-card shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Update Project</h2>
            <p className="text-xs text-muted-foreground">
              {project.id} · {project.serviceArea}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* ── Status & RAG ── */}
          <Section title="Status">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Overall Status">
                <select
                  value={form.overallStatus}
                  onChange={(e) => set("overallStatus", e.target.value)}
                  className={INPUT}
                >
                  {OVERALL_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="RAG">
                <select
                  value={form.rag}
                  onChange={(e) => set("rag", e.target.value)}
                  className={INPUT}
                >
                  {RAG_OPTIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {/* ── Key Dates ── */}
          <Section title="Key Dates">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Planned Start">
                <input
                  type="date"
                  value={form.plannedStart}
                  onChange={(e) => set("plannedStart", e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="Cutover Date">
                <input
                  type="date"
                  value={form.cutoverDate}
                  min={form.plannedStart}
                  onChange={(e) => set("cutoverDate", e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="Hypercare Start">
                <input
                  type="date"
                  value={form.hypercareStart}
                  min={form.cutoverDate}
                  onChange={(e) => set("hypercareStart", e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="Hypercare End">
                <input
                  type="date"
                  value={form.hypercareEnd}
                  min={form.hypercareStart}
                  onChange={(e) => set("hypercareEnd", e.target.value)}
                  className={INPUT}
                />
              </Field>
            </div>
          </Section>

          {/* ── Responsible persons ── */}
          <Section title="Ownership">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Responsible SSC">
                <input
                  type="text"
                  value={form.responsibleSSC}
                  onChange={(e) => set("responsibleSSC", e.target.value)}
                  className={INPUT}
                  placeholder="Name"
                />
              </Field>

              <Field label="Responsible HQ">
                <input
                  type="text"
                  value={form.responsibleHQ}
                  onChange={(e) => set("responsibleHQ", e.target.value)}
                  className={INPUT}
                  placeholder="Name"
                />
              </Field>
            </div>
          </Section>

          {/* ── Narrative ── */}
          <Section title="Narrative Update">
            <div className="space-y-3">
              <NarrativeField
                label="Results since last update"
                accent="bg-rag-green"
                value={form.results}
                onChange={(v) => set("results", v)}
                placeholder="One result per line…"
              />
              <NarrativeField
                label="Next steps until next update"
                accent="bg-brand"
                value={form.nextSteps}
                onChange={(v) => set("nextSteps", v)}
                placeholder="One action item per line…"
              />
              <NarrativeField
                label="Critical open points & decisions"
                accent="bg-rag-red"
                value={form.criticalPoints}
                onChange={(v) => set("criticalPoints", v)}
                placeholder="One critical point per line…"
              />
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4 flex items-center justify-between">
          {saved ? (
            <span className="flex items-center gap-1.5 text-sm text-rag-green font-medium animate-fade-in">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Changes saved locally until backend is connected.
            </span>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function NarrativeField({
  label,
  accent,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  accent: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={cn("h-0.5 w-full", accent)} />
      <div className="px-3 py-2">
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={TEXTAREA}
        />
      </div>
    </div>
  );
}
