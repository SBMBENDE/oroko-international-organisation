"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import GovernanceMeeting from "@/models/GovernanceMeeting";
import GovernanceDocument from "@/models/GovernanceDocument";
import { meetingSchema, documentSchema } from "@/lib/validations/governance";
import { requirePermission, PERMISSIONS } from "@/lib/permissions";
import { Types } from "mongoose";
import type { ActionResult } from "@/types";

async function getSessionRole(): Promise<string> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.role ?? "member";
}

export async function createMeeting(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = meetingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const role = await getSessionRole();
    requirePermission(role, PERMISSIONS.GOVERNANCE_MANAGE);
    await connectDB();

    const { committeeId, date, endDate, ...rest } = parsed.data;
    const meeting = await GovernanceMeeting.create({
      ...rest,
      committee: committeeId ? new Types.ObjectId(committeeId) : undefined,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
    });

    revalidatePath("/governance");
    revalidatePath("/portal/governance");
    return { success: true, id: meeting._id.toString() };
  } catch (err) {
    console.error("[createMeeting]", err);
    const message = err instanceof Error ? err.message : "Failed to create meeting";
    return { success: false, error: message };
  }
}

export async function updateMeeting(
  id: string,
  data: unknown
): Promise<ActionResult> {
  const parsed = meetingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const role = await getSessionRole();
    requirePermission(role, PERMISSIONS.GOVERNANCE_MANAGE);
    await connectDB();

    const { committeeId, date, endDate, ...rest } = parsed.data;
    const updated = await GovernanceMeeting.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        $set: {
          ...rest,
          committee: committeeId ? new Types.ObjectId(committeeId) : undefined,
          date: new Date(date),
          endDate: endDate ? new Date(endDate) : undefined,
        },
      }
    );

    if (!updated) return { success: false, error: "Meeting not found" };

    revalidatePath("/governance");
    revalidatePath("/portal/governance");
    return { success: true };
  } catch (err) {
    console.error("[updateMeeting]", err);
    const message = err instanceof Error ? err.message : "Failed to update meeting";
    return { success: false, error: message };
  }
}

export async function createDocument(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = documentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const role = await getSessionRole();
    requirePermission(role, PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const { committeeId, meetingId, adoptedAt, ...rest } = parsed.data;
    const doc = await GovernanceDocument.create({
      ...rest,
      committee: committeeId ? new Types.ObjectId(committeeId) : undefined,
      meeting: meetingId ? new Types.ObjectId(meetingId) : undefined,
      adoptedAt: adoptedAt ? new Date(adoptedAt) : undefined,
    });

    revalidatePath("/governance");
    revalidatePath("/portal/governance");
    return { success: true, id: doc._id.toString() };
  } catch (err) {
    console.error("[createDocument]", err);
    const message = err instanceof Error ? err.message : "Failed to create document";
    return { success: false, error: message };
  }
}
