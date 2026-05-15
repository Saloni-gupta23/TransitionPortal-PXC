/**
 * routes/_app.projects.new.tsx
 *
 * Create Transition — 5-step wizard.
 *
 * Steps:
 *  0 – Service Details   (unit, vertical, service area, job position, SSC type)
 *  1 – Capacity & Dates  (FTE, capacity type, dates, status, RAG)
 *  2 – DOI Plan          (per-stage start/end dates)
 *  3 – Team              (responsible SSC + HQ)
 *  4 – Review & Create
 *
 * The route is intentionally thin: it owns state and navigation only.
 * All UI is delegated to the components under components/create-transition/.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";

import { Button, Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";
import { StepIndicator } from "@/components/create-transition/StepIndicator";
import { DOIPlanner } from "@/components/create-transition/DOIPlanner";
import type { DOIPlan } from "@/components/create-transition/DOIPlanner";
import { ReviewSummary } from "@/components/create-transition/ReviewSummary";
import {
  Field,
  TextInput,
  SelectInput,
  Textarea,
} from "@/components/create-transition/TransitionFormFields";
import {
  BUSINESS_UNITS,
  VERTICALS,
  SSC_TYPES,
  CAPACITY_TYPES,
  RESPONSIBLE_SSC_MEMBERS,
  RESPONSIBLE_HQ_MEMBERS,
  OVERALL_STATUSES,
  RAG_OPTIONS,
} from "@/data/transitionData";

export const Route = createFileRoute("/_app/projects/new")({
  component: NewProject,
});

/* ── Form shape ─────────────────────────────────────────────────────────── */
export interface NewTransitionForm {
  // Step 0 – Service
  unit: string;
  vertical: string;
  serviceArea: string;
  jobPosition: string;
  sscType: string;
  // Step 1 – Capacity & Dates
  requiredFTE: number;
  capacityType: string;
  plannedStart: string;
  cutoverDate: string;
  hypercareStart: string;
  hypercareEnd: string;
  overallStatus: string;
  rag: string;
  // Step 2 – DOI Plan
  doiPlan: DOIPlan;
  // Step 3 – Team
  responsibleSSC: string;
  responsibleHQ: string;
}

const EMPTY_FORM: NewTransitionForm = {
  unit: "",
  vertical: "",
  serviceArea: "",
  jobPosition: "",
  sscType: "",
  requiredFTE: 1,
  capacityType: "",
  plannedStart: "",
  cutoverDate: "",
  hypercareStart: "",
  hypercareEnd: "",
  overallStatus: "Yet to Start",
  rag: "Green",
  doiPlan: {},
  responsibleSSC: "",
  responsibleHQ: "",
};

/* ── Component ──────────────────────────────────────────────────────────── */
function NewProject() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NewTransitionForm>(EMPTY_FORM);

  const set = <K extends keyof NewTransitionForm>(
    key: K,
    val: NewTransitionForm[K]
  ) => setForm((f) => ({ ...f, [key]: val }));

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleCreate = () => {
    // In a real app: call projectService.createProject(form) here
    nav({ to: "/projects" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Transition"
        subtitle="Capture the essential information to onboard a new SSC India transition"
      />

      {/* Step indicator */}
      <StepIndicator current={step} />

      <Card>
        {/* Step content */}
        <div className="p-6 space-y-4">
          {/* ── Step 0: Service Details ── */}
          {step === 0 && (
            <>
              <SectionTitle>Service Details</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Business Unit" required>
                  <SelectInput
                    value={form.unit}
                    onChange={(v) => set("unit", v)}
                    options={BUSINESS_UNITS}
                    placeholder="Select unit"
                  />
                </Field>

                <Field label="Vertical" required>
                  <SelectInput
                    value={form.vertical}
                    onChange={(v) => set("vertical", v)}
                    options={VERTICALS}
                    placeholder="Select vertical"
                  />
                </Field>

                <Field label="Service Area" required>
                  <TextInput
                    value={form.serviceArea}
                    onChange={(v) => set("serviceArea", v)}
                    placeholder="e.g., Accounts Payable"
                  />
                </Field>

                <Field label="Job Position / Service Profile" required>
                  <TextInput
                    value={form.jobPosition}
                    onChange={(v) => set("jobPosition", v)}
                    placeholder="e.g., AP Specialist"
                  />
                </Field>

                <Field label="SSC Type" required>
                  <SelectInput
                    value={form.sscType}
                    onChange={(v) => set("sscType", v)}
                    options={SSC_TYPES}
                    placeholder="Select SSC type"
                  />
                </Field>
              </div>
            </>
          )}

          {/* ── Step 1: Capacity & Dates ── */}
          {step === 1 && (
            <>
              <SectionTitle>Capacity & Dates</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Capacity Type" required>
                  <SelectInput
                    value={form.capacityType}
                    onChange={(v) => set("capacityType", v)}
                    options={CAPACITY_TYPES}
                    placeholder="Select type"
                  />
                </Field>

                <Field
                  label="Required FTE"
                  required
                  hint="Full-time equivalents needed"
                >
                  <TextInput
                    type="number"
                    value={form.requiredFTE}
                    onChange={(v) => set("requiredFTE", Number(v))}
                    min={0.5}
                    step={0.5}
                    placeholder="e.g. 3"
                  />
                </Field>

                <Field label="Planned Start at SSC" required>
                  <TextInput
                    type="date"
                    value={form.plannedStart}
                    onChange={(v) => set("plannedStart", v)}
                  />
                </Field>

                <Field label="Cutover Date" required>
                  <TextInput
                    type="date"
                    value={form.cutoverDate}
                    onChange={(v) => set("cutoverDate", v)}
                    min={form.plannedStart}
                  />
                </Field>

                <Field label="Hypercare Start">
                  <TextInput
                    type="date"
                    value={form.hypercareStart}
                    onChange={(v) => set("hypercareStart", v)}
                    min={form.cutoverDate}
                  />
                </Field>

                <Field label="Hypercare End">
                  <TextInput
                    type="date"
                    value={form.hypercareEnd}
                    onChange={(v) => set("hypercareEnd", v)}
                    min={form.hypercareStart}
                  />
                </Field>

                <Field label="Overall Status">
                  <SelectInput
                    value={form.overallStatus}
                    onChange={(v) => set("overallStatus", v)}
                    options={OVERALL_STATUSES}
                  />
                </Field>

                <Field label="RAG">
                  <SelectInput
                    value={form.rag}
                    onChange={(v) => set("rag", v)}
                    options={RAG_OPTIONS}
                  />
                </Field>
              </div>
            </>
          )}

          {/* ── Step 2: DOI Plan ── */}
          {step === 2 && (
            <>
              <SectionTitle>DOI Stage Plan</SectionTitle>
              <p className="text-sm text-muted-foreground -mt-2 mb-2">
                Set the planned start and end date for each of the 5 DOI stages.
                These can be updated later from the project detail page.
              </p>
              <DOIPlanner
                plan={form.doiPlan}
                onChange={(plan) => set("doiPlan", plan)}
                projectStart={form.plannedStart}
                projectEnd={form.hypercareEnd || form.cutoverDate}
              />
            </>
          )}

          {/* ── Step 3: Team ── */}
          {step === 3 && (
            <>
              <SectionTitle>Team Assignment</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Responsible SSC (India)" required>
                  <SelectInput
                    value={form.responsibleSSC}
                    onChange={(v) => set("responsibleSSC", v)}
                    options={RESPONSIBLE_SSC_MEMBERS}
                    placeholder="Select member"
                  />
                </Field>

                <Field label="Responsible HQ" required>
                  <SelectInput
                    value={form.responsibleHQ}
                    onChange={(v) => set("responsibleHQ", v)}
                    options={RESPONSIBLE_HQ_MEMBERS}
                    placeholder="Select member"
                  />
                </Field>
              </div>
            </>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <>
              <SectionTitle>Review & Confirm</SectionTitle>
              <ReviewSummary form={form} />
            </>
          )}
        </div>

        {/* ── Action bar ── */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {step < 4 ? (
            <Button size="sm" onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ── Small helper ────────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground pb-1 border-b border-border">
      {children}
    </h3>
  );
}
