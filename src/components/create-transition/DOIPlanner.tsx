/**
 * components/create-transition/DOIPlanner.tsx
 *
 * Step 3 of the Create Transition wizard.
 *
 * Shows all 5 DOI stages in a card grid. Each card lets the user set:
 *   - Stage start date
 *   - Stage end date
 *
 * The start/end bounds are loosely auto-derived from the project's
 * plannedStart / cutoverDate passed in as props, but the user can
 * override them freely.
 *
 * A mini timeline bar at the bottom visualises all 5 stages proportionally.
 */
import { Calendar, CheckCircle2 } from "lucide-react";
import {
  DOI_STAGES,
  STAGE_GRADIENT,
  STAGE_SOFT_COLORS,
  STAGE_ACCENT_COLORS,
} from "@/data/doiData";
import { cn } from "@/lib/utils";

export interface DOIStageDates {
  startDate: string;
  endDate: string;
}

export type DOIPlan = Record<string, DOIStageDates>; // keyed by stage.key

interface DOIPlannerProps {
  plan: DOIPlan;
  onChange: (plan: DOIPlan) => void;
  projectStart?: string; // ISO date string, optional hint
  projectEnd?: string; // ISO date string, optional hint
}

const INPUT_CLS =
  "h-8 w-full rounded border border-border bg-surface pl-7 pr-2 text-xs outline-none " +
  "focus:border-ring focus:ring-1 focus:ring-ring/30 transition-colors";

export function DOIPlanner({
  plan,
  onChange,
  projectStart,
  projectEnd,
}: DOIPlannerProps) {
  const update = (key: string, field: keyof DOIStageDates, val: string) => {
    onChange({ ...plan, [key]: { ...plan[key], [field]: val } });
  };

  /* ── Compute timeline bar segments ── */
  const allDates = DOI_STAGES.flatMap((s) => [
    plan[s.key]?.startDate,
    plan[s.key]?.endDate,
  ]).filter(Boolean) as string[];

  const minMs = allDates.length
    ? Math.min(...allDates.map((d) => new Date(d).getTime()))
    : null;
  const maxMs = allDates.length
    ? Math.max(...allDates.map((d) => new Date(d).getTime()))
    : null;
  const spanMs = minMs && maxMs ? maxMs - minMs || 1 : null;

  return (
    <div className="space-y-4">
      {/* Hint */}
      {(projectStart || projectEnd) && (
        <p className="text-xs text-muted-foreground">
          Project window:{" "}
          {projectStart && (
            <span className="font-semibold text-foreground">
              {projectStart}
            </span>
          )}
          {projectStart && projectEnd && " → "}
          {projectEnd && (
            <span className="font-semibold text-foreground">{projectEnd}</span>
          )}
          . Set stage dates within this range.
        </p>
      )}

      {/* Stage cards grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {DOI_STAGES.map((stage) => {
          const grad = STAGE_GRADIENT[stage.accent];
          const soft = STAGE_SOFT_COLORS[stage.accent];
          const accent = STAGE_ACCENT_COLORS[stage.accent];
          const dates = plan[stage.key] ?? { startDate: "", endDate: "" };
          const filled = dates.startDate && dates.endDate;

          return (
            <div
              key={stage.key}
              className={cn(
                "relative overflow-hidden rounded-xl border transition-all duration-150",
                filled
                  ? "border-rag-green/30 bg-rag-green/5"
                  : "border-border bg-card hover:border-brand/20"
              )}
            >
              {/* Top accent stripe */}
              <div className={cn("h-1 w-full bg-gradient-to-r", grad)} />

              <div className="p-3 space-y-3">
                {/* Stage badge + number */}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                      accent
                    )}
                  >
                    {stage.stage}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold leading-tight text-foreground truncate">
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                      {stage.subtitle.split("·")[0].trim()}
                    </div>
                  </div>
                </div>

                {/* Status pill */}
                <div>
                  {filled ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rag-green/30 bg-rag-green/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Planned
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        soft
                      )}
                    >
                      Set dates
                    </span>
                  )}
                </div>

                {/* Date pickers */}
                <div className="space-y-2">
                  <div>
                    <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Start
                    </label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={dates.startDate}
                        min={projectStart}
                        max={projectEnd}
                        onChange={(e) => {
                          update(stage.key, "startDate", e.target.value);
                          // clear end if it's now before new start
                          if (dates.endDate && e.target.value > dates.endDate) {
                            update(stage.key, "endDate", "");
                          }
                        }}
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      End
                    </label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={dates.endDate}
                        min={dates.startDate || projectStart}
                        max={projectEnd}
                        disabled={!dates.startDate}
                        onChange={(e) =>
                          update(stage.key, "endDate", e.target.value)
                        }
                        className={
                          INPUT_CLS +
                          (!dates.startDate
                            ? " opacity-40 cursor-not-allowed"
                            : "")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini timeline bar */}
      {spanMs && (
        <div className="mt-2">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Stage Timeline
          </div>
          <div className="relative h-5 rounded-full bg-muted overflow-hidden">
            {DOI_STAGES.map((stage) => {
              const dates = plan[stage.key];
              if (!dates?.startDate || !dates?.endDate || !minMs || !spanMs)
                return null;
              const left =
                ((new Date(dates.startDate).getTime() - minMs) / spanMs) * 100;
              const width =
                ((new Date(dates.endDate).getTime() -
                  new Date(dates.startDate).getTime()) /
                  spanMs) *
                100;
              const grad = STAGE_GRADIENT[stage.accent];
              return (
                <div
                  key={stage.key}
                  title={`${stage.title}: ${dates.startDate} → ${dates.endDate}`}
                  className={cn(
                    "absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r opacity-80",
                    grad
                  )}
                  style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                />
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            {minMs && (
              <span>
                {new Date(minMs).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
            {maxMs && (
              <span>
                {new Date(maxMs).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
