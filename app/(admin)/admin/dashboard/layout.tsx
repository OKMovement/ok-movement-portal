import { redirect } from "next/navigation";
import AdminDashboardShell from "@/components/admin/admin-dashboard-shell";
import { getCurrentAdminUser, requireAdminSession } from "@/lib/server/admin-guard";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  const admin = await getCurrentAdminUser();

  if (!admin) {
    redirect("/admin/sign-in");
  }

  return (
    <AdminDashboardShell
      admin={{
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }}
    >
      {children}
    </AdminDashboardShell>
  );
}
