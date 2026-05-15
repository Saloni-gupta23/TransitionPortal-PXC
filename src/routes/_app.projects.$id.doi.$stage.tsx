/**
 * routes/_app.projects.$id.doi.$stage.tsx
 *
 * DOI Stage Detail Page
 * URL: /projects/:id/doi/:stage
 *
 * Features:
 *  - 5-stage breadcrumb timeline (clickable, each stage links to its page)
 *  - Stage header with animated SVG completion ring + per-stage start/end dates
 *  - Work package checklist (stage-specific items from doiStageData.ts)
 *  - Results / Next Steps / Critical Points narrative textareas
 *  - Save draft (localStorage) + Submit & Continue navigation
 *  - Toast notifications
 *  - Role-based edit guard
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Save,
  ChevronRight,
  AlertTriangle,
  ClipboardList,
  Target,
  Flag,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Lock,
  FileText,
} from "lucide-react";
import { PROJECTS } from "@/data/mock";
import {
  DOI_STAGES,
  getStageByKey,
  STAGE_SOFT_COLORS,
  STAGE_GRADIENT,
} from "@/data/doiData";
import {
  getStagePageData,
  loadStageData,
  saveStageData,
  type DOIStageFormData,
} from "@/data/doiStageData";
import { Button, Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";
import { useAuth, canEdit } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/$id/doi/$stage")({
  component: DOIStagePage,
});

/* ── Stage icon map ─────────────────────────────────────────────────────── */
const STAGE_ICONS: Record<string, React.ElementType> = {
  "strategic-planning": TrendingUp,
  budget: BarChart3,
  "operative-planning": Users,
  execution: Zap,
  monitoring: Target,
};

/* ── Toast ──────────────────────────────────────────────────────────────── */
function Toast({
  message,
  visible,
  onHide,
}: {
  message: string;
  visible: boolean;
  onHide: () => void;
}) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, 3500);
    return () => clearTimeout(t);
  }, [visible, onHide]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-rag-green/30 bg-card px-5 py-4 shadow-elevated transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rag-green/10">
        <CheckCircle2 className="h-4 w-4 text-rag-green" />
      </div>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

/* ── Work Package Row ───────────────────────────────────────────────────── */
function WorkPackageRow({
  label,
  description,
  index,
  checked,
  onToggle,
  editable,
  accentGradient,
}: {
  label: string;
  description: string;
  index: number;
  checked: boolean;
  onToggle: () => void;
  editable: boolean;
  accentGradient: string;
}) {
  return (
    <div
      onClick={editable ? onToggle : undefined}
      className={cn(
        "group flex items-start gap-4 rounded-lg border px-5 py-4 transition-all duration-150",
        editable ? "cursor-pointer" : "cursor-default",
        checked
          ? "border-rag-green/30 bg-rag-green/5"
          : "border-border bg-card hover:border-brand/20 hover:bg-muted/30"
      )}
    >
      {/* Custom checkbox */}
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-150",
          checked
            ? "border-rag-green bg-rag-green text-white"
            : "border-border bg-card"
        )}
      >
        {checked && (
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Number badge */}
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
          checked
            ? "bg-rag-green/20 text-emerald-700 dark:text-emerald-400"
            : "bg-muted text-muted-foreground"
        )}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "text-sm font-semibold leading-tight transition-colors",
            checked
              ? "text-muted-foreground line-through decoration-rag-green/50"
              : "text-foreground"
          )}
        >
          {label}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>

      {checked && (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rag-green" />
      )}
    </div>
  );
}

/* ── Narrative Textarea ─────────────────────────────────────────────────── */
function NarrativeField({
  icon,
  title,
  accent,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  icon: React.ReactNode;
  title: string;
  accent: "success" | "brand" | "danger";
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const topColors = {
    success: "bg-rag-green",
    brand: "bg-brand",
    danger: "bg-rag-red",
  };
  const iconColors = {
    success: "text-rag-green",
    brand: "text-brand-deep",
    danger: "text-rag-red",
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className={`h-1 w-full ${topColors[accent]}`} />
      <div className="px-4 py-4">
        <div
          className={cn(
            "mb-3 flex items-center gap-2 text-sm font-semibold",
            iconColors[accent]
          )}
        >
          {icon}
          {title}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-default disabled:opacity-70"
        />
        {value && (
          <div className="mt-3 space-y-1.5">
            {value
              .split("\n")
              .filter((l) => l.trim())
              .map((line, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className={cn(
                      "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                      topColors[accent]
                    )}
                  />
                  {line.trim()}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
function DOIStagePage() {
  const { id, stage: stageKey } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const editable = canEdit(user?.role);

  const project = PROJECTS.find((p) => p.id === id);
  const stageDef = getStageByKey(stageKey);
  const stagePageData = getStagePageData(stageKey);

  /* Form state */
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [criticalPoints, setCriticalPoints] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveAnim, setSaveAnim] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  /* Load from localStorage on mount / stage change */
  useEffect(() => {
    if (!project || !stagePageData) return;
    const stored = loadStageData(id, stageKey);
    if (stored) {
      if (stored.checked) setChecked(stored.checked);
      if (stored.startDate) setStartDate(stored.startDate);
      if (stored.endDate) setEndDate(stored.endDate);
      if (stored.results !== undefined) setResults(stored.results);
      if (stored.nextSteps !== undefined) setNextSteps(stored.nextSteps);
      if (stored.criticalPoints !== undefined)
        setCriticalPoints(stored.criticalPoints);
    } else {
      // seed narrative from project data on first visit
      setResults(project.results.join("\n"));
      setNextSteps(project.nextSteps.join("\n"));
      setCriticalPoints(project.criticalPoints.join("\n"));
    }
  }, [id, stageKey]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  /* Early return after hooks */
  if (!project || !stageDef || !stagePageData) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <h2 className="text-lg font-semibold">Stage not found</h2>
        <Link
          to="/projects/$id"
          params={{ id }}
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-deep hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to project
        </Link>
      </div>
    );
  }

  const workPackages = stagePageData.workPackages;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalItems = workPackages.length;
  const completionPct =
    totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const accentGradient = STAGE_GRADIENT[stageDef.accent];
  const softColor = STAGE_SOFT_COLORS[stageDef.accent];
  const StageIcon = STAGE_ICONS[stageKey] ?? Target;

  const handleToggle = (id: number) => {
    if (!editable) return;
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const buildFormData = (): DOIStageFormData => ({
    checked,
    startDate,
    endDate,
    results,
    nextSteps,
    criticalPoints,
  });

  const handleSave = () => {
    saveStageData(id, stageKey, buildFormData());
    setSaved(true);
    setSaveAnim(true);
    showToast("Draft saved successfully");
    setTimeout(() => setSaveAnim(false), 1500);
  };

  const handleSubmit = () => {
    saveStageData(id, stageKey, buildFormData());
    showToast(`${stageDef.title} submitted!`);
    setTimeout(() => {
      if (stagePageData.nextRoute) {
        navigate({
          to: "/projects/$id/doi/$stage",
          params: { id, stage: stagePageData.nextRoute },
        });
      } else {
        navigate({ to: "/projects/$id", params: { id } });
      }
    }, 1200);
  };

  /* SVG ring */
  const R = 28;
  const circ = 2 * Math.PI * R;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to="/projects/$id"
          params={{ id }}
          className="hover:text-foreground"
        >
          {project.serviceArea}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">
          DOI · {stageDef.title}
        </span>
      </div>

      {/* ── 5-Stage Timeline ── */}
      <Card className="overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r ${accentGradient}`} />
        <div className="px-6 py-4">
          <div className="flex items-center">
            {DOI_STAGES.map((s, i) => {
              const isCurrent = s.key === stageKey;
              const isComplete = s.stage < stageDef.stage;
              const grad = STAGE_GRADIENT[s.accent];
              const Icon = STAGE_ICONS[s.key] ?? Target;
              return (
                <div key={s.key} className="flex flex-1 items-center">
                  <Link
                    to="/projects/$id/doi/$stage"
                    params={{ id, stage: s.key }}
                    className="group flex flex-col items-center gap-1.5 flex-1"
                  >
                    <div
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200",
                        isCurrent
                          ? `bg-gradient-to-br ${grad} text-white shadow-elevated scale-110 ring-2 ring-offset-2 ring-brand/30`
                          : isComplete
                            ? "bg-rag-green text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      {isCurrent && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-card" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "hidden text-center text-[10px] font-medium leading-tight md:block max-w-[72px]",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[9px] md:block",
                        isCurrent
                          ? "text-brand-deep font-semibold"
                          : isComplete
                            ? "text-rag-green"
                            : "text-muted-foreground"
                      )}
                    >
                      {isCurrent
                        ? "Current"
                        : isComplete
                          ? "Done"
                          : `Stage ${s.stage}`}
                    </span>
                  </Link>
                  {i < DOI_STAGES.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 mx-1 mb-5 rounded-full",
                        isComplete ? "bg-rag-green" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Stage Header ── */}
      <Card className="overflow-hidden">
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`} />
        <div className="flex flex-wrap items-start justify-between gap-6 p-6">
          <div className="flex items-start gap-5">
            {/* SVG completion ring */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r={R}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="5"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={R}
                  fill="none"
                  stroke={
                    completionPct === 100
                      ? "var(--color-rag-green)"
                      : "var(--color-brand)"
                  }
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - completionPct / 100)}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-bold leading-none">
                  {completionPct}%
                </span>
                <span className="mt-0.5 text-[9px] text-muted-foreground uppercase tracking-wide">
                  done
                </span>
              </div>
            </div>

            <div>
              <div
                className={cn(
                  "mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  softColor
                )}
              >
                <StageIcon className="h-3 w-3" />
                Stage {stageDef.stage} of 5
              </div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {stagePageData.pageTitle}
              </h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground leading-relaxed">
                {stagePageData.pageSubtitle}
              </p>
              {/* Mini progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                      accentGradient
                    )}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {checkedCount} / {totalItems} items complete
                </span>
              </div>
            </div>
          </div>

          {/* ── Date pickers ── */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stage Start Date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value > endDate) setEndDate("");
                    setSaved(false);
                  }}
                  disabled={!editable}
                  className="h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stage End Date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSaved(false);
                  }}
                  disabled={!editable || !startDate}
                  className="h-9 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>
            {/* Date summary chip */}
            {startDate && endDate && (
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 text-brand" />
                <span>
                  {new Date(startDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  {" → "}
                  {new Date(endDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Work Package Checklist ── */}
      <Card>
        <CardHeader
          title="Work Package Checklist"
          subtitle={`${checkedCount} of ${totalItems} items completed · click to toggle`}
          action={
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                completionPct === 100
                  ? "bg-rag-green/10 text-emerald-700 border-rag-green/30 dark:text-emerald-400"
                  : softColor
              )}
            >
              {completionPct === 100
                ? "✓ All Complete"
                : `${completionPct}% Done`}
            </span>
          }
        />
        <div className="space-y-2 p-5">
          {workPackages.map((wp) => (
            <WorkPackageRow
              key={wp.id}
              label={wp.label}
              description={wp.description}
              index={wp.id - 1}
              checked={!!checked[wp.id]}
              onToggle={() => handleToggle(wp.id)}
              editable={editable}
              accentGradient={accentGradient}
            />
          ))}
        </div>
        {/* Bottom progress strip */}
        <div className="border-t border-border bg-surface px-5 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Stage completion</span>
            <span className="font-semibold">{completionPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                accentGradient
              )}
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* ── Narrative Section ── */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Stage Narrative</span>
          {!editable && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              <Lock className="h-2.5 w-2.5" /> View only
            </span>
          )}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <NarrativeField
            icon={<Target className="h-4 w-4" />}
            title="Results since last update"
            accent="success"
            value={results}
            onChange={(v) => {
              setResults(v);
              setSaved(false);
            }}
            disabled={!editable}
            placeholder="One result per line..."
          />
          <NarrativeField
            icon={<ClipboardList className="h-4 w-4" />}
            title="Next steps until next update"
            accent="brand"
            value={nextSteps}
            onChange={(v) => {
              setNextSteps(v);
              setSaved(false);
            }}
            disabled={!editable}
            placeholder="One action item per line..."
          />
          <NarrativeField
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Critical open points & decisions"
            accent="danger"
            value={criticalPoints}
            onChange={(v) => {
              setCriticalPoints(v);
              setSaved(false);
            }}
            disabled={!editable}
            placeholder="One critical point per line..."
          />
        </div>
      </div>

      {/* ── All Stages Quick Nav ── */}
      <Card>
        <CardHeader title="All DOI Stages" subtitle="Navigate between stages" />
        <div className="grid gap-2 p-4 sm:grid-cols-5">
          {DOI_STAGES.map((s) => {
            const isCurrent = s.key === stageKey;
            const isComplete = s.stage < stageDef.stage;
            const grad = STAGE_GRADIENT[s.accent];
            const soft = STAGE_SOFT_COLORS[s.accent];
            const Icon = STAGE_ICONS[s.key] ?? Target;
            return (
              <Link
                key={s.key}
                to="/projects/$id/doi/$stage"
                params={{ id, stage: s.key }}
                className={cn(
                  "group relative overflow-hidden rounded-lg border p-3 transition-all duration-150 hover:shadow-elevated",
                  isCurrent
                    ? "border-brand/30 bg-brand-soft"
                    : "border-border bg-surface hover:bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r",
                    grad
                  )}
                />
                <div
                  className={cn(
                    "mb-2 flex h-7 w-7 items-center justify-center rounded-full",
                    isCurrent
                      ? `bg-gradient-to-br ${grad} text-white`
                      : isComplete
                        ? "bg-rag-green text-white"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="text-[11px] font-semibold leading-tight text-foreground">
                  {s.title}
                </div>
                <div
                  className={cn(
                    "mt-1 text-[10px]",
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
                </div>
                <ChevronRight className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </Link>
            );
          })}
        </div>
      </Card>

      {/* ── Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-card">
        <div className="flex items-center gap-2">
          <Link to="/projects/$id" params={{ id }}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" /> Project
            </Button>
          </Link>
          {stagePageData.prevRoute && (
            <Link
              to="/projects/$id/doi/$stage"
              params={{ id, stage: stagePageData.prevRoute }}
            >
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" /> Prev Stage
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-rag-green animate-fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={saveAnim ? "border-rag-green text-rag-green" : ""}
            >
              <Save className="h-4 w-4" />
              {saveAnim ? "Saved!" : "Save Draft"}
            </Button>
          )}
          {editable && (
            <Button size="sm" onClick={handleSubmit}>
              {stagePageData.nextRoute ? (
                <>
                  Submit &amp; Continue <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Complete DOI <Flag className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
          {!editable && stagePageData.nextRoute && (
            <Link
              to="/projects/$id/doi/$stage"
              params={{ id, stage: stagePageData.nextRoute }}
            >
              <Button size="sm" variant="outline">
                Next Stage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
