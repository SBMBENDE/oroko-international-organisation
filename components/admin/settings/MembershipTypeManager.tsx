"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createMembershipType, toggleMembershipType } from "@/actions/admin/settings.actions";

interface MembershipTypeManagerProps {
  types: { id: string; name: string; slug: string; isActive: boolean }[];
}

export function MembershipTypeManager({ types }: MembershipTypeManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setError(null);
    setIsSubmitting(true);
    const result = await createMembershipType({ name: name.trim() });
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setName("");
    router.refresh();
  }

  async function handleToggle(id: string, isActive: boolean) {
    await toggleMembershipType(id, !isActive);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New membership type name" className="flex-1" />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding…" : "Add Type"}</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <ul className="divide-y divide-border">
        {types.map((t) => (
          <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-oroko-black">{t.name}</span>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={t.isActive ? "text-oroko-green border-transparent bg-oroko-green/10" : "text-muted-foreground"}>
                {t.isActive ? "Active" : "Inactive"}
              </Badge>
              <Button type="button" size="xs" variant="outline" onClick={() => handleToggle(t.id, t.isActive)}>
                {t.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
