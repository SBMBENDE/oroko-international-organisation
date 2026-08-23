import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type CommitteeMemberRole = "chair" | "vice_chair" | "secretary" | "member";

export interface ICommitteeMember extends Document {
  committee: Types.ObjectId;
  user: Types.ObjectId;
  role: CommitteeMemberRole;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeMemberSchema = new Schema<ICommitteeMember>(
  {
    committee: { type: Schema.Types.ObjectId, ref: "Committee", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["chair", "vice_chair", "secretary", "member"],
      default: "member",
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CommitteeMemberSchema.index({ committee: 1, isActive: 1 });
CommitteeMemberSchema.index({ user: 1 });

const CommitteeMember: Model<ICommitteeMember> =
  mongoose.models.CommitteeMember ??
  mongoose.model<ICommitteeMember>("CommitteeMember", CommitteeMemberSchema);

export default CommitteeMember;
