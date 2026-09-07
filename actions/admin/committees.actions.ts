"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import User from "@/models/User";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const committeeSchema = z.object({
  name: z.string().min(2, "Required").max(100),
  mandate: z.string().min(2, "Required").max(300),
  description: z.string().max(1000).optional().or(z.literal("")),
});

export async function createCommittee(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = committeeSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.COMMITTEE_MANAGE);
    await connectDB();

    const committee = await Committee.create(parsed.data);

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "committee.created", entityType: "Committee", entityId: committee._id.toString(),
      description: `Created committee "${committee.name}"`,
    });

    revalidatePath("/admin/committees");
    return { success: true, id: committee._id.toString() };
  } catch (err) {
    console.error("[createCommittee]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create committee" };
  }
}

export async function updateCommittee(id: string, data: unknown): Promise<ActionResult> {
  const parsed = committeeSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.COMMITTEE_MANAGE);
    await connectDB();

    const committee = await Committee.findByIdAndUpdate(id, { $set: parsed.data });
    if (!committee) return { success: false, error: "Committee not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "committee.updated", entityType: "Committee", entityId: id,
      description: `Updated committee "${parsed.data.name}"`,
    });

    revalidatePath("/admin/committees");
    revalidatePath(`/admin/committees/${id}`);
    return { success: true };
  } catch (err) {
    console.error("[updateCommittee]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update committee" };
  }
}

export async function toggleCommitteeActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.COMMITTEE_MANAGE);
    await connectDB();

    const committee = await Committee.findByIdAndUpdate(id, { $set: { isActive } });
    if (!committee) return { success: false, error: "Committee not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "committee.toggled", entityType: "Committee", entityId: id,
      description: `${isActive ? "Activated" : "Deactivated"} committee "${committee.name}"`,
    });

    revalidatePath("/admin/committees");
    return { success: true };
  } catch (err) {
    console.error("[toggleCommitteeActive]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update committee" };
  }
}

export async function addCommitteeMember(committeeId: string, email: string, role: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.COMMITTEE_MANAGE);
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return { success: false, error: "No member found with this email" };

    const existing = await CommitteeMember.findOne({ committee: committeeId, user: user._id });
    const typedRole = role as "chair" | "vice_chair" | "secretary" | "member";
    if (existing) {
      existing.isActive = true;
      existing.role = typedRole;
      await existing.save();
    } else {
      await CommitteeMember.create({ committee: committeeId, user: user._id, role: typedRole, startDate: new Date() });
    }

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "committee.member_added", entityType: "Committee", entityId: committeeId,
      description: `Added ${user.firstName} ${user.lastName} to committee as ${role}`,
    });

    revalidatePath(`/admin/committees/${committeeId}`);
    return { success: true };
  } catch (err) {
    console.error("[addCommitteeMember]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to add member" };
  }
}

export async function removeCommitteeMember(committeeMemberId: string, committeeId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.COMMITTEE_MANAGE);
    await connectDB();

    await CommitteeMember.findByIdAndUpdate(committeeMemberId, { $set: { isActive: false, endDate: new Date() } });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "committee.member_removed", entityType: "Committee", entityId: committeeId,
      description: "Removed a member from committee",
    });

    revalidatePath(`/admin/committees/${committeeId}`);
    return { success: true };
  } catch (err) {
    console.error("[removeCommitteeMember]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to remove member" };
  }
}
