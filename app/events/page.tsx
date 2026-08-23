import type { Metadata } from "next";
import { getUpcomingEvents, getPastEvents } from "@/lib/dal/events";
import { EventCard } from "@/components/events/EventCard";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(6)]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
            Community Gatherings
          </span>
        </div>
        <h1 className="font-heading text-5xl font-bold text-oroko-black mb-4">Events</h1>
        <p className="text-muted-foreground leading-relaxed">
          OROKO International convenes conventions, seminars, cultural celebrations and community
          gatherings that bring our global membership together.
        </p>
      </div>

      {/* Upcoming */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-sm">
            <CalendarDays className="size-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-heading text-xl text-oroko-black">No upcoming events</p>
            <p className="text-muted-foreground text-sm mt-1">Check back soon — new events will be announced here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">Past Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {past.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}
