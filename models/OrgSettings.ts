import mongoose, { Schema, Document, Model } from "mongoose";

/** Singleton document — there is always exactly one settings record. */
export interface IOrgSettings extends Document {
  organizationName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  notifyOnNewApplication: boolean;
  notifyOnNewDonation: boolean;
  notifyOnWelfareRequest: boolean;
  memberIdPrefix: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrgSettingsSchema = new Schema<IOrgSettings>(
  {
    organizationName: { type: String, required: true, trim: true, default: "OROKO International" },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    notifyOnNewApplication: { type: Boolean, default: true },
    notifyOnNewDonation: { type: Boolean, default: true },
    notifyOnWelfareRequest: { type: Boolean, default: true },
    memberIdPrefix: { type: String, trim: true, default: "OROKO" },
  },
  { timestamps: true }
);

const OrgSettings: Model<IOrgSettings> =
  mongoose.models.OrgSettings ?? mongoose.model<IOrgSettings>("OrgSettings", OrgSettingsSchema);

export default OrgSettings;
