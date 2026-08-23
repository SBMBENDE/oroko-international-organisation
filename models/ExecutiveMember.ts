import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IExecutiveMember extends Document {
  user: Types.ObjectId;
  role: Types.ObjectId;
  term: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutiveMemberSchema = new Schema<IExecutiveMember>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: Schema.Types.ObjectId, ref: "GovernanceRole", required: true },
    term: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    bio: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

ExecutiveMemberSchema.index({ isActive: 1 });
ExecutiveMemberSchema.index({ user: 1 });

const ExecutiveMember: Model<IExecutiveMember> =
  mongoose.models.ExecutiveMember ??
  mongoose.model<IExecutiveMember>("ExecutiveMember", ExecutiveMemberSchema);

export default ExecutiveMember;
