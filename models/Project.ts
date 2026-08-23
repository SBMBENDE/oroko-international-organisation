import mongoose, { Schema, Document, Model } from "mongoose";

export type ProjectStatus = "planned" | "active" | "completed" | "on_hold";
export type ProjectCategory =
  | "education"
  | "healthcare"
  | "infrastructure"
  | "agriculture"
  | "culture"
  | "youth"
  | "women_empowerment"
  | "digital"
  | "environment"
  | "community"
  | "other";

export interface IProjectMilestone {
  title: string;
  description?: string;
  targetDate?: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location?: string;
  coverImage?: string;
  gallery: string[];
  // Financials
  fundingGoal?: number;
  fundingRaised: number;
  currency: string;
  // Team
  leadName?: string;
  teamMembers: string[];
  // Timeline
  startDate?: Date;
  targetEndDate?: Date;
  completedAt?: Date;
  // Milestones
  milestones: IProjectMilestone[];
  // Visibility
  isPublic: boolean;
  isFeatured: boolean;
  // Progress (0-100)
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IProjectMilestone>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    targetDate: Date,
    completedAt: Date,
    isCompleted: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String },
    category: {
      type: String,
      enum: ["education","healthcare","infrastructure","agriculture","culture","youth","women_empowerment","digital","environment","community","other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["planned","active","completed","on_hold"],
      default: "planned",
    },
    location: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    gallery: [{ type: String, trim: true }],
    fundingGoal: { type: Number, min: 0 },
    fundingRaised: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    leadName: { type: String, trim: true },
    teamMembers: [{ type: String, trim: true }],
    startDate: Date,
    targetEndDate: Date,
    completedAt: Date,
    milestones: [MilestoneSchema],
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

ProjectSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
});

ProjectSchema.index({ status: 1, isPublic: 1 });
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ category: 1 });

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
