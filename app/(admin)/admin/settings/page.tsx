import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getOrgSettings } from "@/lib/dal/org-settings";
import { getMembershipTypes } from "@/lib/dal/membership-types";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrgSettingsForm } from "@/components/admin/settings/OrgSettingsForm";
import { MembershipTypeManager } from "@/components/admin/settings/MembershipTypeManager";

export default async function SettingsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.SETTINGS_MANAGE)) {
    redirect("/admin");
  }

  const [settings, membershipTypes] = await Promise.all([getOrgSettings(), getMembershipTypes()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Organization information, membership configuration, and system preferences." />

      <Card>
        <CardHeader><CardTitle>Organization Information</CardTitle></CardHeader>
        <CardContent><OrgSettingsForm defaultValues={settings} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Membership Types</CardTitle></CardHeader>
        <CardContent><MembershipTypeManager types={membershipTypes} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Administrator Management</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage administrator roles and permissions from the dedicated{" "}
            <a href="/admin/administrators" className="text-oroko-green underline">Administrators</a> page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
