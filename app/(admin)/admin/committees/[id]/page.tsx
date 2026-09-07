import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getCommitteeDetail } from "@/lib/dal/admin-committees";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CommitteeFormDialog } from "@/components/admin/committees/CommitteeFormDialog";
import { CommitteeMembersManager } from "@/components/admin/committees/CommitteeMembersManager";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CommitteeDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.COMMITTEE_MANAGE)) redirect("/admin");
  const { id } = await params;
  const detail = await getCommitteeDetail(id);
  if (!detail) notFound();

  const { committee, members } = detail;

  return (
    <div>
      <PageHeader
        title={committee.name}
        description={committee.mandate}
        action={<CommitteeFormDialog mode="edit" committeeId={id} defaultValues={committee} trigger={<Button size="sm" variant="outline">Edit Committee</Button>} />}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {committee.description || "No description provided."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Members</CardTitle></CardHeader>
          <CardContent><CommitteeMembersManager committeeId={id} members={members} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
