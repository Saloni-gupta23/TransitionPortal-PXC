import { createFileRoute } from "@tanstack/react-router";
import { USERS, ROLE_LABEL } from "@/data/mock";
import { Button, Card } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/_app/users")({ component: Users });

function Users() {
  return (
    <div>
      <PageHeader title="Users" subtitle={`${USERS.length} users across all roles`} actions={<Button size="sm"><UserPlus className="h-4 w-4" /> Invite user</Button>} />
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="text-left"><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Role</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3" /></tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero text-[11px] font-semibold text-brand-foreground">{u.initials}</div><span className="font-medium">{u.name}</span></div></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 text-xs">{ROLE_LABEL[u.role]}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1 rounded-full border border-rag-green/30 bg-rag-green/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-rag-green" />Active</span></td>
                <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
