import { Calendar, MapPin, Video, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MeetingSummary } from "@/lib/dal/governance";

const organLabel: Record<string, string> = {
  general_assembly: "General Assembly",
  executive: "Executive",
  committee: "Committee",
};

const statusStyle: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-600 border-blue-200",
  in_progress: "bg-emerald-50 text-emerald-600 border-emerald-200",
  completed: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

const formatIcon: Record<string, typeof Video> = {
  virtual: Video,
  hybrid: Video,
  in_person: MapPin,
};

export function MeetingCard({ meeting }: { meeting: MeetingSummary }) {
  const Icon = formatIcon[meeting.format] ?? MapPin;
  const date = new Date(meeting.date);
  const hasMinutes = meeting.isPublic && meeting.minutes;

  return (
    <div className="bg-white border border-border rounded-sm p-5 hover:border-oroko-gold/20 hover:shadow-sm transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-oroko-gold px-2 py-0.5 bg-oroko-gold/10 border border-oroko-gold/20 rounded-sm">
            {meeting.committeeName ?? organLabel[meeting.organ] ?? meeting.organ}
          </span>
          {meeting.sessionNumber && (
            <span className="text-[10px] text-muted-foreground">{meeting.sessionNumber}</span>
          )}
        </div>
        <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border rounded-sm shrink-0", statusStyle[meeting.status] ?? statusStyle.completed)}>
          {meeting.status.replace("_", " ")}
        </span>
      </div>

      <h3 className="font-heading text-base font-semibold text-oroko-black mb-3">
        {meeting.title}
      </h3>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" />
          {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        {meeting.venue && (
          <span className="flex items-center gap-1.5">
            <Icon className="size-3.5 shrink-0" />
            {meeting.venue}
          </span>
        )}
        {meeting.attendeeCount != null && (
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0" />
            {meeting.attendeeCount} attendees
          </span>
        )}
      </div>

      {/* Agenda preview */}
      {meeting.agendaItems.length > 0 && (
        <div className="border-t border-border/60 pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Agenda</p>
          <ol className="space-y-1">
            {meeting.agendaItems.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="shrink-0 font-medium">{i + 1}.</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {meeting.agendaItems.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{meeting.agendaItems.length - 3} more items
              </li>
            )}
          </ol>
        </div>
      )}

      {hasMinutes && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <p className="text-xs text-oroko-green font-medium">Minutes available</p>
        </div>
      )}
    </div>
  );
}
