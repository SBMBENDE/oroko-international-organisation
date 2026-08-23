import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getRegistrationById } from "@/lib/dal/events";
import { EventTicket } from "@/components/events/EventTicket";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "My Ticket" };

export default async function TicketPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { id } = await params;
  const registration = await getRegistrationById(id);
  if (!registration) notFound();

  // Build QR value server-side to avoid hydration mismatch
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const qrValue = `${protocol}://${host}/events/${registration.eventSlug}?code=${registration.registrationCode}`;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/portal/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> My Events
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-6 bg-oroko-gold" />
          <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">Digital Ticket</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-oroko-black">Your Ticket</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Present this ticket or your registration code at the event entrance.
        </p>
      </div>

      <EventTicket registration={registration} qrValue={qrValue} />
    </div>
  );
}
