import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart } from "lucide-react";
import { Button, Card, CardHeader, KpiCard } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";
import { PROJECTS } from "@/data/mock";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

const REPORTS = [
  { id: "ssc", title: "SSC Overview", desc: "Portfolio split across TSSC, CSSC, ITSSC with status mix" },
  { id: "fte", title: "FTE Status", desc: "Required vs onboarded headcount across all transitions" },
  { id: "status", title: "Project Status", desc: "RAG and overall status by unit and vertical" },
  { id: "doi", title: "DOI Summary", desc: "Stage distribution and DOI velocity trends" },
  { id: "risk", title: "Risk Summary", desc: "Severity heatmap, top risks and mitigation status" },
  { id: "cap", title: "Capacity Summary", desc: "New, relocation, ramp-up and replacement breakdown" },
];

function Reports() {
  const total = PROJECTS.length;
  const fte = PROJECTS.reduce((s, p) => s + p.requiredFTE, 0);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Executive-ready reports across the SSC India portfolio"
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download all (PDF)</Button>}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Reports Available" value={REPORTS.length} accent="brand" />
        <KpiCard label="Projects in Scope" value={total} accent="teal" />
        <KpiCard label="FTE Tracked" value={fte} accent="success" />
        <KpiCard label="Last Refresh" value="Today" accent="warning" hint="Auto-refreshed hourly" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <Card key={r.id} className="transition-shadow hover:shadow-elevated">
            <div className="flex h-full flex-col p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
                <FileBarChart className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <div className="mt-5 flex items-center gap-2">
                <Button size="sm">Generate</Button>
                <Button size="sm" variant="outline">Excel</Button>
                <Button size="sm" variant="outline">PDF</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Custom Report Builder" subtitle="Filter by SSC, vertical, status and DOI stage" />
        <div className="grid gap-3 p-5 md:grid-cols-4">
          <select className="h-9 rounded-md border border-border bg-card px-3 text-sm"><option>All SSC types</option><option>TSSC</option><option>CSSC</option><option>ITSSC</option></select>
          <select className="h-9 rounded-md border border-border bg-card px-3 text-sm"><option>All verticals</option><option>Finance</option><option>IT</option><option>Engineering</option></select>
          <select className="h-9 rounded-md border border-border bg-card px-3 text-sm"><option>All statuses</option><option>In Process</option><option>Hold</option><option>Cut Over</option></select>
          <Button>Generate Report</Button>
        </div>
      </Card>
    </div>
  );
}
