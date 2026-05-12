import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("pc.session.userId");
      if (!id) throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
