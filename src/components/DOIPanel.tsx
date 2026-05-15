/**
 * components/DOIPanel.tsx
 *
 * Embedded DOI progress panel — sits inside the project detail page.
 *
 * Shows:
 *   - 5-stage horizontal stepper (each stage clickable → /projects/$id/doi/$stage)
 *   - Column-separated Gantt via <DOIGantt />
 *   - Per-stage completion badges pulled from localStorage
 *   - Stage quick-access cards at the bottom
 */

import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { type Project } from "@/data/mock";
import { DOI_STAGES, STAGE_GRADIENT, STAGE_SOFT_COLORS } from "@/data/doiData";
import { getStageCompletion } from "@/data/doiStageData";
import { Card, CardHeader } from "@/components/ui-kit";
import { DOIGantt } from "@/components/DOIGantt";
import { useAuth, canEdit } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface DOIPanelProps {
  project: Project;
}

export function DOIPanel({ project }: DOIPanelProps) {
  const { user } = useAuth();
  const editable = canEdit(user?.role);

  return (
    <Card>
      <CardHeader
        title="Degree of Implementation (DOI)"
        subtitle="5-stage transition framework · click a stage to update progress"
      />

      {/* ── Stage stepper ── */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start">
          {DOI_STAGES.map((s, i) => {
            const isCurrent = s.stage === project.currentDOI;
            const isComplete = s.stage < project.currentDOI;
            const grad = STAGE_GRADIENT[s.accent];
            const soft = STAGE_SOFT_COLORS[s.accent];
            const pct = getStageCompletion(project.id, s.key);

            return (
              <div key={s.key} className="flex flex-1 items-start">
                {/* Vertical separator before (except first) */}
                {i > 0 && (
                  <div
                    className={cn(
                      "mt-5 h-px flex-none w-4 md:w-6",
                      isComplete ? "bg-rag-green" : "bg-border"
                    )}
                  />
                )}

                <div className="flex flex-1 flex-col items-center gap-2">
                  <Link
                    to="/projects/$id/doi/$stage"
                    params={{ id: project.id, stage: s.key }}
                    className="group flex flex-col items-center gap-1"
                  >
                    {/* Circle */}
                    <div
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ring-2 ring-transparent group-hover:ring-border",
                        isCurrent
                          ? `bg-gradient-to-br ${grad} text-white shadow-elevated scale-105 ring-offset-2`
                          : isComplete
                            ? "bg-rag-green text-white"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        s.stage
                      )}
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-brand ring-2 ring-card" />
                      )}
                    </div>

                    {/* Stage title */}
                    <div
                      className={cn(
                        "text-center text-[10px] font-medium leading-tight max-w-[72px]",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.title}
                    </div>

                    {/* Status badge */}
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        isCurrent
                          ? soft
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {isCurrent ? "Current" : isComplete ? "Done" : "Upcoming"}
                    </div>

                    {/* Completion % pill — shown when there's saved data */}
                    {pct > 0 && (
                      <div
                        className={cn(
                          "mt-0.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                          pct === 100
                            ? "bg-rag-green/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-brand-soft text-brand-deep"
                        )}
                      >
                        {pct}%
                      </div>
                    )}
                  </Link>
                </div>

                {/* Connector line (except after last) */}
                {i < DOI_STAGES.length - 1 && (
                  <div
                    className={cn(
                      "mt-5 h-px flex-1",
                      isComplete ? "bg-rag-green" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Gantt chart ── */}
      <div className="border-b border-border p-5">
        <DOIGantt project={project} />
      </div>

      {/* ── Stage quick-access cards ── */}
      <div className="grid gap-3 p-5 sm:grid-cols-5">
        {DOI_STAGES.map((s) => {
          const isCurrent = s.stage === project.currentDOI;
          const isComplete = s.stage < project.currentDOI;
          const grad = STAGE_GRADIENT[s.accent];
          const soft = STAGE_SOFT_COLORS[s.accent];
          const pct = getStageCompletion(project.id, s.key);

          return (
            <Link
              key={s.key}
              to="/projects/$id/doi/$stage"
              params={{ id: project.id, stage: s.key }}
              className={cn(
                "group relative overflow-hidden rounded-lg border p-3 transition-all duration-150 hover:shadow-elevated",
                isCurrent
                  ? "border-brand/30 bg-brand-soft"
                  : "border-border bg-surface hover:bg-muted/30"
              )}
            >
              {/* Top accent strip */}
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r",
                  grad
                )}
              />

              {/* Stage number badge */}
              <div
                className={cn(
                  "mb-2 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                  isCurrent
                    ? `bg-gradient-to-br ${grad} text-white`
                    : isComplete
                      ? "bg-rag-green text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {isComplete ? "✓" : s.stage}
              </div>

              <div className="text-[11px] font-semibold leading-tight text-foreground">
                {s.title}
              </div>

              <div className="mt-1 flex items-center justify-between">
                <span
                  className={cn(
                    "text-[10px]",
                    isCurrent
                      ? "text-brand-deep font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {isCurrent
                    ? "In progress"
                    : isComplete
                      ? "Complete"
                      : "Upcoming"}
                </span>
                {isCurrent || editable ? (
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground/50" />
                )}
              </div>

              {/* Completion micro bar */}
              {pct > 0 && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all",
                      grad
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
