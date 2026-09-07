import { redirect } from "next/navigation";
import { IdCard } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getMembers } from "@/lib/dal/admin-members";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ReissueIdButton } from "@/components/admin/members/ReissueIdButton";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MemberIdsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.MEMBERS_MANAGE)) redirect("/admin");
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { members, total, pages } = await getMembers({ page, limit: 25, sort: "orokoId" });

  return (
    <div>
      <PageHeader title="Member IDs" description={`${total} OROKO Member ID${total === 1 ? "" : "s"} issued`} />

      {members.length === 0 ? (
        <EmptyState icon={IdCard} title="No member IDs issued yet" />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Member ID</th>
              <th>Member</th>
              <th>Status</th>
              <th />
            </AdminTableHead>
            <tbody>
              {members.map((m) => (
                <AdminTableRow key={m.id}>
                  <td className="font-mono">{m.orokoId}</td>
                  <td>{m.firstName} {m.lastName}</td>
                  <td><StatusBadge status={m.status} /></td>
                  <td className="text-right"><ReissueIdButton memberId={m.id} /></td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/member-ids?page=${p}`} />
        </>
      )}
    </div>
  );
}
