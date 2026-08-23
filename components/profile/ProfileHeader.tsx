import Image from "next/image";
import { ShieldCheck, MapPin, Briefcase, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IUser } from "@/models/User";
import type { IMembership } from "@/models/Membership";
import { getCountryName } from "@/lib/countries";

type Props = {
  user: IUser;
  membership: IMembership | null;
  isOwner?: boolean;
};

export function ProfileHeader({ user, membership, isOwner = false }: Props) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden">
      {/* Cover band */}
      <div className="h-24 bg-oroko-green oroko-pattern" />

      <div className="px-6 pb-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            <div className="size-20 rounded-full border-4 border-white bg-oroko-green overflow-hidden">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={`${user.firstName} ${user.lastName}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="size-full flex items-center justify-center">
                  <span className="font-heading text-2xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <ShieldCheck className="size-4 text-oroko-gold" />
              </div>
            )}
          </div>

          {membership?.orokoId && (
            <span className="text-xs font-mono tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-sm border border-border">
              {membership.orokoId}
            </span>
          )}
        </div>

        {/* Name + headline */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl font-bold text-oroko-black">
              {user.firstName} {user.lastName}
            </h1>
            {user.isVerified && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-oroko-gold/10 text-oroko-gold border border-oroko-gold/20 font-semibold">
                Verified
              </span>
            )}
          </div>
          {user.headline && (
            <p className="text-muted-foreground mt-1">{user.headline}</p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground mb-4">
          {user.country && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              {user.city ? `${user.city}, ` : ""}
              {getCountryName(user.country)}
            </span>
          )}
          {user.occupation && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="size-3.5 shrink-0" />
              {user.occupation}
              {user.employer ? ` · ${user.employer}` : ""}
            </span>
          )}
          {membership && (
            <span className="flex items-center gap-1.5 capitalize">
              <span
                className={cn(
                  "size-2 rounded-full inline-block",
                  membership.status === "active"
                    ? "bg-emerald-500"
                    : "bg-amber-400"
                )}
              />
              {membership.membershipType} member
            </span>
          )}
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-foreground/70 leading-relaxed mb-4 max-w-2xl">
            {user.bio}
          </p>
        )}

        {/* Links */}
        {(user.website || user.linkedIn) && (
          <div className="flex gap-3">
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-oroko-green hover:text-oroko-gold transition-colors"
              >
                <Globe className="size-3.5" />
                Website
              </a>
            )}
            {user.linkedIn && (
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-oroko-green hover:text-oroko-gold transition-colors"
              >
                <ExternalLink className="size-3.5" />
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
