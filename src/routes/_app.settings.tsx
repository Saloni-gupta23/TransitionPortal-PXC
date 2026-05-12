import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL } from "@/data/mock";
import { Button, Card, CardHeader } from "@/components/ui-kit";
import { PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

const INPUT = "h-9 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30";

function Settings() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Profile, security and notification preferences" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Profile" />
          <div className="grid gap-3 p-5 md:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-medium">Full name</label><input className={INPUT} defaultValue={user?.name} /></div>
            <div><label className="mb-1.5 block text-xs font-medium">Email</label><input className={INPUT} defaultValue={user?.email} /></div>
            <div className="md:col-span-2"><label className="mb-1.5 block text-xs font-medium">Role</label><input className={INPUT} value={user ? ROLE_LABEL[user.role] : ""} disabled /></div>
            <div className="md:col-span-2"><Button>Save changes</Button></div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Security" />
          <div className="grid gap-3 p-5">
            <div><label className="mb-1.5 block text-xs font-medium">Current password</label><input type="password" className={INPUT} placeholder="••••••••" /></div>
            <div><label className="mb-1.5 block text-xs font-medium">New password</label><input type="password" className={INPUT} /></div>
            <Button variant="outline">Update password</Button>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Notifications" />
          <div className="divide-y divide-border">
            {["Approval requests", "Deadline reminders", "Overdue tasks", "Risk escalations", "Assignment alerts"].map((n) => (
              <label key={n} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{n}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
