"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateOrgSettings } from "@/actions/admin/settings.actions";

interface OrgSettingsFormProps {
  defaultValues: {
    organizationName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    notifyOnNewApplication: boolean;
    notifyOnNewDonation: boolean;
    notifyOnWelfareRequest: boolean;
  };
}

export function OrgSettingsForm({ defaultValues }: OrgSettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(defaultValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    const result = await updateOrgSettings(values);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed to save"); return; }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-oroko-green">Settings saved.</p>}

      <div className="space-y-1.5">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input id="organizationName" value={values.organizationName} onChange={(e) => setValues((v) => ({ ...v, organizationName: e.target.value }))} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" type="email" value={values.contactEmail} onChange={(e) => setValues((v) => ({ ...v, contactEmail: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input id="contactPhone" value={values.contactPhone} onChange={(e) => setValues((v) => ({ ...v, contactPhone: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={values.address} onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))} />
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-sm font-medium text-oroko-black">Notification Settings</p>
        {([
          ["notifyOnNewApplication", "Notify on new membership application"],
          ["notifyOnNewDonation", "Notify on new donation"],
          ["notifyOnWelfareRequest", "Notify on new welfare request"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values[key]}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.checked }))}
              className="size-4 accent-oroko-gold"
            />
            {label}
          </label>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Settings"}</Button>
    </form>
  );
}
