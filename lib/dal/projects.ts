import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import Project, { type IProject, type ProjectStatus, type ProjectCategory } from "@/models/Project";
import { Types } from "mongoose";

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  status: string;
  location?: string;
  coverImage?: string;
  fundingGoal?: number;
  fundingRaised: number;
  currency: string;
  progressPercent: number;
  isFeatured: boolean;
  startDate?: string;
  targetEndDate?: string;
  milestoneCount: number;
  completedMilestones: number;
};

export type ProjectDetail = ProjectSummary & {
  description?: string;
  leadName?: string;
  teamMembers: string[];
  gallery: string[];
  milestones: {
    title: string;
    description?: string;
    targetDate?: string;
    isCompleted: boolean;
  }[];
  completedAt?: string;
};

export const getFeaturedProjects = cache(async (): Promise<ProjectSummary[]> => {
  await connectDB();
  const projects = await Project.find({ isPublic: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean<IProject[]>();
  return projects.map(toSummary);
});

export const getAllPublicProjects = cache(async (opts?: {
  status?: ProjectStatus;
  category?: ProjectCategory;
  limit?: number;
}): Promise<ProjectSummary[]> => {
  const { status, category, limit = 50 } = opts ?? {};
  await connectDB();
  const filter: Record<string, unknown> = { isPublic: true };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const projects = await Project.find(filter)
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(limit)
    .lean<IProject[]>();
  return projects.map(toSummary);
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDetail | null> => {
  await connectDB();
  const project = await Project.findOne({ slug, isPublic: true }).lean<IProject>();
  if (!project) return null;
  return toDetail(project);
});

function toSummary(p: IProject): ProjectSummary {
  return {
    id: (p._id as Types.ObjectId).toString(),
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    category: p.category,
    status: p.status,
    location: p.location,
    coverImage: p.coverImage,
    fundingGoal: p.fundingGoal,
    fundingRaised: p.fundingRaised,
    currency: p.currency,
    progressPercent: p.progressPercent,
    isFeatured: p.isFeatured,
    startDate: p.startDate?.toISOString(),
    targetEndDate: p.targetEndDate?.toISOString(),
    milestoneCount: p.milestones.length,
    completedMilestones: p.milestones.filter((m) => m.isCompleted).length,
  };
}

function toDetail(p: IProject): ProjectDetail {
  return {
    ...toSummary(p),
    description: p.description,
    leadName: p.leadName,
    teamMembers: p.teamMembers,
    gallery: p.gallery,
    completedAt: p.completedAt?.toISOString(),
    milestones: p.milestones.map((m) => ({
      title: m.title,
      description: m.description,
      targetDate: m.targetDate?.toISOString(),
      isCompleted: m.isCompleted,
    })),
  };
}
