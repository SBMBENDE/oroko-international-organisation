import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGovernanceRole extends Document {
  name: string;
  organ: "executive" | "general_assembly" | "committee";
  description?: string;
  responsibilities: string[];
  permissions: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GovernanceRoleSchema = new Schema<IGovernanceRole>(
  {
    name: { type: String, required: true, trim: true },
    organ: {
      type: String,
      enum: ["executive", "general_assembly", "committee"],
      required: true,
    },
    description: { type: String, trim: true },
    responsibilities: [{ type: String, trim: true }],
    permissions: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GovernanceRoleSchema.index({ organ: 1, order: 1 });

const GovernanceRole: Model<IGovernanceRole> =
  mongoose.models.GovernanceRole ??
  mongoose.model<IGovernanceRole>("GovernanceRole", GovernanceRoleSchema);

export default GovernanceRole;
