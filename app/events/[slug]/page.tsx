import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/dal/events";
import { EventRegistrationForm } from "@/components/events/EventRegistrationForm";
import { auth } from "@/auth";
import { Calendar, MapPin, Video, Users, Clock, Tag, ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };
  return { title: event.title, description: event.summary };
}

const formatIcon = { virtual: Video, hybrid: Video, in_person: MapPin };
const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const [event, session] = await Promise.all([getEventBySlug(slug), auth()]);
  if (!event) notFound();

  const FormatIcon = formatIcon[event.format as keyof typeof formatIcon] ?? MapPin;
  const now = new Date();
  const isPast = new Date(event.startDate) < now;
  const deadlinePassed = event.registrationDeadline ? new Date(event.registrationDeadline) < now : false;
  const registrationOpen = event.status === "published" && !isPast && !deadlinePassed;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8">
        <ArrowLeft className="size-3.5" /> Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {event.coverImage && (
            <div className="relative h-64 rounded-sm overflow-hidden">
              <Image src={event.coverImage} alt={event.title} fill className="object-cover" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm", statusColors[event.status] ?? statusColors.published)}>
                {event.status}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-border text-muted-foreground rounded-sm">
                {event.type}
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-oroko-black mb-3">{event.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{event.summary}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-t border-b border-border">
            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-oroko-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Date & Time</p>
                <p className="text-sm font-medium text-oroko-black">
                  {new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                {event.endDate && (
                  <p className="text-xs text-muted-foreground">
                    to {new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FormatIcon className="size-4 text-oroko-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  {event.format === "virtual" ? "Online" : "Location"}
                </p>
                {event.venue.name && <p className="text-sm font-medium text-oroko-black">{event.venue.name}</p>}
                {(event.venue.city || event.venue.country) && (
                  <p className="text-xs text-muted-foreground">
                    {[event.venue.address, event.venue.city, event.venue.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {event.venue.virtualLink && event.format !== "in_person" && (
                  <a href={event.venue.virtualLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-oroko-green hover:text-oroko-gold mt-0.5 transition-colors">
                    <ExternalLink className="size-3" /> Join online
                  </a>
                )}
              </div>
            </div>
            {event.capacity && (
              <div className="flex items-start gap-3">
                <Users className="size-4 text-oroko-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Capacity</p>
                  <p className="text-sm text-oroko-black">
                    {event.attendeeCount} / {event.capacity} registered
                    {event.spotsLeft != null && event.spotsLeft < 20 && (
                      <span className="text-red-500 ml-1">({event.spotsLeft} left)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            {event.registrationDeadline && (
              <div className="flex items-start gap-3">
                <Clock className="size-4 text-oroko-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Registration Deadline</p>
                  <p className={cn("text-sm", deadlinePassed ? "text-destructive" : "text-oroko-black")}>
                    {new Date(event.registrationDeadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    {deadlinePassed && " (closed)"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-oroko-black mb-3">About this event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* Schedule */}
          {event.schedule.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-oroko-black mb-5">Programme</h2>
              <div className="space-y-0 divide-y divide-border border border-border rounded-sm overflow-hidden">
                {event.schedule.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white">
                    <div className="w-16 shrink-0 text-xs font-mono font-semibold text-oroko-gold pt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-oroko-black">{item.title}</p>
                      {item.speaker && <p className="text-xs text-muted-foreground mt-0.5">Speaker: {item.speaker}</p>}
                      {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="size-3.5 text-muted-foreground" />
              {event.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-sm bg-muted border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — registration */}
        <div>
          <div className="bg-white border border-oroko-gold/20 rounded-sm p-6 sticky top-24">
            <h3 className="font-heading text-xl font-semibold text-oroko-black mb-5">
              {registrationOpen ? "Register" : isPast ? "Event has passed" : "Registrations closed"}
            </h3>
            {registrationOpen ? (
              <EventRegistrationForm
                eventId={event.id}
                ticketTypes={event.ticketTypes}
                defaultName={session?.user?.name ?? ""}
                defaultEmail={session?.user?.email ?? ""}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {isPast
                  ? "This event has already taken place."
                  : deadlinePassed
                    ? "The registration deadline has passed."
                    : "Registration is not open for this event."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
