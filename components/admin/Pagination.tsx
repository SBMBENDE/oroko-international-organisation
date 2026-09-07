import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-1 py-3 text-sm text-muted-foreground">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}
        >
          <ChevronLeft className="size-3.5" /> Prev
        </Link>
        <Link
          href={buildHref(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={`flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-muted"}`}
        >
          Next <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
