import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-oroko-green bg-oroko-green/10",
  warning: "text-oroko-gold bg-oroko-gold/10",
  danger: "text-destructive bg-destructive/10",
  success: "text-oroko-green bg-oroko-green/10",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        {Icon && (
          <span className={cn("flex size-8 items-center justify-center rounded-lg", toneClasses[tone])}>
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <span className="font-heading text-2xl font-semibold text-oroko-black">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}
