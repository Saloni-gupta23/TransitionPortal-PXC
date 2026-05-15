/**
 * components/create-transition/ReviewSummary.tsx
 *
 * Step 5 — final review before creating the transition.
 * Renders a read-only summary of all form data grouped into cards.
 */
import { DOI_STAGES, STAGE_SOFT_COLORS, STAGE_GRADIENT } from "@/data/doiData";
import type { NewTransitionForm } from "@/routes/_app.projects.new";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ReviewSummaryProps {
  form: NewTransitionForm;
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <span className="w-40 shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="border-b border-border bg-surface px-4 py-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}

export function ReviewSummary({ form }: ReviewSummaryProps) {
  // Validation check
  const doiPlanned = DOI_STAGES.filter(
    (s) => form.doiPlan[s.key]?.startDate && form.doiPlan[s.key]?.endDate
  ).length;

  return (
    <div className="space-y-4">
      {/* Validation banner */}
      {doiPlanned < DOI_STAGES.length && (
        <div className="flex items-start gap-3 rounded-lg border border-rag-amber/30 bg-rag-amber/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rag-amber" />
          <span>
            {DOI_STAGES.length - doiPlanned} DOI stage
            {DOI_STAGES.length - doiPlanned !== 1 ? "s" : ""} are missing dates.
            The project will be created with incomplete DOI planning.
          </span>
        </div>
      )}
      {doiPlanned === DOI_STAGES.length && (
        <div className="flex items-center gap-2 rounded-lg border border-rag-green/30 bg-rag-green/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 text-rag-green" />
          All 5 DOI stages have planned dates. Ready to create.
        </div>
      )}

      {/* Service Details */}
      <SectionCard title="Service Details">
        <Row label="Job Position" value={form.jobPosition} />
        <Row label="Business Unit" value={form.unit} />
        <Row label="Vertical" value={form.vertical} />
        <Row label="Service Area" value={form.serviceArea} />
        <Row label="SSC Type" value={form.sscType} />
      </SectionCard>

      {/* Capacity & Dates */}
      <SectionCard title="Capacity & Dates">
        <Row label="Required FTE" value={form.requiredFTE} />
        <Row label="Capacity Type" value={form.capacityType} />
        <Row label="Planned Start" value={form.plannedStart} />
        <Row label="Cutover Date" value={form.cutoverDate} />
        <Row label="Hypercare Start" value={form.hypercareStart} />
        <Row label="Hypercare End" value={form.hypercareEnd} />
        <Row label="Overall Status" value={form.overallStatus} />
        <Row label="RAG" value={form.rag} />
      </SectionCard>

      {/* Team */}
      <SectionCard title="Team">
        <Row label="Responsible SSC" value={form.responsibleSSC} />
        <Row label="Responsible HQ" value={form.responsibleHQ} />
      </SectionCard>

      {/* DOI Plan */}
      <SectionCard title="DOI Stage Plan">
        <div className="grid gap-2 py-2 sm:grid-cols-5">
          {DOI_STAGES.map((stage) => {
            const dates = form.doiPlan[stage.key];
            const filled = dates?.startDate && dates?.endDate;
            const grad = STAGE_GRADIENT[stage.accent];
            const soft = STAGE_SOFT_COLORS[stage.accent];

            return (
              <div
                key={stage.key}
                className={cn(
                  "relative overflow-hidden rounded-lg border p-2.5",
                  filled
                    ? "border-rag-green/30 bg-rag-green/5"
                    : "border-border bg-surface"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r",
                    grad
                  )}
                />
                <div className="text-[10px] font-semibold text-foreground mb-1">
                  {stage.title}
                </div>
                {filled ? (
                  <div className="text-[10px] text-muted-foreground space-y-0.5">
                    <div>
                      From:{" "}
                      <span className="font-medium text-foreground">
                        {dates.startDate}
                      </span>
                    </div>
                    <div>
                      To:{" "}
                      <span className="font-medium text-foreground">
                        {dates.endDate}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    Not planned
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
