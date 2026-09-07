import { cn } from "@/lib/utils";

export function AdminTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-muted/60 border-b border-border">
      <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:uppercase [&>th]:tracking-wide [&>th]:text-muted-foreground [&>th]:font-medium">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn("border-b border-border last:border-0 hover:bg-muted/30 transition-colors [&>td]:px-4 [&>td]:py-3 [&>td]:align-middle", className)}>
      {children}
    </tr>
  );
}
