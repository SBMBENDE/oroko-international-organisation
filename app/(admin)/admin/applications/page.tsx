import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getApplications } from "@/lib/dal/admin-applications";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

const STATUS_TABS = [
  { value: "", label: "Needs Attention" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "needs_information", label: "Needs Information" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.APPLICATIONS_MANAGE)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { applications, total, pages } = await getApplications({ status: params.status, page });

  return (
    <div>
      <PageHeader title="Membership Applications" description={`${total} application${total === 1 ? "" : "s"} matching this view`} />

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/applications${tab.value ? `?status=${tab.value}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
              (params.status ?? "") === tab.value
                ? "bg-oroko-black text-white border-oroko-black"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications here" description="New membership applications will appear as candidates register on the public site." />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Applicant</th>
              <th>Membership Type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th />
            </AdminTableHead>
            <tbody>
              {applications.map((a) => (
                <AdminTableRow key={a.id}>
                  <td>
                    <p className="font-medium text-oroko-black">{a.firstName} {a.lastName}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </td>
                  <td className="capitalize">{a.membershipType}</td>
                  <td><StatusBadge status={a.applicationStatus} /></td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <Link href={`/admin/applications/${a.id}`} className="text-oroko-green hover:underline text-xs font-medium">
                      Review
                    </Link>
                  </td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/applications?${params.status ? `status=${params.status}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}
