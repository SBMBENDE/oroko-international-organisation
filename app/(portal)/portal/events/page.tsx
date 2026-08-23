import type { Metadata } from "next";
import Link from "next/link";
import { getMyRegistrations } from "@/lib/dal/events";
import { cancelRegistrationVoid } from "@/actions/event.actions";
import { CalendarDays, Ticket, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My Events" };

const statusStyle: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  attended: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default async function MyEventsPage() {
  const registrations = await getMyRegistrations();
  const upcoming = registrations.filter((r) => new Date(r.eventStartDate) >= new Date() && r.status !== "cancelled");
  const past = registrations.filter((r) => new Date(r.eventStartDate) < new Date() || r.status === "cancelled");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="h-px w-6 bg-oroko-gold" />
            <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">My Account</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-oroko-black">My Events</h1>
        </div>
        <Link href="/events" className="inline-flex items-center gap-2 px-5 py-2.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.15em] uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm">
          <CalendarDays className="size-3.5" /> Browse events
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-sm">
          <Ticket className="size-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-heading text-xl text-oroko-black">No registrations yet</p>
          <p className="text-muted-foreground text-sm mt-1">Browse and register for upcoming OROKO events.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold text-oroko-black mb-4">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((r) => <RegistrationRow key={r.id} reg={r} showCancel />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-bold text-oroko-black mb-4">Past & Cancelled</h2>
              <div className="space-y-3 opacity-70">
                {past.map((r) => <RegistrationRow key={r.id} reg={r} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function RegistrationRow({
  reg,
  showCancel,
}: {
  reg: ReturnType<typeof Array.prototype.map> extends (infer T)[] ? T : never;
  showCancel?: boolean;
}) {
  const r = reg as import("@/lib/dal/events").MyRegistration;
  return (
    <div className="bg-white border border-border rounded-sm p-5 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Link href={`/events/${r.eventSlug}`} className="font-semibold text-oroko-black hover:text-oroko-green transition-colors">
            {r.eventTitle}
          </Link>
          <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 border rounded-sm", statusStyle[r.status] ?? statusStyle.pending)}>
            {r.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(r.eventStartDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {r.ticketTypeName} × {r.quantity}
        </p>
        <p className="font-mono text-xs text-oroko-gold font-bold mt-1">{r.registrationCode}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/portal/events/${r.id}`}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-sm text-muted-foreground hover:text-oroko-black hover:border-oroko-black/30 transition-colors"
        >
          <QrCode className="size-3.5" /> View ticket
        </Link>
        {showCancel && r.status !== "cancelled" && (
          <form action={cancelRegistrationVoid.bind(null, r.id)}>
            <button type="submit" className="text-xs text-destructive hover:underline">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}
