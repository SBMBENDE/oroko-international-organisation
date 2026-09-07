import "server-only";
import { connectDB } from "@/lib/db";
import OrgSettings from "@/models/OrgSettings";

export async function getOrgSettings() {
  await connectDB();
  let settings = await OrgSettings.findOne({});
  if (!settings) {
    settings = await OrgSettings.create({});
  }
  return {
    id: settings._id.toString(),
    organizationName: settings.organizationName,
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    address: settings.address ?? "",
    notifyOnNewApplication: settings.notifyOnNewApplication,
    notifyOnNewDonation: settings.notifyOnNewDonation,
    notifyOnWelfareRequest: settings.notifyOnWelfareRequest,
    memberIdPrefix: settings.memberIdPrefix,
  };
}
