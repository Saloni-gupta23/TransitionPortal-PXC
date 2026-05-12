import { createFileRoute } from "@tanstack/react-router";
import { AUDIT } from "@/data/mock";
import { Card } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/audit")({ component: Audit });

function Audit() {
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Full traceability across the platform" />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3 font-medium">Timestamp</th><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Entity</th><th className="px-4 py-3 font-medium">Action</th><th className="px-4 py-3 font-medium">Before → After</th></tr>
          </thead>
          <tbody>
            {AUDIT.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 text-xs">{a.ts}</td>
                <td className="px-4 py-3 text-xs font-medium">{a.user}</td>
                <td className="px-4 py-3"><span className="rounded bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-deep">{a.entity}</span></td>
                <td className="px-4 py-3 text-xs">{a.action}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{a.before ? `${a.before} → ${a.after}` : a.after ?? a.comment ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
