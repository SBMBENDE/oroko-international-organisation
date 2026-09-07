import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getApplicationDetail } from "@/lib/dal/admin-applications";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ApplicationActions } from "@/components/admin/applications/ApplicationActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationReviewPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.APPLICATIONS_MANAGE)) redirect("/admin");
  const { id } = await params;
  const detail = await getApplicationDetail(id);
  if (!detail) notFound();

  const { membership, user } = detail;

  return (
    <div>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description={user.email}
        action={<StatusBadge status={membership.applicationStatus} />}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Submitted Information</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Full Name" value={`${user.firstName} ${user.lastName}`} />
              <Row label="Email" value={user.email} />
              <Row label="Phone" value={membership.phone} />
              <Row label="Country of Residence" value={membership.country} />
              <Row label="City" value={membership.city} />
              <Row label="Country of Origin" value={membership.countryOfOrigin} />
              <Row label="Profession" value={membership.profession} />
              <Row label="Organization" value={membership.organization} />
              <Row label="Membership Type Requested" value={membership.membershipType} />
              <Row label="Submitted" value={new Date(membership.createdAt).toLocaleString()} />
              {membership.infoRequestMessage && (
                <Row label="Info Requested" value={membership.infoRequestMessage} />
              )}
              {membership.rejectionReason && (
                <Row label="Rejection Reason" value={membership.rejectionReason} />
              )}
            </CardContent>
          </Card>

          {membership.internalNotes.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[...membership.internalNotes].reverse().map((note, i) => (
                    <li key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
                      <p className="text-oroko-black whitespace-pre-wrap">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.authorName} · {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>Review Decision</CardTitle></CardHeader>
          <CardContent>
            <ApplicationActions membershipId={membership._id.toString()} applicationStatus={membership.applicationStatus} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-oroko-black text-right">{value || "—"}</span>
    </div>
  );
}
