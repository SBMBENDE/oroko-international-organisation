import "server-only";
import { connectDB } from "@/lib/db";
import Project, { type IProject } from "@/models/Project";
import { Types } from "mongoose";

export async function getAdminProjects(filters: { status?: string; page?: number; limit?: number }) {
  await connectDB();
  const { status, page = 1, limit = 20 } = filters;
  const filter: Record<string, unknown> = status ? { status } : {};

  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<IProject[]>(),
    Project.countDocuments(filter),
  ]);

  return {
    projects: projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      status: p.status,
      category: p.category,
      progressPercent: p.progressPercent,
      fundingGoal: p.fundingGoal,
      fundingRaised: p.fundingRaised,
      isFeatured: p.isFeatured,
    })),
    total,
    pages: Math.ceil(total / limit) || 1,
    page,
  };
}

export async function getAdminProjectDetail(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;
  const project = await Project.findById(id).lean<IProject & { _id: Types.ObjectId }>();
  if (!project) return null;

  return {
    id: project._id.toString(),
    title: project.title,
    summary: project.summary,
    description: project.description ?? "",
    category: project.category,
    status: project.status,
    location: project.location ?? "",
    leadName: project.leadName ?? "",
    fundingGoal: project.fundingGoal,
    fundingRaised: project.fundingRaised,
    startDate: project.startDate?.toISOString().slice(0, 10) ?? "",
    targetEndDate: project.targetEndDate?.toISOString().slice(0, 10) ?? "",
    progressPercent: project.progressPercent,
    isPublic: project.isPublic,
    isFeatured: project.isFeatured,
  };
}
