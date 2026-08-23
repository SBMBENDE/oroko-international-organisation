import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, Briefcase } from "lucide-react";
import { getCountryName } from "@/lib/countries";
import type { PublicMember } from "@/lib/dal/profile";

export function MemberCard({ member }: { member: PublicMember }) {
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  return (
    <Link
      href={`/members/${member.orokoId}`}
      className="group block bg-white border border-border rounded-sm p-5 hover:border-oroko-gold/40 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="size-12 rounded-full overflow-hidden bg-oroko-green shrink-0 flex items-center justify-center">
          {member.profilePhoto ? (
            <Image
              src={member.profilePhoto}
              alt={`${member.firstName} ${member.lastName}`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="font-heading font-bold text-white text-sm">{initials}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-oroko-black text-sm truncate">
              {member.firstName} {member.lastName}
            </p>
            {member.isVerified && (
              <ShieldCheck className="size-3.5 text-oroko-gold shrink-0" />
            )}
          </div>
          {member.occupation && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
              <Briefcase className="size-3 shrink-0" />
              {member.occupation}
            </p>
          )}
          {member.country && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 shrink-0" />
              {member.city ? `${member.city}, ` : ""}
              {getCountryName(member.country)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
          {member.orokoId}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {member.membershipType}
        </span>
      </div>
    </Link>
  );
}
