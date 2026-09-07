import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getMembershipTypes } from "@/lib/dal/membership-types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { NewMemberForm } from "@/components/admin/members/NewMemberForm";

export default async function NewMemberPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.MEMBERS_MANAGE)) redirect("/admin");
  const membershipTypes = await getMembershipTypes(true);

  return (
    <div>
      <PageHeader title="Add Member" description="Create an individual member account directly." />
      <Card><CardContent className="pt-4"><NewMemberForm membershipTypes={membershipTypes} /></CardContent></Card>
    </div>
  );
}
