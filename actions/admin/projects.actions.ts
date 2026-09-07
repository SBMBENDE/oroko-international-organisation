"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const projectSchema = z.object({
  title: z.string().min(2, "Required").max(200),
  summary: z.string().min(2, "Required").max(300),
  description: z.string().optional().or(z.literal("")),
  category: z.enum(["education", "healthcare", "infrastructure", "agriculture", "culture", "youth", "women_empowerment", "digital", "environment", "community", "other"]),
  location: z.string().optional().or(z.literal("")),
  leadName: z.string().optional().or(z.literal("")),
  fundingGoal: z.number().min(0).optional(),
  startDate: z.string().optional().or(z.literal("")),
  targetEndDate: z.string().optional().or(z.literal("")),
  progressPercent: z.number().min(0).max(100),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
});

function toDoc(data: z.infer<typeof projectSchema>) {
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    targetEndDate: data.targetEndDate ? new Date(data.targetEndDate) : undefined,
  };
}

export async function createProject(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.PROJECTS_MANAGE);
    await connectDB();

    const project = await Project.create({ ...toDoc(parsed.data), status: "planned" });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "project.created", entityType: "Project", entityId: project._id.toString(),
      description: `Created project "${project.title}"`,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    return { success: true, id: project._id.toString() };
  } catch (err) {
    console.error("[createProject]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create project" };
  }
}

export async function updateProject(id: string, data: unknown): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.PROJECTS_MANAGE);
    await connectDB();

    const project = await Project.findByIdAndUpdate(id, { $set: toDoc(parsed.data) });
    if (!project) return { success: false, error: "Project not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "project.updated", entityType: "Project", entityId: id,
      description: `Updated project "${parsed.data.title}"`,
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("[updateProject]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update project" };
  }
}

const STATUS_VALUES = ["planned", "active", "completed", "on_hold"] as const;

export async function updateProjectStatus(id: string, status: (typeof STATUS_VALUES)[number]): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.PROJECTS_MANAGE);
    await connectDB();

    const project = await Project.findByIdAndUpdate(id, { $set: { status } });
    if (!project) return { success: false, error: "Project not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "project.status_changed", entityType: "Project", entityId: id,
      description: `Changed project "${project.title}" status to ${status}`,
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("[updateProjectStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update status" };
  }
}
