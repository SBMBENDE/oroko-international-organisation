import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AnnouncementStatus = "draft" | "published";
export type AnnouncementCategory =
  | "general"
  | "membership"
  | "events"
  | "governance"
  | "projects"
  | "welfare"
  | "other";

export interface IAnnouncement extends Document {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  authorName: string;
  category: AnnouncementCategory;
  featuredImage?: string;
  status: AnnouncementStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, trim: true, lowercase: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["general", "membership", "events", "governance", "projects", "welfare", "other"],
      default: "general",
    },
    featuredImage: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishAt: { type: Date },
  },
  { timestamps: true }
);

AnnouncementSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = `${this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()}-${Date.now().toString(36)}`;
  }
});

AnnouncementSchema.index({ status: 1, publishAt: -1 });
AnnouncementSchema.index({ slug: 1 });

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ??
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
