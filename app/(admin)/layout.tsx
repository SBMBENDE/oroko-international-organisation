import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/permissions";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminNotificationCount } from "@/lib/dal/admin-dashboard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side authorization guard — never rely on hiding sidebar links alone.
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin");
  }
  if (!isAdminRole(session.user.role)) {
    redirect("/portal");
  }

  const notificationCount = await getAdminNotificationCount(session.user.role);

  return (
    <AdminShell
      userName={session.user.name ?? "Administrator"}
      userRole={session.user.role}
      notificationCount={notificationCount}
    >
      {children}
    </AdminShell>
  );
}
