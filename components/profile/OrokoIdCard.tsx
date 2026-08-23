"use client";

import { useRef } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Download, Printer, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  orokoId: string;
  memberName: string;
  membershipType: string;
  memberSince: string;
  status: string;
  initials: string;
  profilePhoto?: string;
  isVerified?: boolean;
  /** Full URL encoded in the QR code — supplied by the Server Component */
  profileUrl: string;
};

const statusLabel: Record<string, string> = {
  active: "Active",
  pending: "Pending Activation",
  suspended: "Suspended",
  expired: "Expired",
};

const statusColor: Record<string, string> = {
  active: "text-emerald-400",
  pending: "text-oroko-gold",
  suspended: "text-destructive",
  expired: "text-white/40",
};

export function OrokoIdCard({
  orokoId,
  memberName,
  membershipType,
  memberSince,
  status,
  initials,
  profilePhoto,
  isVerified = false,
  profileUrl,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const print = () => window.print();

  return (
    <div className="space-y-6">
      {/* Card */}
      <div
        ref={cardRef}
        className="max-w-sm mx-auto bg-oroko-black rounded-sm overflow-hidden border border-oroko-gold/20 shadow-2xl print:shadow-none"
        id="oroko-id-card"
      >
        {/* Header band */}
        <div className="bg-oroko-green px-5 pt-5 pb-4 oroko-pattern">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-oroko-gold text-[9px] tracking-[0.35em] uppercase font-medium">
                OROKO International
              </p>
              <p className="text-white/50 text-[9px] tracking-[0.25em] uppercase">
                Member Identification
              </p>
            </div>
            {isVerified && (
              <ShieldCheck className="size-4 text-oroko-gold" />
            )}
          </div>

          {/* Avatar — shows photo if available, otherwise initials */}
          <div className="size-14 rounded-full border-2 border-oroko-gold/30 overflow-hidden bg-white/10 flex items-center justify-center mb-3">
            {profilePhoto ? (
              <Image
                src={profilePhoto}
                alt={memberName}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="font-heading text-xl font-bold text-white">{initials}</span>
            )}
          </div>

          <p className="font-heading text-xl font-bold text-white leading-tight">
            {memberName}
          </p>
          <p className="text-white/50 text-xs capitalize mt-0.5">
            {membershipType} Member
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">Member ID</p>
              <p className="text-white font-mono text-sm tracking-widest font-semibold">
                {orokoId}
              </p>
            </div>
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">Member Since</p>
              <p className="text-white text-xs">
                {new Date(memberSince).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">Status</p>
              <p className={cn("text-xs font-semibold capitalize", statusColor[status] ?? "text-white/50")}>
                {statusLabel[status] ?? status}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-1.5 rounded-sm shrink-0">
            <QRCode
              value={profileUrl}
              size={80}
              bgColor="#ffffff"
              fgColor="#0A0A0A"
              level="M"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase text-center">
            Unity · Excellence · Global Impact
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={print}
          className="flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wider uppercase text-muted-foreground hover:text-oroko-black hover:border-oroko-black/30 transition-colors rounded-sm"
        >
          <Printer className="size-3.5" />
          Print
        </button>
        <button
          type="button"
          onClick={print}
          className="flex items-center gap-2 px-4 py-2 bg-oroko-gold text-oroko-black text-xs tracking-wider uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm"
        >
          <Download className="size-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}
