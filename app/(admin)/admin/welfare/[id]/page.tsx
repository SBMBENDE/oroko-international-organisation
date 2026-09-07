import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminWelfareDetail } from "@/lib/dal/admin-welfare";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WelfareReviewActions } from "@/components/admin/welfare/WelfareReviewActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WelfareDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.WELFARE_VIEW)) redirect("/admin");
  const { id } = await params;
  const request = await getAdminWelfareDetail(id);
  if (!request) notFound();

  return (
    <div>
      <PageHeader
        title={`${request.member.firstName} ${request.member.lastName}`}
        description={request.member.email}
        action={<StatusBadge status={request.status} />}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="capitalize">{request.requestType.replace(/_/g, " ")} Assistance</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-oroko-black whitespace-pre-wrap">{request.description}</p>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-muted-foreground">Amount Requested</span>
                <span>{request.amountRequested ? `${request.currency} ${request.amountRequested.toLocaleString()}` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Approved</span>
                <span>{request.amountApproved ? `${request.currency} ${request.amountApproved.toLocaleString()}` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <StatusBadge status={request.paymentStatus} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {request.internalNotes.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[...request.internalNotes].reverse().map((note, i) => (
                    <li key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
                      <p className="text-oroko-black whitespace-pre-wrap">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{note.authorName} · {new Date(note.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>Review</CardTitle></CardHeader>
          <CardContent><WelfareReviewActions id={id} status={request.status} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
