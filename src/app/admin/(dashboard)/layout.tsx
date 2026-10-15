import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase";
import AdminShell from "./AdminShell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const hasServiceRoleKey = isSupabaseServiceRoleConfigured();

  return (
    <AdminShell hasServiceRoleKey={hasServiceRoleKey}>
      {children}
    </AdminShell>
  );
}
