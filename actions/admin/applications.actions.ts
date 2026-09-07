"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Membership from "@/models/Membership";
import User from "@/models/User";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

export async function setApplicationUnderReview(membershipId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.APPLICATIONS_MANAGE);
    await connectDB();

    const membership = await Membership.findByIdAndUpdate(membershipId, {
      $set: { applicationStatus: "under_review", reviewedBy: admin.id },
    });
    if (!membership) return { success: false, error: "Application not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "application.under_review", entityType: "Membership", entityId: membershipId,
      description: "Marked membership application as under review",
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${membershipId}`);
    return { success: true };
  } catch (err) {
    console.error("[setApplicationUnderReview]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update application" };
  }
}

export async function requestMoreInformation(membershipId: string, message: string): Promise<ActionResult> {
  const parsed = z.string().min(1, "Message is required").max(2000).safeParse(message);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.APPLICATIONS_MANAGE);
    await connectDB();

    const membership = await Membership.findByIdAndUpdate(membershipId, {
      $set: { applicationStatus: "needs_information", infoRequestMessage: parsed.data, reviewedBy: admin.id },
    });
    if (!membership) return { success: false, error: "Application not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "application.info_requested", entityType: "Membership", entityId: membershipId,
      description: "Requested additional information from applicant",
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${membershipId}`);
    return { success: true };
  } catch (err) {
    console.error("[requestMoreInformation]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update application" };
  }
}

export async function approveApplication(membershipId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.APPLICATIONS_MANAGE);
    await connectDB();

    const membership = await Membership.findById(membershipId);
    if (!membership) return { success: false, error: "Application not found" };

    membership.applicationStatus = "approved";
    membership.status = "active";
    membership.reviewedBy = new Types.ObjectId(admin.id);
    membership.decisionAt = new Date();
    membership.statusHistory.push({
      status: "active",
      changedBy: new Types.ObjectId(admin.id),
      changedByName: admin.name,
      reason: "Application approved",
      changedAt: new Date(),
    });
    await membership.save();

    await User.findByIdAndUpdate(membership.user, { $set: { membershipStatus: "active" } });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "application.approved", entityType: "Membership", entityId: membershipId,
      description: `Approved membership application — member ID ${membership.orokoId}`,
    });

    // Welcome notification: no email provider is configured yet — see final deliverable notes.

    revalidatePath("/admin/applications");
    revalidatePath("/admin/members");
    revalidatePath(`/admin/applications/${membershipId}`);
    return { success: true };
  } catch (err) {
    console.error("[approveApplication]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to approve application" };
  }
}

export async function rejectApplication(membershipId: string, reason: string): Promise<ActionResult> {
  const parsed = z.string().min(1, "Reason is required").max(2000).safeParse(reason);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.APPLICATIONS_MANAGE);
    await connectDB();

    const membership = await Membership.findById(membershipId);
    if (!membership) return { success: false, error: "Application not found" };

    membership.applicationStatus = "rejected";
    membership.status = "rejected";
    membership.rejectionReason = parsed.data;
    membership.reviewedBy = new Types.ObjectId(admin.id);
    membership.decisionAt = new Date();
    membership.statusHistory.push({
      status: "rejected",
      changedBy: new Types.ObjectId(admin.id),
      changedByName: admin.name,
      reason: parsed.data,
      changedAt: new Date(),
    });
    await membership.save();

    await User.findByIdAndUpdate(membership.user, { $set: { membershipStatus: "rejected", isActive: false } });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "application.rejected", entityType: "Membership", entityId: membershipId,
      description: "Rejected membership application",
      metadata: { reason: parsed.data },
    });

    revalidatePath("/admin/applications");
    revalidatePath(`/admin/applications/${membershipId}`);
    return { success: true };
  } catch (err) {
    console.error("[rejectApplication]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to reject application" };
  }
}

export async function addApplicationNote(membershipId: string, text: string): Promise<ActionResult> {
  const parsed = z.string().min(1).max(2000).safeParse(text);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.APPLICATIONS_MANAGE);
    await connectDB();

    const membership = await Membership.findByIdAndUpdate(membershipId, {
      $push: { internalNotes: { author: admin.id, authorName: admin.name, text: parsed.data, createdAt: new Date() } },
    });
    if (!membership) return { success: false, error: "Application not found" };

    revalidatePath(`/admin/applications/${membershipId}`);
    return { success: true };
  } catch (err) {
    console.error("[addApplicationNote]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add note" };
  }
}
