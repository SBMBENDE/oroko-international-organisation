import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { GovernanceOrgan } from "./GovernanceMeeting";

export type DocumentType =
  | "resolution"
  | "decision"
  | "minutes"
  | "report"
  | "agenda"
  | "statute"
  | "bylaw";

export interface IGovernanceDocument extends Document {
  organ: GovernanceOrgan;
  committee?: Types.ObjectId;
  meeting?: Types.ObjectId;
  type: DocumentType;
  title: string;
  reference?: string;
  summary?: string;
  content?: string;
  attachmentUrl?: string;
  adoptedAt?: Date;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GovernanceDocumentSchema = new Schema<IGovernanceDocument>(
  {
    organ: {
      type: String,
      enum: ["general_assembly", "executive", "committee"],
      required: true,
    },
    committee: { type: Schema.Types.ObjectId, ref: "Committee" },
    meeting: { type: Schema.Types.ObjectId, ref: "GovernanceMeeting" },
    type: {
      type: String,
      enum: ["resolution", "decision", "minutes", "report", "agenda", "statute", "bylaw"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    reference: { type: String, trim: true },
    summary: { type: String, trim: true },
    content: { type: String },
    attachmentUrl: { type: String, trim: true },
    adoptedAt: { type: Date },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GovernanceDocumentSchema.index({ organ: 1, type: 1, createdAt: -1 });
GovernanceDocumentSchema.index({ committee: 1 });
GovernanceDocumentSchema.index({ isPublic: 1 });

const GovernanceDocument: Model<IGovernanceDocument> =
  mongoose.models.GovernanceDocument ??
  mongoose.model<IGovernanceDocument>("GovernanceDocument", GovernanceDocumentSchema);

export default GovernanceDocument;
