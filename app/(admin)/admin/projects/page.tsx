import Link from "next/link";
import { redirect } from "next/navigation";
import { FolderKanban, Plus } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminProjects } from "@/lib/dal/admin-projects";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminProjectsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.PROJECTS_MANAGE)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { projects, total, pages } = await getAdminProjects({ status: params.status, page });

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${total} project${total === 1 ? "" : "s"}`}
        action={<Link href="/admin/projects/new" className={buttonVariants({ size: "sm" })}><Plus className="size-4" /> Create Project</Link>}
      />

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create the first OROKO project." />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Project</th>
              <th>Category</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Funding</th>
              <th />
            </AdminTableHead>
            <tbody>
              {projects.map((p) => (
                <AdminTableRow key={p.id}>
                  <td className="font-medium text-oroko-black">
                    <Link href={`/admin/projects/${p.id}`} className="hover:underline">{p.title}{p.isFeatured && " ★"}</Link>
                  </td>
                  <td className="capitalize">{p.category.replace("_", " ")}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.progressPercent}%</td>
                  <td>{p.fundingGoal ? `$${p.fundingRaised.toLocaleString()} / $${p.fundingGoal.toLocaleString()}` : `$${p.fundingRaised.toLocaleString()}`}</td>
                  <td className="text-right">
                    <Link href={`/admin/projects/${p.id}`} className="text-oroko-green hover:underline text-xs font-medium">Manage</Link>
                  </td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/projects?${params.status ? `status=${params.status}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}
