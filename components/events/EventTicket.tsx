"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { Printer, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyRegistration } from "@/lib/dal/events";

const statusStyle: Record<string, { color: string; icon: typeof CheckCircle }> = {
  confirmed: { color: "text-emerald-500", icon: CheckCircle },
  attended: { color: "text-emerald-500", icon: CheckCircle },
  pending: { color: "text-amber-500", icon: Clock },
  cancelled: { color: "text-destructive", icon: XCircle },
};

type Props = {
  registration: MyRegistration;
  /** Built on server to avoid hydration mismatch */
  qrValue: string;
};

export function EventTicket({ registration, qrValue }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { color, icon: StatusIcon } = statusStyle[registration.status] ?? statusStyle.pending;

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        className="max-w-sm mx-auto bg-oroko-black rounded-sm overflow-hidden border border-oroko-gold/20 shadow-xl"
      >
        {/* Header band */}
        <div className="bg-oroko-green px-5 pt-5 pb-4 oroko-pattern">
          <p className="text-oroko-gold text-[9px] tracking-[0.35em] uppercase font-medium mb-1">
            OROKO International
          </p>
          <h2 className="font-heading text-xl font-bold text-white leading-tight">
            {registration.eventTitle}
          </h2>
          <p className="text-white/50 text-xs mt-1">
            {new Date(registration.eventStartDate).toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">Attendee</p>
              <p className="text-white text-sm font-semibold">{registration.ticketTypeName}</p>
            </div>
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase">Code</p>
              <p className="text-oroko-gold font-mono text-base tracking-widest font-bold">
                {registration.registrationCode}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusIcon className={cn("size-3.5", color)} />
              <span className={cn("text-xs font-semibold capitalize", color)}>
                {registration.status}
              </span>
            </div>
          </div>

          {/* QR code */}
          <div className="bg-white p-1.5 rounded-sm shrink-0">
            <QRCode value={qrValue} size={80} bgColor="#ffffff" fgColor="#0A0A0A" level="M" />
          </div>
        </div>

        {registration.quantity > 1 && (
          <div className="px-5 pb-4">
            <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mb-0.5">Tickets</p>
            <p className="text-white text-sm">{registration.quantity}× tickets</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase text-center">
            Unity · Culture · Development
          </p>
        </div>
      </div>

      <div className="flex justify-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wider uppercase text-muted-foreground hover:text-oroko-black hover:border-oroko-black/30 transition-colors rounded-sm"
        >
          <Printer className="size-3.5" /> Print ticket
        </button>
      </div>
    </div>
  );
}
