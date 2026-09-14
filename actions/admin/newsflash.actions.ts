"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import NewsFlash from "@/models/NewsFlash";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Required").max(150),
  message: z.string().min(2, "Required").max(500),
  image: z.string().optional().or(z.literal("")),
  durationDays: z.number().int().positive().optional(),
});

export async function createNewsFlash(data: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.NEWSFLASH_MANAGE);
    await connectDB();

    const { durationDays, ...rest } = parsed.data;
    const flash = await NewsFlash.create({
      ...rest,
      author: admin.id,
      authorName: admin.name,
      status: "draft",
      expiresAt: durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : undefined,
    });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "newsflash.created", entityType: "NewsFlash", entityId: flash._id.toString(),
      description: `Created news flash "${flash.title}"`,
    });

    revalidatePath("/admin/news-flash");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[createNewsFlash]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create news flash" };
  }
}

export async function updateNewsFlash(id: string, data: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.NEWSFLASH_MANAGE);
    await connectDB();

    const { durationDays, ...rest } = parsed.data;
    const flash = await NewsFlash.findByIdAndUpdate(id, durationDays
      ? { $set: { ...rest, expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) } }
      : { $set: rest, $unset: { expiresAt: "" } }
    );
    if (!flash) return { success: false, error: "News flash not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "newsflash.updated", entityType: "NewsFlash", entityId: id,
      description: `Updated news flash "${flash.title}"`,
    });

    revalidatePath("/admin/news-flash");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[updateNewsFlash]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update news flash" };
  }
}

export async function setNewsFlashStatus(id: string, status: "draft" | "published"): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.NEWSFLASH_MANAGE);
    await connectDB();

    const flash = await NewsFlash.findByIdAndUpdate(id, { $set: { status } });
    if (!flash) return { success: false, error: "News flash not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "newsflash.status_changed", entityType: "NewsFlash", entityId: id,
      description: `${status === "published" ? "Published" : "Unpublished"} news flash "${flash.title}"`,
    });

    revalidatePath("/admin/news-flash");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[setNewsFlashStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update news flash" };
  }
}

export async function deleteNewsFlash(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.NEWSFLASH_MANAGE);
    await connectDB();

    const flash = await NewsFlash.findByIdAndDelete(id);
    if (!flash) return { success: false, error: "News flash not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "newsflash.deleted", entityType: "NewsFlash", entityId: id,
      description: `Deleted news flash "${flash.title}"`,
    });

    revalidatePath("/admin/news-flash");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[deleteNewsFlash]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete news flash" };
  }
}
