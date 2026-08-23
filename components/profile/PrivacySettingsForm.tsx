"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { updatePrivacySettings } from "@/actions/profile.actions";
import type { IPrivacySettings } from "@/models/User";

type Props = { settings: IPrivacySettings };

type SettingKey = keyof IPrivacySettings;

const SETTINGS: { key: SettingKey; label: string; description: string }[] = [
  {
    key: "isDirectoryVisible",
    label: "Show in member directory",
    description: "Allow other members to find you in the OROKO directory",
  },
  {
    key: "showCountry",
    label: "Show country & city",
    description: "Display your location on your public profile",
  },
  {
    key: "showOccupation",
    label: "Show occupation & employer",
    description: "Display your professional details on your public profile",
  },
  {
    key: "showPhone",
    label: "Show phone number",
    description: "Allow members to see your phone number",
  },
  {
    key: "showEmail",
    label: "Show email address",
    description: "Allow members to see your email address",
  },
];

export function PrivacySettingsForm({ settings }: Props) {
  const [values, setValues] = useState<IPrivacySettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: SettingKey) =>
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await updatePrivacySettings(values);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error ?? "Failed to save");
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ul className="divide-y divide-border">
        {SETTINGS.map(({ key, label, description }) => (
          <li key={key} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-oroko-black">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values[key]}
              onClick={() => toggle(key)}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                values[key] ? "bg-oroko-green" : "bg-input"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg transform transition-transform duration-200 ${
                  values[key] ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.15em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm"
        >
          {saving && <Loader2 className="size-3.5 animate-spin" />}
          {saving ? "Saving…" : "Save Privacy Settings"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle className="size-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
