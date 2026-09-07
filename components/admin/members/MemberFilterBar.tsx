"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface MemberFilterBarProps {
  membershipTypes: { slug: string; name: string }[];
  countries: string[];
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected", label: "Rejected" },
  { value: "resigned", label: "Resigned" },
];

export function MemberFilterBar({ membershipTypes, countries }: MemberFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-55">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, phone, or Member ID…"
          className="pl-8"
        />
      </form>

      <Select value={searchParams.get("status") ?? ""} onValueChange={(v) => updateParam("status", !v || v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={searchParams.get("membershipType") ?? ""} onValueChange={(v) => updateParam("membershipType", !v || v === "all" ? "" : v)}>
        <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Membership Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {membershipTypes.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      {countries.length > 0 && (
        <Select value={searchParams.get("country") ?? ""} onValueChange={(v) => updateParam("country", !v || v === "all" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
