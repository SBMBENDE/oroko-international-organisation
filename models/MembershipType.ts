import mongoose, { Schema, Document, Model } from "mongoose";

/** Configurable membership types managed from Settings — do not hard-code types elsewhere. */
export interface IMembershipType extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipTypeSchema = new Schema<IMembershipType>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MembershipTypeSchema.pre("save", function () {
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
});

MembershipTypeSchema.index({ isActive: 1, order: 1 });

const MembershipType: Model<IMembershipType> =
  mongoose.models.MembershipType ??
  mongoose.model<IMembershipType>("MembershipType", MembershipTypeSchema);

export default MembershipType;
