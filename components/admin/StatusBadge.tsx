import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-oroko-green/10 text-oroko-green",
  approved: "bg-oroko-green/10 text-oroko-green",
  published: "bg-oroko-green/10 text-oroko-green",
  paid: "bg-oroko-green/10 text-oroko-green",
  succeeded: "bg-oroko-green/10 text-oroko-green",
  resolved: "bg-oroko-green/10 text-oroko-green",
  confirmed: "bg-oroko-green/10 text-oroko-green",
  attended: "bg-oroko-green/10 text-oroko-green",
  completed: "bg-oroko-green/10 text-oroko-green",

  pending: "bg-oroko-gold/15 text-oroko-gold-light text-oroko-black/70",
  under_review: "bg-oroko-gold/15 text-oroko-black/70",
  needs_information: "bg-oroko-gold/15 text-oroko-black/70",
  submitted: "bg-oroko-gold/15 text-oroko-black/70",
  draft: "bg-muted text-muted-foreground",
  new: "bg-oroko-gold/15 text-oroko-black/70",
  in_progress: "bg-oroko-gold/15 text-oroko-black/70",
  scheduled: "bg-oroko-gold/15 text-oroko-black/70",
  unpaid: "bg-oroko-gold/15 text-oroko-black/70",

  suspended: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
  cancelled: "bg-destructive/10 text-destructive",
  failed: "bg-destructive/10 text-destructive",

  resigned: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
  refunded: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";
  const label = status.replace(/_/g, " ");
  return (
    <Badge variant="outline" className={cn("border-transparent capitalize", style)}>
      {label}
    </Badge>
  );
}
