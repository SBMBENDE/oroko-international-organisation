"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { updateMemberProfile } from "@/actions/admin/members.actions";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  city: z.string().optional(),
  profession: z.string().optional(),
  organization: z.string().optional(),
  membershipType: z.string().min(1, "Required"),
  paymentStatus: z.enum(["paid", "unpaid", "waived"]),
});

type FormValues = z.infer<typeof schema>;

interface MemberEditFormProps {
  memberId: string;
  membershipTypes: { slug: string; name: string }[];
  defaultValues: FormValues;
}

export function MemberEditForm({ memberId, membershipTypes, defaultValues }: MemberEditFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    setSuccess(false);
    const result = await updateMemberProfile(memberId, data);
    if (!result.success) {
      setServerError(result.error ?? "Failed to save");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {success && <p className="text-sm text-oroko-green">Profile updated.</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="country">Country of Residence</Label>
          <Input id="country" {...register("country")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="countryOfOrigin">Country of Origin</Label>
          <Input id="countryOfOrigin" {...register("countryOfOrigin")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profession">Profession</Label>
          <Input id="profession" {...register("profession")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="organization">Organization / Company</Label>
        <Input id="organization" {...register("organization")} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Membership Type</Label>
          <Select value={watch("membershipType")} onValueChange={(v) => setValue("membershipType", v ?? "")}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {membershipTypes.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Payment Status</Label>
          <Select value={watch("paymentStatus")} onValueChange={(v) => setValue("paymentStatus", (v ?? "unpaid") as FormValues["paymentStatus"])}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Payment status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="waived">Waived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Changes"}</Button>
    </form>
  );
}
