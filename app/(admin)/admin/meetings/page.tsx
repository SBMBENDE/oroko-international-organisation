import { redirect } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import GovernanceMeeting from "@/models/GovernanceMeeting";
import { getCommittees } from "@/lib/dal/admin-committees";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/badge";
import { MeetingFormDialog } from "@/components/admin/meetings/MeetingFormDialog";
import { MeetingRowActions } from "@/components/admin/meetings/MeetingRowActions";

const ORGAN_LABELS: Record<string, string> = {
  general_assembly: "General Assembly",
  executive: "Executive",
  committee: "Committee",
};

export default async function MeetingsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.GOVERNANCE_MANAGE)) redirect("/admin");
  await connectDB();
  const [meetings, committees] = await Promise.all([
    GovernanceMeeting.find({}).sort({ date: -1 }).populate("committee", "name").lean(),
    getCommittees(),
  ]);
  const committeeOptions = committees.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <PageHeader title="Meetings & Sessions" description="General Assembly, Executive, and committee sessions." action={<MeetingFormDialog committees={committeeOptions} />} />

      {meetings.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No sessions recorded yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Title</th>
            <th>Organ</th>
            <th>Date</th>
            <th>Status</th>
            <th>Visibility</th>
            <th />
          </AdminTableHead>
          <tbody>
            {meetings.map((m) => (
              <AdminTableRow key={m._id.toString()}>
                <td className="font-medium text-oroko-black max-w-xs truncate">{m.title}</td>
                <td>
                  {ORGAN_LABELS[m.organ] ?? m.organ}
                  {m.organ === "committee" && m.committee && "name" in m.committee ? ` · ${m.committee.name}` : ""}
                </td>
                <td className="text-muted-foreground">{new Date(m.date).toLocaleDateString()}</td>
                <td className="capitalize">{m.status.replace(/_/g, " ")}</td>
                <td>
                  <Badge variant="outline" className={m.isPublic ? "border-transparent bg-oroko-green/10 text-oroko-green" : "text-muted-foreground"}>
                    {m.isPublic ? "Published" : "Internal"}
                  </Badge>
                </td>
                <td>
                  <MeetingRowActions
                    meeting={{
                      id: m._id.toString(),
                      organ: m.organ,
                      committeeId: m.committee && "_id" in m.committee ? m.committee._id.toString() : undefined,
                      title: m.title,
                      sessionNumber: m.sessionNumber,
                      date: new Date(m.date).toISOString(),
                      endDate: m.endDate ? new Date(m.endDate).toISOString() : undefined,
                      venue: m.venue,
                      format: m.format,
                      status: m.status,
                      agendaItems: m.agendaItems ?? [],
                      minutes: m.minutes,
                      attendeeCount: m.attendeeCount,
                      isPublic: m.isPublic,
                    }}
                    committees={committeeOptions}
                  />
                </td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
