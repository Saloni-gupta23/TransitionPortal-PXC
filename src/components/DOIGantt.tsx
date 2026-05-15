/**
 * components/DOIGantt.tsx
 *
 * Full DOI Gantt — uses a real <table> with rowspan so the DOI Stage
 * column spans correctly across its work packages (no grey ghost blocks).
 */
import { Link } from "@tanstack/react-router";
import { type Project } from "@/data/mock";
import { DOI_STAGES, STAGE_GRADIENT, STAGE_SOFT_COLORS } from "@/data/doiData";
import { StatusDot } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function barClass(status: string) {
  switch (status) {
    case "green":
      return "bg-rag-green/70";
    case "amber":
      return "bg-rag-amber/70";
    case "red":
      return "bg-rag-red/70";
    default:
      return "bg-muted";
  }
}

function dotStatus(s: string): "green" | "amber" | "red" | "white" {
  if (s === "green") return "green";
  if (s === "amber") return "amber";
  if (s === "red") return "red";
  return "white";
}

/** Which DOI stage each WP name belongs to */
const STAGE_WP_MAP: Record<number, string[]> = {
  1: ["strategic planning"],
  2: ["budget"],
  3: ["operative planning"],
  4: [
    "recruiting",
    "training",
    "process",
    "onboarding",
    "cut-over",
    "hypercare",
    "stabiliz",
  ],
  5: ["monitoring"],
};

function stageForWP(name: string): number {
  const lower = name.toLowerCase();
  for (const [stage, keywords] of Object.entries(STAGE_WP_MAP)) {
    if (keywords.some((k) => lower.includes(k))) return Number(stage);
  }
  return 4;
}

interface DOIGanttProps {
  project: Project;
}

export function DOIGantt({ project }: DOIGanttProps) {
  const wps = project.workPackages;

  // Group WPs by stage, preserving order
  type GroupedStage = {
    stage: (typeof DOI_STAGES)[number];
    wps: typeof wps;
  };

  const grouped: GroupedStage[] = DOI_STAGES.map((s) => ({
    stage: s,
    wps: wps.filter((wp) => stageForWP(wp.name) === s.stage),
  })).filter((g) => g.wps.length > 0);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {/* DOI Stage col header */}
              <th className="bg-surface px-3 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground rounded-tl-md w-[160px]">
                DOI Stage
              </th>
              {/* Work Package col header */}
              <th className="bg-surface px-3 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground w-[200px]">
                Work Package
              </th>
              {/* Month headers */}
              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="bg-surface px-1 py-2 text-center font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {m}
                </th>
              ))}
              {/* Status col */}
              <th className="bg-surface px-2 py-2 text-center font-semibold uppercase tracking-wider text-muted-foreground rounded-tr-md w-[52px]">
                ST.
              </th>
            </tr>
          </thead>

          <tbody>
            {grouped.map(({ stage, wps: stageWps }) => {
              const isCurrent = stage.stage === project.currentDOI;
              const isComplete = stage.stage < project.currentDOI;
              const grad = STAGE_GRADIENT[stage.accent];
              const soft = STAGE_SOFT_COLORS[stage.accent];

              return stageWps.map((wp, wpIdx) => (
                <tr
                  key={`${stage.key}-${wpIdx}`}
                  className="border-t border-border"
                >
                  {/* DOI Stage cell — only on the FIRST row of each group, rowspan covers the rest */}
                  {wpIdx === 0 && (
                    <td
                      rowSpan={stageWps.length}
                      className="align-top border-r border-border bg-card p-0"
                    >
                      <Link
                        to="/projects/$id/doi/$stage"
                        params={{ id: project.id, stage: stage.key }}
                        className="group relative flex h-full flex-col justify-start gap-1.5 px-3 py-2.5 hover:bg-muted/40 transition-colors"
                      >
                        {/* Left accent bar */}
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                            grad
                          )}
                        />
                        <div className="pl-2">
                          <div
                            className={cn(
                              "mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                              isCurrent
                                ? soft
                                : isComplete
                                  ? "bg-rag-green/10 text-emerald-700 border-rag-green/30 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground border-border"
                            )}
                          >
                            {isComplete ? "✓" : stage.stage}
                          </div>
                          <div className="text-[11px] font-semibold leading-tight text-foreground group-hover:text-brand-deep transition-colors">
                            {stage.title}
                          </div>
                        </div>
                      </Link>
                    </td>
                  )}

                  {/* Work Package name */}
                  <td className="bg-card px-3 py-2.5 text-[11px] font-medium text-foreground border-r border-border">
                    {wp.name}
                  </td>

                  {/* Month bar cells */}
                  {Array.from({ length: 12 }).map((_, m) => {
                    const inRange = m >= wp.start && m <= wp.end;
                    return (
                      <td key={m} className="relative bg-card p-0 h-9">
                        {inRange && (
                          <div className="absolute inset-y-1.5 inset-x-0.5">
                            <div
                              className={cn(
                                "relative h-full overflow-hidden rounded-sm",
                                barClass(wp.status)
                              )}
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-foreground/15"
                                style={{ width: `${wp.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Status dot */}
                  <td className="bg-card text-center align-middle">
                    <StatusDot status={dotStatus(wp.status)} />
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="green" /> On track
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="amber" /> Delivery under risk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="red" /> Delivery not achievable
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="white" /> Not started
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="go" /> Go Live
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StatusDot status="milestone" /> Milestone completed
          </span>
        </div>
      </div>
    </div>
  );
}
