import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getMembers } from "@/lib/dal/admin-members";
import { logAudit } from "@/lib/audit";

function toCsvValue(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.MEMBERS_MANAGE)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const { members } = await getMembers({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    membershipType: searchParams.get("membershipType") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    page: 1,
    limit: 10000,
  });

  const headers = ["Member ID", "First Name", "Last Name", "Email", "Phone", "Membership Type", "Status", "Country", "Profession", "Member Since"];
  const rows = members.map((m) => [
    m.orokoId, m.firstName, m.lastName, m.email, m.phone ?? "", m.membershipType, m.status, m.country ?? "", m.profession ?? "",
    new Date(m.memberSince).toLocaleDateString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");

  await logAudit({
    actorId: session.user.id,
    actorName: session.user.name ?? "Administrator",
    action: "member.exported",
    entityType: "Membership",
    description: `Exported ${members.length} member records to CSV`,
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="oroko-members-${Date.now()}.csv"`,
    },
  });
}
