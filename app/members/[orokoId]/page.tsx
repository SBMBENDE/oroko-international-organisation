import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMemberByOrokoId } from "@/lib/dal/profile";
import { getCountryName } from "@/lib/countries";
import {
  MapPin,
  Briefcase,
  Globe,
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";

type Props = { params: Promise<{ orokoId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orokoId } = await params;
  const member = await getMemberByOrokoId(orokoId);
  if (!member) return { title: "Member Not Found" };
  return { title: `${member.firstName} ${member.lastName} · OROKO Member` };
}

export default async function MemberProfilePage({ params }: Props) {
  const { orokoId } = await params;
  const member = await getMemberByOrokoId(orokoId);
  if (!member) notFound();

  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar-aware top bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
        >
          <ArrowLeft className="size-3.5" />
          Back to Directory
        </Link>

        {/* Cover */}
        <div className="bg-oroko-green h-24 rounded-t-sm oroko-pattern" />

        {/* Card */}
        <div className="bg-white border border-border border-t-0 rounded-b-sm px-6 pb-8">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-5">
            <div className="relative">
              <div className="size-20 rounded-full border-4 border-white overflow-hidden bg-oroko-green">
                {member.profilePhoto ? (
                  <Image
                    src={member.profilePhoto}
                    alt={`${member.firstName} ${member.lastName}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
              {member.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <ShieldCheck className="size-4 text-oroko-gold" />
                </div>
              )}
            </div>
            <span className="text-xs font-mono tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-sm border border-border">
              {member.orokoId}
            </span>
          </div>

          {/* Name */}
          <div className="mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-2xl font-bold text-oroko-black">
                {member.firstName} {member.lastName}
              </h1>
              {member.isVerified && (
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm bg-oroko-gold/10 text-oroko-gold border border-oroko-gold/20 font-semibold">
                  Verified
                </span>
              )}
            </div>
            {member.headline && (
              <p className="text-muted-foreground mt-1">{member.headline}</p>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm text-muted-foreground">
            {member.country && (
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-oroko-gold" />
                {member.city ? `${member.city}, ` : ""}
                {getCountryName(member.country)}
              </div>
            )}
            {member.occupation && (
              <div className="flex items-center gap-2">
                <Briefcase className="size-3.5 shrink-0 text-oroko-gold" />
                {member.occupation}
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="size-3.5 shrink-0 text-oroko-gold" />
              Member since{" "}
              {new Date(member.memberSince).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </div>
            <div className="flex items-center gap-2 capitalize">
              <span
                className={`size-2 rounded-full inline-block ${
                  member.membershipType === "founding" ? "bg-oroko-gold" : "bg-oroko-green"
                }`}
              />
              {member.membershipType} membership
            </div>
          </div>

          <div className="oroko-divider mb-6" />

          <p className="text-xs text-muted-foreground text-center tracking-wider">
            OROKO International Organization · Unity · Excellence · Global Impact
          </p>
        </div>
      </div>
    </div>
  );
}
