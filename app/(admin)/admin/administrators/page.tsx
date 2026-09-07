import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS, ROLE_LABELS } from "@/lib/permissions";
import { getAdministrators } from "@/lib/dal/admin-administrators";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignAdministratorForm } from "@/components/admin/administrators/AssignAdministratorForm";
import { RevokeAccessButton } from "@/components/admin/administrators/RevokeAccessButton";
import { ShieldCheck } from "lucide-react";

export default async function AdministratorsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.ADMINISTRATORS_MANAGE)) {
    redirect("/admin");
  }
  const administrators = await getAdministrators();

  return (
    <div>
      <PageHeader title="Administrators" description="Manage who has administrative access and what they can do." />

      <Card className="mb-6">
        <CardHeader><CardTitle>Assign a Role</CardTitle></CardHeader>
        <CardContent>
          <AssignAdministratorForm />
        </CardContent>
      </Card>

      {administrators.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No administrators yet" description="Assign a role above to get started." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Administrator</th>
            <th>Role</th>
            <th>Status</th>
            <th />
          </AdminTableHead>
          <tbody>
            {administrators.map((a) => (
              <AdminTableRow key={a.id}>
                <td>
                  <p className="font-medium text-oroko-black">{a.firstName} {a.lastName}</p>
                  <p className="text-xs text-muted-foreground">{a.email}</p>
                </td>
                <td><Badge variant="outline">{ROLE_LABELS[a.role] ?? a.role}</Badge></td>
                <td>{a.isActive ? "Active" : "Inactive"}</td>
                <td className="text-right">
                  {a.id !== session?.user.id && <RevokeAccessButton userId={a.id} />}
                </td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
