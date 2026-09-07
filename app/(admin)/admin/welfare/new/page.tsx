import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { NewWelfareRequestForm } from "@/components/admin/welfare/NewWelfareRequestForm";

export default async function NewWelfareRequestPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.WELFARE_MANAGE)) redirect("/admin");
  return (
    <div>
      <PageHeader title="Create Welfare Request" description="Log a request on behalf of a member." />
      <Card><CardContent className="pt-4"><NewWelfareRequestForm /></CardContent></Card>
    </div>
  );
}
