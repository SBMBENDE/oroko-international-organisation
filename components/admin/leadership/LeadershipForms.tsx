"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { createLeadershipRole, assignLeadershipPosition } from "@/actions/admin/leadership.actions";

interface LeadershipFormsProps {
  roles: { id: string; name: string }[];
}

export function LeadershipForms({ roles }: LeadershipFormsProps) {
  const router = useRouter();
  const [roleName, setRoleName] = useState("");
  const [roleError, setRoleError] = useState<string | null>(null);
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [term, setTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bio, setBio] = useState("");
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  async function handleCreateRole(e: React.FormEvent) {
    e.preventDefault();
    if (!roleName.trim()) { setRoleError("Name is required"); return; }
    setRoleError(null);
    setRoleSubmitting(true);
    const result = await createLeadershipRole({ name: roleName.trim(), organ: "executive" });
    setRoleSubmitting(false);
    if (!result.success) { setRoleError(result.error ?? "Failed"); return; }
    setRoleName("");
    router.refresh();
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssignError(null);
    setAssignSubmitting(true);
    const result = await assignLeadershipPosition({ email, roleId, term, startDate, endDate, bio });
    setAssignSubmitting(false);
    if (!result.success) { setAssignError(result.error ?? "Failed"); return; }
    setEmail(""); setTerm(""); setStartDate(""); setEndDate(""); setBio("");
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 space-y-3">
        <p className="font-heading font-medium text-oroko-black">Create Position</p>
        <form onSubmit={handleCreateRole} className="flex gap-2">
          <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. President" className="flex-1" />
          <Button type="submit" disabled={roleSubmitting}>{roleSubmitting ? "Adding…" : "Add"}</Button>
        </form>
        {roleError && <p className="text-sm text-destructive">{roleError}</p>}
      </div>

      <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 space-y-3">
        <p className="font-heading font-medium text-oroko-black">Assign Member to Position</p>
        <form onSubmit={handleAssign} className="space-y-2.5">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Member email" required />
          <Select value={roleId} onValueChange={(v) => setRoleId(v ?? "")}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select position" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term (e.g. 2025-2027)" />
            <div />
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">End Date (optional)</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short biography (optional)" rows={2} />
          {assignError && <p className="text-sm text-destructive">{assignError}</p>}
          <Button type="submit" disabled={assignSubmitting || roles.length === 0}>{assignSubmitting ? "Assigning…" : "Assign Position"}</Button>
        </form>
      </div>
    </div>
  );
}
