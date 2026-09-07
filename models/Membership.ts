import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MembershipStatus =
  | "pending"
  | "active"
  | "suspended"
  | "expired"
  | "rejected"
  | "resigned";

// Application review workflow — separate from the ongoing membership status above.
export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "needs_information"
  | "approved"
  | "rejected";

export interface IStatusHistoryEntry {
  status: MembershipStatus;
  changedBy?: Types.ObjectId;
  changedByName?: string;
  reason?: string;
  changedAt: Date;
}

export interface IInternalNote {
  author: Types.ObjectId;
  authorName: string;
  text: string;
  createdAt: Date;
}

export interface IMembership extends Document {
  user: Types.ObjectId;
  orokoId: string;
  memberSince: Date;
  // Free-form so new membership types can be added from Settings (see models/MembershipType.ts)
  membershipType: string;
  status: MembershipStatus;
  country?: string;
  countryOfOrigin?: string;
  city?: string;
  profession?: string;
  organization?: string;
  phone?: string;
  expiresAt?: Date;
  paymentStatus: "paid" | "unpaid" | "waived";
  // Application review workflow
  applicationStatus: ApplicationStatus;
  reviewedBy?: Types.ObjectId;
  decisionAt?: Date;
  infoRequestMessage?: string;
  rejectionReason?: string;
  statusHistory: IStatusHistoryEntry[];
  internalNotes: IInternalNote[];
  createdAt: Date;
  updatedAt: Date;
}

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
  {
    status: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User" },
    changedByName: { type: String, trim: true },
    reason: { type: String, trim: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const InternalNoteSchema = new Schema<IInternalNote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MembershipSchema = new Schema<IMembership>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one membership per individual
    },
    orokoId: {
      type: String,
      unique: true,
      sparse: true, // set on activation
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    membershipType: {
      type: String,
      trim: true,
      default: "regular",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "expired", "rejected", "resigned"],
      default: "pending",
    },
    country: {
      type: String,
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    profession: {
      type: String,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "waived"],
      default: "unpaid",
    },
    applicationStatus: {
      type: String,
      enum: ["pending", "under_review", "needs_information", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    decisionAt: { type: Date },
    infoRequestMessage: { type: String, trim: true, maxlength: 2000 },
    rejectionReason: { type: String, trim: true, maxlength: 2000 },
    statusHistory: { type: [StatusHistorySchema], default: [] },
    internalNotes: { type: [InternalNoteSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

/** Generate OROKO-YYYY-NNNNN ID on pre-save */
MembershipSchema.pre("save", async function () {
  if (this.isNew && !this.orokoId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.Membership.countDocuments();
    const sequence = String(count + 1).padStart(5, "0");
    this.orokoId = `OROKO-${year}-${sequence}`;
  }
});

MembershipSchema.index({ status: 1 });

const Membership: Model<IMembership> =
  mongoose.models.Membership ??
  mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;
