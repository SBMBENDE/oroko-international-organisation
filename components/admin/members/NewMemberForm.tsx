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
import { createMember } from "@/actions/admin/members.actions";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  membershipType: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

export function NewMemberForm({ membershipTypes }: { membershipTypes: { slug: string; name: string }[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { membershipType: membershipTypes[0]?.slug ?? "regular" },
  });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const result = await createMember(data);
    if (!result.success) {
      setServerError(result.error ?? "Failed to create member");
      return;
    }
    router.push(`/admin/members/${result.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

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

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country of Residence</Label>
          <Input id="country" {...register("country")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Membership Type</Label>
        <Select value={watch("membershipType")} onValueChange={(v) => setValue("membershipType", v ?? "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {membershipTypes.map((t) => <SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        The member will be created with Active status and a random temporary password.
        Share login instructions with them directly — password reset self-service is not yet implemented.
      </p>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create Member"}</Button>
    </form>
  );
}
