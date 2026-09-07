import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type WelfareRequestType =
  | "wedding"
  | "childbirth"
  | "hospitalization"
  | "bereavement"
  | "education"
  | "other";

export type WelfareRequestStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "paid"
  | "closed";

export type WelfarePaymentStatus = "unpaid" | "paid" | "not_applicable";

export interface IWelfareRequest extends Document {
  member: Types.ObjectId;
  requestType: WelfareRequestType;
  description: string;
  supportingDocuments: string[];
  amountRequested?: number;
  amountApproved?: number;
  currency: string;
  status: WelfareRequestStatus;
  reviewer?: Types.ObjectId;
  decisionAt?: Date;
  paymentStatus: WelfarePaymentStatus;
  internalNotes: { author: Types.ObjectId; authorName: string; text: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const WelfareRequestSchema = new Schema<IWelfareRequest>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestType: {
      type: String,
      enum: ["wedding", "childbirth", "hospitalization", "bereavement", "education", "other"],
      required: true,
    },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    supportingDocuments: [{ type: String, trim: true }],
    amountRequested: { type: Number, min: 0 },
    amountApproved: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected", "paid", "closed"],
      default: "submitted",
    },
    reviewer: { type: Schema.Types.ObjectId, ref: "User" },
    decisionAt: { type: Date },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "not_applicable"],
      default: "unpaid",
    },
    internalNotes: [
      {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        authorName: { type: String, required: true, trim: true },
        text: { type: String, required: true, trim: true, maxlength: 2000 },
        createdAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

WelfareRequestSchema.index({ member: 1, createdAt: -1 });
WelfareRequestSchema.index({ status: 1 });

const WelfareRequest: Model<IWelfareRequest> =
  mongoose.models.WelfareRequest ??
  mongoose.model<IWelfareRequest>("WelfareRequest", WelfareRequestSchema);

export default WelfareRequest;
