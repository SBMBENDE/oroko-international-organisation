import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";

function toCsvValue(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.EVENTS_MANAGE)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  const event = await Event.findById(id).lean();
  const registrations = await EventRegistration.find({ event: id }).sort({ createdAt: -1 }).lean();

  const headers = ["Name", "Email", "Quantity", "Status", "Registration Code", "Checked In"];
  const rows = registrations.map((r) => [
    r.attendeeName, r.attendeeEmail, r.quantity, r.status, r.registrationCode,
    r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : "",
  ]);
  const csv = [headers, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event?.slug ?? "event"}-attendees.csv"`,
    },
  });
}
