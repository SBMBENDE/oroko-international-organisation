"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/actions/profile.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

type Props = { defaults: ProfileInput };

export function ProfileEditForm({ defaults }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaults,
  });

  // Sync form when the server refreshes with updated data from DB
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const onSubmit = async (data: ProfileInput) => {
    setServerError(null);
    const result = await updateProfile(data);
    if (!result.success) {
      setServerError(result.error ?? "Failed to save");
      return;
    }
    // Reset so isDirty clears and form reflects what is now in DB
    reset(data);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (label: string, id: keyof ProfileInput, placeholder?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs tracking-wider uppercase text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        {...register(id)}
        className={cn(errors[id] && "border-destructive")}
      />
      {errors[id] && <p className="text-xs text-destructive">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-sm bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Personal */}
      <section className="space-y-4">
        <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-oroko-gold border-b border-border pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("First Name", "firstName", "First name")}
          {field("Last Name", "lastName", "Last name")}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="headline" className="text-xs tracking-wider uppercase text-muted-foreground">
            Headline
          </Label>
          <Input
            id="headline"
            placeholder="e.g. Software Engineer · Community Builder"
            {...register("headline")}
            className={cn(errors.headline && "border-destructive")}
          />
          {errors.headline && <p className="text-xs text-destructive">{errors.headline.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-xs tracking-wider uppercase text-muted-foreground">
            Bio <span className="normal-case font-normal text-muted-foreground">(max 500 chars)</span>
          </Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Tell the OROKO community about yourself…"
            {...register("bio")}
            className={cn(errors.bio && "border-destructive")}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-oroko-gold border-b border-border pb-2">
          Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="country" className="text-xs tracking-wider uppercase text-muted-foreground">
              Country
            </Label>
            <select
              id="country"
              {...register("country")}
              className="w-full h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
            >
              <option value="">Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {field("City", "city", "City")}
        </div>
        {field("Phone", "phone", "+1 234 567 8900")}
      </section>

      {/* Professional */}
      <section className="space-y-4">
        <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-oroko-gold border-b border-border pb-2">
          Professional
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Occupation", "occupation", "e.g. Software Engineer")}
          {field("Employer / Organisation", "employer", "e.g. Acme Corp")}
        </div>
        {field("Website", "website", "https://yourwebsite.com")}
        {field("LinkedIn URL", "linkedIn", "https://linkedin.com/in/yourprofile")}
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.15em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm"
        >
          {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
          {isSubmitting ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle className="size-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
