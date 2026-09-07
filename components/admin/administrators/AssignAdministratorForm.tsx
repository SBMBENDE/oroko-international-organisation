"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { assignAdminRole } from "@/actions/admin/administrators.actions";
import { ROLE_LABELS } from "@/lib/permissions";

const ASSIGNABLE_ROLES = [
  "superadmin", "admin", "membership_admin", "finance_admin", "event_admin",
  "project_admin", "welfare_admin", "content_admin", "viewer",
];

export function AssignAdministratorForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email.trim()) { setError("Enter the member's email address"); return; }
    setIsSubmitting(true);
    const result = await assignAdminRole(email.trim(), role);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed to assign role"); return; }
    setSuccess(`${email} is now a ${ROLE_LABELS[role]}.`);
    setEmail("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="space-y-1.5 flex-1 min-w-55">
        <Label htmlFor="admin-email">Member email</Label>
        <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="member@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label>Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v ?? "viewer")}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ASSIGNABLE_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Assign Role"}</Button>
      {error && <p className="text-sm text-destructive w-full">{error}</p>}
      {success && <p className="text-sm text-oroko-green w-full">{success}</p>}
    </form>
  );
}
