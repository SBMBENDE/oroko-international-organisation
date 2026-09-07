"use server";

import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Membership from "@/models/Membership";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { z } from "zod";
import type { ActionResult } from "@/types";

const STATUS_VALUES = ["pending", "active", "suspended", "expired", "rejected", "resigned"] as const;

export async function changeMemberStatus(
  memberId: string,
  status: (typeof STATUS_VALUES)[number],
  reason?: string
): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();

    const membership = await Membership.findOne({ user: memberId });
    if (!membership) return { success: false, error: "Member not found" };

    const previousStatus = membership.status;
    membership.status = status;
    membership.statusHistory.push({
      status,
      changedBy: new Types.ObjectId(admin.id),
      changedByName: admin.name,
      reason,
      changedAt: new Date(),
    });
    await membership.save();

    // Keep the User record's mirrored status in sync — used by session/proxy checks.
    await User.findByIdAndUpdate(memberId, { $set: { membershipStatus: status } });

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.status_changed",
      entityType: "Membership",
      entityId: membership._id.toString(),
      description: `Changed member status from ${previousStatus} to ${status}`,
      metadata: { reason },
    });

    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${memberId}`);
    return { success: true };
  } catch (err) {
    console.error("[changeMemberStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update status" };
  }
}

export async function renewMembership(memberId: string, newExpiresAt: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();

    const membership = await Membership.findOne({ user: memberId });
    if (!membership) return { success: false, error: "Member not found" };

    membership.status = "active";
    membership.expiresAt = new Date(newExpiresAt);
    membership.statusHistory.push({
      status: "active",
      changedBy: new Types.ObjectId(admin.id),
      changedByName: admin.name,
      reason: "Membership renewed",
      changedAt: new Date(),
    });
    await membership.save();
    await User.findByIdAndUpdate(memberId, { $set: { membershipStatus: "active" } });

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.renewed",
      entityType: "Membership",
      entityId: membership._id.toString(),
      description: `Renewed membership until ${new Date(newExpiresAt).toLocaleDateString()}`,
    });

    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${memberId}`);
    return { success: true };
  } catch (err) {
    console.error("[renewMembership]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to renew membership" };
  }
}

export async function addInternalNote(memberId: string, text: string): Promise<ActionResult> {
  const parsed = z.string().min(1, "Note cannot be empty").max(2000).safeParse(text);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();

    const membership = await Membership.findOneAndUpdate(
      { user: memberId },
      { $push: { internalNotes: { author: admin.id, authorName: admin.name, text: parsed.data, createdAt: new Date() } } }
    );
    if (!membership) return { success: false, error: "Member not found" };

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.note_added",
      entityType: "Membership",
      entityId: membership._id.toString(),
      description: "Added an internal note to a member profile",
    });

    revalidatePath(`/admin/members/${memberId}`);
    return { success: true };
  } catch (err) {
    console.error("[addInternalNote]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add note" };
  }
}

const memberEditSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  countryOfOrigin: z.string().max(100).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  profession: z.string().max(100).optional().or(z.literal("")),
  organization: z.string().max(100).optional().or(z.literal("")),
  membershipType: z.string().min(1, "Membership type is required"),
  paymentStatus: z.enum(["paid", "unpaid", "waived"]),
});

export async function updateMemberProfile(memberId: string, data: unknown): Promise<ActionResult> {
  const parsed = memberEditSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();

    const { firstName, lastName, email, phone, country, countryOfOrigin, city, profession, organization, membershipType, paymentStatus } = parsed.data;

    const existing = await User.findOne({ email, _id: { $ne: memberId } });
    if (existing) return { success: false, error: "Another account already uses this email" };

    await User.findByIdAndUpdate(memberId, { $set: { firstName, lastName, email, phone } });
    await Membership.findOneAndUpdate(
      { user: memberId },
      { $set: { country, countryOfOrigin, city, profession, organization, membershipType, paymentStatus } }
    );

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.updated",
      entityType: "User",
      entityId: memberId,
      description: `Updated profile details for ${firstName} ${lastName}`,
    });

    revalidatePath(`/admin/members/${memberId}`);
    revalidatePath("/admin/members");
    return { success: true };
  } catch (err) {
    console.error("[updateMemberProfile]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update member" };
  }
}

const newMemberSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  membershipType: z.string().min(1, "Membership type is required"),
});

export async function createMember(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = newMemberSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();
    const bcrypt = (await import("bcryptjs")).default;

    const { firstName, lastName, email, phone, country, membershipType } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) return { success: false, error: "An account with this email already exists" };

    const tempPassword = Math.random().toString(36).slice(-10) + "Aa1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      country,
      password: hashedPassword,
      role: "member",
      membershipStatus: "active",
      isEmailVerified: false,
      isActive: true,
    });

    const membership = await Membership.create({
      user: user._id,
      memberSince: new Date(),
      membershipType,
      status: "active",
      applicationStatus: "approved",
      country,
      reviewedBy: admin.id,
      decisionAt: new Date(),
      statusHistory: [{ status: "active", changedBy: admin.id, changedByName: admin.name, reason: "Created directly by admin", changedAt: new Date() }],
    });

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.created",
      entityType: "User",
      entityId: user._id.toString(),
      description: `Added new member ${firstName} ${lastName} (${membership.orokoId})`,
    });

    revalidatePath("/admin/members");
    return { success: true, id: user._id.toString() };
  } catch (err) {
    console.error("[createMember]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create member" };
  }
}

export async function reissueMemberId(memberId: string): Promise<ActionResult & { orokoId?: string }> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.MEMBERS_MANAGE);
    await connectDB();

    const membership = await Membership.findOne({ user: memberId });
    if (!membership) return { success: false, error: "Member not found" };

    const previousId = membership.orokoId;
    const year = new Date().getFullYear();
    const suffix = Math.random().toString(36).slice(-5).toUpperCase();
    membership.orokoId = `OROKO-${year}-${suffix}`;
    await membership.save();

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "member.id_reissued",
      entityType: "Membership",
      entityId: membership._id.toString(),
      description: `Reissued Member ID from ${previousId} to ${membership.orokoId}`,
    });

    revalidatePath("/admin/member-ids");
    revalidatePath(`/admin/members/${memberId}`);
    return { success: true, orokoId: membership.orokoId };
  } catch (err) {
    console.error("[reissueMemberId]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to reissue Member ID" };
  }
}

