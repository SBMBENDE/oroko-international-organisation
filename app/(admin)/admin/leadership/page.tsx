import { redirect } from "next/navigation";
import { Crown } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getLeadershipRoles, getLeadershipMembers } from "@/lib/dal/admin-leadership";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadershipForms } from "@/components/admin/leadership/LeadershipForms";
import { ToggleLeadershipButton } from "@/components/admin/leadership/ToggleLeadershipButton";

export default async function LeadershipPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.LEADERSHIP_MANAGE)) redirect("/admin");
  const [roles, members] = await Promise.all([getLeadershipRoles(), getLeadershipMembers()]);

  return (
    <div>
      <PageHeader title="Leadership" description="Leadership positions assigned to individual members." />

      <div className="mb-6">
        <LeadershipForms roles={roles.map((r) => ({ id: r.id, name: r.name }))} />
      </div>

      {members.length === 0 ? (
        <EmptyState icon={Crown} title="No leadership positions assigned yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Member</th>
            <th>Position</th>
            <th>Term</th>
            <th>Status</th>
            <th />
          </AdminTableHead>
          <tbody>
            {members.map((m) => (
              <AdminTableRow key={m.id}>
                <td>
                  <p className="font-medium text-oroko-black">{m.userName}</p>
                  <p className="text-xs text-muted-foreground">{m.userEmail}</p>
                </td>
                <td>{m.roleName}</td>
                <td>{m.term}</td>
                <td><StatusBadge status={m.isActive ? "active" : "resigned"} /></td>
                <td className="text-right"><ToggleLeadershipButton id={m.id} isActive={m.isActive} /></td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
