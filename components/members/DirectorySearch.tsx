"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

export function DirectorySearch() {
  const router = useRouter();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [country, setCountry] = useState(sp.get("country") ?? "");

  // Debounce text search
  useEffect(() => {
    const t = setTimeout(() => push(q, country), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function push(search: string, ctry: string) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (ctry) params.set("country", ctry);
    startTransition(() => router.push(`/members?${params.toString()}`));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Text search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search members by name or occupation…"
          className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-white text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); push("", country); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Country filter */}
      <select
        value={country}
        onChange={(e) => { setCountry(e.target.value); push(q, e.target.value); }}
        className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-40"
      >
        <option value="">All countries</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>

      {isPending && (
        <div className="flex items-center text-xs text-muted-foreground">
          Searching…
        </div>
      )}
    </div>
  );
}
