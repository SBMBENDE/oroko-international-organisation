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
import { createWelfareRequest } from "@/actions/admin/welfare.actions";

const TYPES = ["wedding", "childbirth", "hospitalization", "bereavement", "education", "other"];

export function NewWelfareRequestForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState("other");
  const [description, setDescription] = useState("");
  const [amountRequested, setAmountRequested] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await createWelfareRequest({
      email, requestType, description,
      amountRequested: amountRequested ? Number(amountRequested) : undefined,
    });
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    router.push(`/admin/welfare/${result.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="space-y-1.5">
        <Label htmlFor="email">Member Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label>Request Type</Label>
        <Select value={requestType} onValueChange={(v) => setRequestType(v ?? "other")}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="amountRequested">Amount Requested (USD, optional)</Label>
        <Input id="amountRequested" type="number" min={0} value={amountRequested} onChange={(e) => setAmountRequested(e.target.value)} />
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create Request"}</Button>
    </form>
  );
}
