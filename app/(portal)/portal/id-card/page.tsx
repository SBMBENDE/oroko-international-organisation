import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/dal/profile";
import { OrokoIdCard } from "@/components/profile/OrokoIdCard";

export const metadata: Metadata = { title: "My ID Card" };

export default async function IdCardPage() {
  const data = await getCurrentMember();
  if (!data) redirect("/auth/login");

  const { user, membership } = data;

  if (!membership?.orokoId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="font-heading text-2xl text-oroko-black mb-3">ID Card Not Yet Available</p>
        <p className="text-muted-foreground text-sm">
          Your OROKO Member ID is generated once your membership is processed.
        </p>
      </div>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Build full URL on the server so QR code value is identical on SSR and client
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const profileUrl = `${protocol}://${host}/members/${membership.orokoId}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-6 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Digital ID Card
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-oroko-black">Your OROKO Identity</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Present or share your digital member card. The QR code links to your public profile.
        </p>
      </div>

      <OrokoIdCard
        orokoId={membership.orokoId}
        memberName={`${user.firstName} ${user.lastName}`}
        membershipType={membership.membershipType}
        memberSince={membership.memberSince.toString()}
        status={membership.status}
        initials={initials}
        profilePhoto={user.profilePhoto}
        isVerified={user.isVerified}
        profileUrl={profileUrl}
      />
    </div>
  );
}
