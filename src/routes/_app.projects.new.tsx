import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button, Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/projects/new")({
  component: NewProject,
});

const STEPS = ["Service", "Capacity & Dates", "Team", "Review"];

function NewProject() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  return (
    <div>
      <PageHeader title="Create Transition Project" subtitle="Capture the essential information to onboard a new SSC India transition" />

      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i < step ? "bg-rag-green text-white" : i === step ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`truncate text-sm font-medium ${i === step ? "" : "text-muted-foreground"}`}>{s}</div>
              {i < STEPS.length - 1 && <div className="mt-2 h-px w-full bg-border" />}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader title={STEPS[step]} />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {step === 0 && (
            <>
              <Field label="Unit"><select className={INPUT}><option>PxC DE</option><option>PxC USA</option><option>PxC FR</option><option>PxC IT</option></select></Field>
              <Field label="Vertical"><select className={INPUT}><option>Finance</option><option>IT</option><option>Engineering</option><option>HR</option><option>Procurement</option></select></Field>
              <Field label="Service Area"><input className={INPUT} placeholder="e.g., Accounts Payable" /></Field>
              <Field label="Job Position"><input className={INPUT} placeholder="e.g., AP Specialist" /></Field>
              <Field label="SSC Type"><select className={INPUT}><option>TSSC</option><option>CSSC</option><option>ITSSC</option></select></Field>
              <Field label="Required FTE"><input type="number" min={1} defaultValue={3} className={INPUT} /></Field>
            </>
          )}
          {step === 1 && (
            <>
              <Field label="Capacity Type"><select className={INPUT}><option>New Capacity</option><option>Relocation from HQ</option><option>Ramp-up</option><option>Replacement</option></select></Field>
              <Field label="Planned Start at SSC"><input type="date" className={INPUT} /></Field>
              <Field label="Cutover Date"><input type="date" className={INPUT} /></Field>
              <Field label="Hypercare Start"><input type="date" className={INPUT} /></Field>
              <Field label="Hypercare End"><input type="date" className={INPUT} /></Field>
              <Field label="Initial Risks / Dependencies" full><textarea rows={3} className={INPUT} placeholder="List initial risks, dependencies or assumptions" /></Field>
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Responsible SSC (India)"><input className={INPUT} defaultValue="Anis Mohanty" /></Field>
              <Field label="Responsible HQ"><input className={INPUT} placeholder="Stakeholder at HQ" /></Field>
              <Field label="Transition Owner"><input className={INPUT} defaultValue="Anis Mohanty" /></Field>
              <Field label="Transition Support"><input className={INPUT} defaultValue="Susanta Behra" /></Field>
            </>
          )}
          {step === 3 && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Review and submit. The project will be created in Yet to Start status, with DOI initialized at Stage 1.</p>
              <div className="mt-4 rounded-lg border border-dashed border-border bg-surface p-4 text-sm">
                Ready to create the new transition. After submission you will be redirected to the project detail page where you can begin DOI tracking.
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-surface px-5 py-3">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="h-4 w-4" /></Button>
          ) : (
            <Button onClick={() => nav({ to: "/projects" })}><Check className="h-4 w-4" /> Create Project</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

const INPUT = "h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}
