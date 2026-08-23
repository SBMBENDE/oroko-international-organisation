import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Video, Users, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventSummary } from "@/lib/dal/events";

const typeStyle: Record<string, string> = {
  convention: "bg-purple-50 text-purple-600 border-purple-200",
  seminar: "bg-blue-50 text-blue-600 border-blue-200",
  cultural: "bg-oroko-gold/10 text-oroko-gold border-oroko-gold/20",
  meeting: "bg-muted text-muted-foreground border-border",
  webinar: "bg-cyan-50 text-cyan-600 border-cyan-200",
  social: "bg-pink-50 text-pink-600 border-pink-200",
  fundraising: "bg-emerald-50 text-emerald-600 border-emerald-200",
  other: "bg-muted text-muted-foreground border-border",
};

const formatIcon = { virtual: Video, hybrid: Video, in_person: MapPin };

export function EventCard({ event }: { event: EventSummary }) {
  const Icon = formatIcon[event.format as keyof typeof formatIcon] ?? MapPin;
  const date = new Date(event.startDate);
  const isPast = date < new Date();
  const registrationOpen =
    !isPast &&
    event.status === "published" &&
    (!event.registrationDeadline || new Date(event.registrationDeadline) > new Date());

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-white border border-border rounded-sm overflow-hidden hover:border-oroko-gold/30 hover:shadow-sm transition-all"
    >
      {/* Cover */}
      <div className="relative h-44 bg-oroko-green/10 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center oroko-pattern">
            <Calendar className="size-8 text-oroko-green/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm", typeStyle[event.type] ?? typeStyle.other)}>
            {event.type}
          </span>
          {event.isFeatured && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-oroko-gold text-oroko-black rounded-sm">
              Featured
            </span>
          )}
        </div>
        {isPast && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-black/60 text-white rounded-sm">Past</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-oroko-black mb-2 line-clamp-2 group-hover:text-oroko-green transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.summary}</p>

        <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-oroko-gold shrink-0" />
            {date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
          </div>
          {(event.city || event.country) && (
            <div className="flex items-center gap-1.5">
              <Icon className="size-3.5 text-oroko-gold shrink-0" />
              {[event.city, event.country].filter(Boolean).join(", ")}
            </div>
          )}
          {event.spotsLeft != null && event.spotsLeft < 20 && (
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 text-red-400 shrink-0" />
              <span className="text-red-500 font-medium">{event.spotsLeft} spots left</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-semibold", event.isFree ? "text-emerald-600" : "text-oroko-black")}>
            {event.isFree ? "Free" : `From ${event.currency} ${event.lowestPrice}`}
          </span>
          {registrationOpen && (
            <span className="text-[10px] uppercase tracking-wider text-oroko-green font-semibold">
              Register →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
