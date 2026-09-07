import Link from "next/link";
import { redirect } from "next/navigation";
import { HeartHandshake, Plus } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminWelfareRequests } from "@/lib/dal/admin-welfare";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function WelfarePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.WELFARE_VIEW)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { requests, total, pages } = await getAdminWelfareRequests({ status: params.status, page });

  return (
    <div>
      <PageHeader
        title="Welfare &amp; Assistance"
        description={`${total} request${total === 1 ? "" : "s"}`}
        action={<Link href="/admin/welfare/new" className={buttonVariants({ size: "sm" })}><Plus className="size-4" /> Create Request</Link>}
      />

      {requests.length === 0 ? (
        <EmptyState icon={HeartHandshake} title="No welfare requests yet" />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Member</th>
              <th>Type</th>
              <th>Requested</th>
              <th>Approved</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </AdminTableHead>
            <tbody>
              {requests.map((r) => (
                <AdminTableRow key={r.id}>
                  <td className="font-medium text-oroko-black">{r.memberName}</td>
                  <td className="capitalize">{r.requestType.replace(/_/g, " ")}</td>
                  <td>{r.amountRequested ? `${r.currency} ${r.amountRequested.toLocaleString()}` : "—"}</td>
                  <td>{r.amountApproved ? `${r.currency} ${r.amountApproved.toLocaleString()}` : "—"}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="text-right"><Link href={`/admin/welfare/${r.id}`} className="text-oroko-green hover:underline text-xs font-medium">Review</Link></td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/welfare?${params.status ? `status=${params.status}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}
