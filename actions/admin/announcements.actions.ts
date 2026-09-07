"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Required").max(200),
  content: z.string().min(2, "Required"),
  category: z.enum(["general", "membership", "events", "governance", "projects", "welfare", "other"]),
  featuredImage: z.string().optional().or(z.literal("")),
});

export async function createAnnouncement(data: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.ANNOUNCEMENTS_MANAGE);
    await connectDB();

    const announcement = await Announcement.create({
      ...parsed.data,
      author: admin.id,
      authorName: admin.name,
      status: "draft",
    });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "announcement.created", entityType: "Announcement", entityId: announcement._id.toString(),
      description: `Created announcement "${announcement.title}"`,
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (err) {
    console.error("[createAnnouncement]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create announcement" };
  }
}

export async function setAnnouncementStatus(id: string, status: "draft" | "published"): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.ANNOUNCEMENTS_MANAGE);
    await connectDB();

    const announcement = await Announcement.findByIdAndUpdate(id, {
      $set: { status, publishAt: status === "published" ? new Date() : undefined },
    });
    if (!announcement) return { success: false, error: "Announcement not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "announcement.status_changed", entityType: "Announcement", entityId: id,
      description: `${status === "published" ? "Published" : "Unpublished"} announcement "${announcement.title}"`,
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/announcements");
    return { success: true };
  } catch (err) {
    console.error("[setAnnouncementStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update announcement" };
  }
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.ANNOUNCEMENTS_MANAGE);
    await connectDB();

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) return { success: false, error: "Announcement not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "announcement.deleted", entityType: "Announcement", entityId: id,
      description: `Deleted announcement "${announcement.title}"`,
    });

    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (err) {
    console.error("[deleteAnnouncement]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete announcement" };
  }
}
