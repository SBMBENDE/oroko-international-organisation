import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminProjectDetail } from "@/lib/dal/admin-projects";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { ProjectStatusSelect } from "@/components/admin/projects/ProjectStatusSelect";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.PROJECTS_MANAGE)) redirect("/admin");
  const { id } = await params;
  const project = await getAdminProjectDetail(id);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title={project.title} description={project.summary} action={<ProjectStatusSelect projectId={id} status={project.status} />} />
      <Card>
        <CardContent className="pt-4">
          <ProjectForm
            projectId={id}
            defaultValues={{
              ...project,
              fundingGoal: project.fundingGoal ? String(project.fundingGoal) : "",
              progressPercent: String(project.progressPercent),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
