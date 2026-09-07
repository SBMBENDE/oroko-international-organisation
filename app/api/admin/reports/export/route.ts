import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import {
  getMembershipGrowthReport, getMembersByCountryReport, getMembersByCountryOfOriginReport,
  getMembershipTypeReport, getMembershipStatusReport, getMembershipExpirationReport,
  getEventParticipationReport, getProjectParticipationReport, getDonationsReport,
  getWelfareAssistanceReport, getMemberEngagementReport,
} from "@/lib/dal/admin-reports";

function toCsvValue(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  return [headers, ...rows.map((r) => headers.map((h) => r[h]))].map((row) => row.map(toCsvValue).join(",")).join("\n");
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.REPORTS_VIEW)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "";
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  const range = { from, to };

  let rows: Record<string, unknown>[] = [];
  switch (type) {
    case "membership-growth": rows = await getMembershipGrowthReport(range); break;
    case "members-by-country": rows = await getMembersByCountryReport(range); break;
    case "members-by-origin": rows = await getMembersByCountryOfOriginReport(range); break;
    case "membership-type": rows = await getMembershipTypeReport(range); break;
    case "membership-status": rows = await getMembershipStatusReport(range); break;
    case "membership-expiration": rows = await getMembershipExpirationReport(); break;
    case "event-participation": rows = await getEventParticipationReport(range); break;
    case "project-participation": rows = await getProjectParticipationReport(); break;
    case "donations": rows = await getDonationsReport(range); break;
    case "welfare": rows = await getWelfareAssistanceReport(range); break;
    case "engagement": rows = await getMemberEngagementReport(); break;
    default: return NextResponse.json({ error: "Unknown report type" }, { status: 400 });
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-report.csv"`,
    },
  });
}
