import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMembership extends Document {
  user: Types.ObjectId;
  orokoId: string;
  memberSince: Date;
  membershipType: "regular" | "associate" | "honorary" | "founding";
  status: "pending" | "active" | "suspended" | "expired";
  country?: string;
  phone?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

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
      enum: ["regular", "associate", "honorary", "founding"],
      default: "regular",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "expired"],
      default: "pending",
    },
    country: {
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

MembershipSchema.index({ user: 1 });
MembershipSchema.index({ orokoId: 1 });

const Membership: Model<IMembership> =
  mongoose.models.Membership ??
  mongoose.model<IMembership>("Membership", MembershipSchema);

export default Membership;
