import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommittee extends Document {
  name: string;
  slug: string;
  mandate: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeSchema = new Schema<ICommittee>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    mandate: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CommitteeSchema.pre("save", function () {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
});

CommitteeSchema.index({ slug: 1 });
CommitteeSchema.index({ isActive: 1, order: 1 });

const Committee: Model<ICommittee> =
  mongoose.models.Committee ??
  mongoose.model<ICommittee>("Committee", CommitteeSchema);

export default Committee;
