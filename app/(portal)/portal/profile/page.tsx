import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/dal/profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { PhotoUpload } from "@/components/profile/PhotoUpload";
import { PrivacySettingsForm } from "@/components/profile/PrivacySettingsForm";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const data = await getCurrentMember();
  if (!data) redirect("/auth/login");

  const { user, membership } = data;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Serialize plain values for Client Components — Mongoose lean docs still
  // contain ObjectId / Date instances which React cannot serialize across the
  // Server→Client boundary.
  const profileDefaults = {
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio ?? "",
    headline: user.headline ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    phone: user.phone ?? "",
    occupation: user.occupation ?? "",
    employer: user.employer ?? "",
    website: user.website ?? "",
    linkedIn: user.linkedIn ?? "",
  };

  const privacySettings = {
    showEmail: user.privacySettings?.showEmail ?? false,
    showPhone: user.privacySettings?.showPhone ?? false,
    showCountry: user.privacySettings?.showCountry ?? true,
    showOccupation: user.privacySettings?.showOccupation ?? true,
    isDirectoryVisible: user.privacySettings?.isDirectoryVisible ?? true,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header card */}
      <ProfileHeader user={user} membership={membership} isOwner />

      {/* Quick link to ID card */}
      <Link
        href="/portal/id-card"
        className="group flex items-center gap-3 px-5 py-3.5 bg-oroko-green/5 border border-oroko-green/20 rounded-sm hover:bg-oroko-green/10 hover:border-oroko-green/40 transition-colors"
      >
        <CreditCard className="size-4 text-oroko-green" />
        <span className="text-sm text-oroko-green font-medium">View your OROKO Digital ID Card</span>
        <span className="ml-auto text-oroko-gold text-xs">→</span>
      </Link>

      {/* Editable tabs */}
      <Tabs defaultValue="edit">
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="photo">Profile Photo</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="bg-white border border-border rounded-sm p-6">
            <ProfileEditForm defaults={profileDefaults} />
          </div>
        </TabsContent>

        <TabsContent value="photo">
          <div className="bg-white border border-border rounded-sm p-8 flex justify-center">
            <PhotoUpload
              currentPhoto={user.profilePhoto}
              userName={`${user.firstName} ${user.lastName}`}
              initials={initials}
            />
          </div>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="bg-white border border-border rounded-sm p-6">
            <div className="mb-5">
              <h2 className="font-heading text-xl font-semibold text-oroko-black">Privacy Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Control what other members can see on your public profile and in the directory.
              </p>
            </div>
            <PrivacySettingsForm settings={privacySettings} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
