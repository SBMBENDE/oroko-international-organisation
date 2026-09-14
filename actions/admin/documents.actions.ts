"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import GovernanceDocument from "@/models/GovernanceDocument";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const schema = z.object({
  title: z.string().min(2, "Required").max(200),
  type: z.enum(["resolution", "decision", "minutes", "report", "agenda", "statute", "bylaw"]),
  summary: z.string().max(500).optional().or(z.literal("")),
  attachmentUrl: z.string().min(1, "A file URL is required").max(500),
  isPublic: z.boolean(),
  organ: z.enum(["general_assembly", "executive", "committee"]),
  committeeId: z.string().optional().or(z.literal("")),
});

export async function uploadDocument(data: unknown): Promise<ActionResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const { committeeId, ...rest } = parsed.data;
    const doc = await GovernanceDocument.create({
      ...rest,
      committee: rest.organ === "committee" && committeeId ? committeeId : undefined,
    });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "document.uploaded", entityType: "GovernanceDocument", entityId: doc._id.toString(),
      description: `Uploaded document "${doc.title}"`,
    });

    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true };
  } catch (err) {
    console.error("[uploadDocument]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to upload document" };
  }
}

export async function updateDocumentOrgan(id: string, organ: string, committeeId?: string): Promise<ActionResult> {
  const parsed = z.enum(["general_assembly", "executive", "committee"]).safeParse(organ);
  if (!parsed.success) return { success: false, error: "Invalid organ" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const doc = await GovernanceDocument.findByIdAndUpdate(
      id,
      { $set: { organ: parsed.data, committee: parsed.data === "committee" && committeeId ? committeeId : undefined } },
      { new: true }
    );
    if (!doc) return { success: false, error: "Document not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "document.organ_changed", entityType: "GovernanceDocument", entityId: id,
      description: `Moved document "${doc.title}" to ${parsed.data.replace("_", " ")}`,
    });

    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true };
  } catch (err) {
    console.error("[updateDocumentOrgan]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update document" };
  }
}


export async function toggleDocumentPublished(id: string, isPublic: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const doc = await GovernanceDocument.findByIdAndUpdate(id, { $set: { isPublic } });
    if (!doc) return { success: false, error: "Document not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "document.visibility_changed", entityType: "GovernanceDocument", entityId: id,
      description: `${isPublic ? "Published" : "Unpublished"} document "${doc.title}"`,
    });

    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true };
  } catch (err) {
    console.error("[toggleDocumentPublished]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update document" };
  }
}

export async function deleteDocument(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const doc = await GovernanceDocument.findByIdAndDelete(id);
    if (!doc) return { success: false, error: "Document not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "document.deleted", entityType: "GovernanceDocument", entityId: id,
      description: `Deleted document "${doc.title}"`,
    });

    revalidatePath("/admin/documents");
    revalidatePath("/governance");
    return { success: true };
  } catch (err) {
    console.error("[deleteDocument]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete document" };
  }
}

export async function replaceDocumentVersion(id: string, newAttachmentUrl: string): Promise<ActionResult> {
  const parsed = z.string().min(1, "A file URL is required").safeParse(newAttachmentUrl);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.DOCUMENTS_MANAGE);
    await connectDB();

    const doc = await GovernanceDocument.findById(id);
    if (!doc) return { success: false, error: "Document not found" };

    if (doc.attachmentUrl) {
      doc.previousVersions.push({ attachmentUrl: doc.attachmentUrl, version: doc.version, replacedAt: new Date() });
    }
    doc.attachmentUrl = parsed.data;
    doc.version += 1;
    await doc.save();

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "document.version_replaced", entityType: "GovernanceDocument", entityId: id,
      description: `Uploaded version ${doc.version} of document "${doc.title}"`,
    });

    revalidatePath("/admin/documents");
    return { success: true };
  } catch (err) {
    console.error("[replaceDocumentVersion]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to replace document version" };
  }
}

