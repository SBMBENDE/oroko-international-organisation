import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showCountry: boolean;
  showOccupation: boolean;
  isDirectoryVisible: boolean;
}

export interface IUser extends Document {
  // Core
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "member" | "admin" | "superadmin";
  membershipStatus: "pending" | "active" | "suspended" | "expired";
  isEmailVerified: boolean;
  isActive: boolean;
  // Profile (Phase 3)
  bio?: string;
  headline?: string;
  profilePhoto?: string;
  country?: string;
  city?: string;
  phone?: string;
  occupation?: string;
  employer?: string;
  website?: string;
  linkedIn?: string;
  // Privacy (Phase 3)
  privacySettings: IPrivacySettings;
  // Verification (Phase 3)
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  getFullName(): string;
}

const PrivacySettingsSchema = new Schema<IPrivacySettings>(
  {
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showCountry: { type: Boolean, default: true },
    showOccupation: { type: Boolean, default: true },
    isDirectoryVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["member", "admin", "superadmin"],
      default: "member",
    },
    membershipStatus: {
      type: String,
      enum: ["pending", "active", "suspended", "expired"],
      default: "pending",
    },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // Profile fields
    bio: { type: String, trim: true, maxlength: [500, "Bio cannot exceed 500 characters"] },
    headline: { type: String, trim: true, maxlength: [100, "Headline cannot exceed 100 characters"] },
    profilePhoto: { type: String, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true, maxlength: [100, "City cannot exceed 100 characters"] },
    phone: { type: String, trim: true, maxlength: [20, "Phone cannot exceed 20 characters"] },
    occupation: { type: String, trim: true, maxlength: [100, "Occupation cannot exceed 100 characters"] },
    employer: { type: String, trim: true, maxlength: [100, "Employer cannot exceed 100 characters"] },
    website: { type: String, trim: true, maxlength: [200, "Website URL is too long"] },
    linkedIn: { type: String, trim: true, maxlength: [200, "LinkedIn URL is too long"] },
    // Privacy
    privacySettings: { type: PrivacySettingsSchema, default: () => ({}) },
    // Verification
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

// Prevent lean query from exposing password
UserSchema.set("toJSON", {
  transform(_doc, ret) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = ret as any;
    delete r.password;
    return r;
  },
});

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
