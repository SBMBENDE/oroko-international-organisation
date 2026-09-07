"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import WelfareRequest from "@/models/WelfareRequest";
import User from "@/models/User";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const createSchema = z.object({
  email: z.string().email(),
  requestType: z.enum(["wedding", "childbirth", "hospitalization", "bereavement", "education", "other"]),
  description: z.string().min(2, "Required").max(3000),
  amountRequested: z.number().min(0).optional(),
});

export async function createWelfareRequest(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.WELFARE_MANAGE);
    await connectDB();

    const member = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });
    if (!member) return { success: false, error: "No member found with this email" };

    const request = await WelfareRequest.create({
      member: member._id,
      requestType: parsed.data.requestType,
      description: parsed.data.description,
      amountRequested: parsed.data.amountRequested,
      status: "submitted",
    });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "welfare.created", entityType: "WelfareRequest", entityId: request._id.toString(),
      description: `Created welfare request for ${member.firstName} ${member.lastName}`,
    });

    revalidatePath("/admin/welfare");
    return { success: true, id: request._id.toString() };
  } catch (err) {
    console.error("[createWelfareRequest]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create welfare request" };
  }
}

const STATUS_VALUES = ["submitted", "under_review", "approved", "rejected", "paid", "closed"] as const;

export async function updateWelfareStatus(
  id: string,
  status: (typeof STATUS_VALUES)[number],
  amountApproved?: number
): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.WELFARE_MANAGE);
    await connectDB();

    const update: Record<string, unknown> = { status, reviewer: admin.id, decisionAt: new Date() };
    if (amountApproved !== undefined) update.amountApproved = amountApproved;
    if (status === "paid") update.paymentStatus = "paid";

    const request = await WelfareRequest.findByIdAndUpdate(id, { $set: update });
    if (!request) return { success: false, error: "Request not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "welfare.status_changed", entityType: "WelfareRequest", entityId: id,
      description: `Changed welfare request status to ${status}`,
    });

    revalidatePath("/admin/welfare");
    revalidatePath(`/admin/welfare/${id}`);
    return { success: true };
  } catch (err) {
    console.error("[updateWelfareStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update request" };
  }
}

export async function addWelfareNote(id: string, text: string): Promise<ActionResult> {
  const parsed = z.string().min(1).max(2000).safeParse(text);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.WELFARE_MANAGE);
    await connectDB();

    const request = await WelfareRequest.findByIdAndUpdate(id, {
      $push: { internalNotes: { author: admin.id, authorName: admin.name, text: parsed.data, createdAt: new Date() } },
    });
    if (!request) return { success: false, error: "Request not found" };

    revalidatePath(`/admin/welfare/${id}`);
    return { success: true };
  } catch (err) {
    console.error("[addWelfareNote]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add note" };
  }
}
