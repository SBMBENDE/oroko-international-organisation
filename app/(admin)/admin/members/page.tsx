import Link from "next/link";
import { redirect } from "next/navigation";
import { UserPlus, Download, Users } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getMembers, getDistinctMemberFilters } from "@/lib/dal/admin-members";
import { getMembershipTypes } from "@/lib/dal/membership-types";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MemberFilterBar } from "@/components/admin/members/MemberFilterBar";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AdminMembersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.MEMBERS_MANAGE)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ members, total, pages }, { countries }, membershipTypes] = await Promise.all([
    getMembers({
      q: params.q,
      status: params.status,
      membershipType: params.membershipType,
      country: params.country,
      page,
      limit: 20,
    }),
    getDistinctMemberFilters(),
    getMembershipTypes(),
  ]);

  function buildHref(p: number) {
    const sp = new URLSearchParams(params as Record<string, string>);
    sp.set("page", String(p));
    return `/admin/members?${sp.toString()}`;
  }

  const exportQuery = new URLSearchParams(params as Record<string, string>).toString();

  return (
    <div>
      <PageHeader
        title="Members"
        description={`${total} member${total === 1 ? "" : "s"} in the organization`}
        action={
          <div className="flex gap-2">
            <a href={`/api/admin/members/export?${exportQuery}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Download className="size-4" /> Export CSV
            </a>
            <Link href="/admin/members/new" className={buttonVariants({ size: "sm" })}>
              <UserPlus className="size-4" /> Add Member
            </Link>
          </div>
        }
      />

      <MemberFilterBar membershipTypes={membershipTypes} countries={countries} />

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description="Try adjusting your search or filters, or add the first member."
          action={<Link href="/admin/members/new" className={buttonVariants({ size: "sm" })}>Add Member</Link>}
        />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Member</th>
              <th>Member ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Country</th>
              <th>Joined</th>
              <th />
            </AdminTableHead>
            <tbody>
              {members.map((m) => (
                <AdminTableRow key={m.id}>
                  <td>
                    <p className="font-medium text-oroko-black">{m.firstName} {m.lastName}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </td>
                  <td className="font-mono text-xs">{m.orokoId}</td>
                  <td className="capitalize">{m.membershipType}</td>
                  <td><StatusBadge status={m.status} /></td>
                  <td>{m.country ?? "—"}</td>
                  <td>{new Date(m.memberSince).toLocaleDateString()}</td>
                  <td className="text-right">
                    <Link href={`/admin/members/${m.id}`} className="text-oroko-green hover:underline text-xs font-medium">
                      View
                    </Link>
                  </td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={buildHref} />
        </>
      )}
    </div>
  );
}
