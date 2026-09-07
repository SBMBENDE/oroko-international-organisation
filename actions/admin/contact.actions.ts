"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const STATUS_VALUES = ["new", "in_progress", "resolved", "archived"] as const;

export async function updateContactMessageStatus(id: string, status: (typeof STATUS_VALUES)[number]): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.CONTACT_MANAGE);
    await connectDB();

    const message = await ContactMessage.findByIdAndUpdate(id, { $set: { status } });
    if (!message) return { success: false, error: "Message not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "contact.status_changed", entityType: "ContactMessage", entityId: id,
      description: `Changed contact message status to ${status}`,
    });

    revalidatePath("/admin/contact");
    return { success: true };
  } catch (err) {
    console.error("[updateContactMessageStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update message" };
  }
}

export async function addContactMessageNote(id: string, text: string): Promise<ActionResult> {
  const parsed = z.string().min(1).max(2000).safeParse(text);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.CONTACT_MANAGE);
    await connectDB();

    const message = await ContactMessage.findByIdAndUpdate(id, {
      $push: { internalNotes: { author: admin.id, authorName: admin.name, text: parsed.data, createdAt: new Date() } },
    });
    if (!message) return { success: false, error: "Message not found" };

    revalidatePath("/admin/contact");
    return { success: true };
  } catch (err) {
    console.error("[addContactMessageNote]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add note" };
  }
}
