import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export default async function NewProjectPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.PROJECTS_MANAGE)) redirect("/admin");
  return (
    <div>
      <PageHeader title="Create Project" description="New projects start with Planned status." />
      <Card><CardContent className="pt-4"><ProjectForm /></CardContent></Card>
    </div>
  );
}
