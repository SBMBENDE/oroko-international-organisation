import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import type { OfficerProfile } from "@/lib/dal/governance";

export function OfficerCard({ officer }: { officer: OfficerProfile }) {
  const initials = officer.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border border-border rounded-sm p-6 flex flex-col items-center text-center group hover:border-oroko-gold/30 hover:shadow-sm transition-all">
      {/* Avatar */}
      <div className="size-20 rounded-full overflow-hidden bg-oroko-green border-2 border-border mb-4 flex items-center justify-center shrink-0">
        {officer.userPhoto ? (
          <Image
            src={officer.userPhoto}
            alt={officer.userName}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-heading text-xl font-bold text-white">{initials}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-heading text-lg font-semibold text-oroko-black leading-tight">
        {officer.userName}
      </h3>

      {/* Role badge */}
      <span className="mt-1.5 text-xs tracking-[0.15em] uppercase font-semibold text-oroko-gold px-2.5 py-0.5 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20">
        {officer.roleName}
      </span>

      {officer.term && (
        <p className="text-xs text-muted-foreground mt-2">Term: {officer.term}</p>
      )}

      {officer.bio && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
          {officer.bio}
        </p>
      )}

      {officer.responsibilities.length > 0 && (
        <ul className="mt-3 space-y-1 self-stretch text-left">
          {officer.responsibilities.slice(0, 3).map((r, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="size-1 rounded-full bg-oroko-gold mt-1.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
