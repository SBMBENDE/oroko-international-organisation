"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, SendHorizonal, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/actions/contact.actions";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const result = await sendContactMessage(data);
    if (!result.success) {
      setServerError(result.error ?? "Failed to send");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle className="size-8 text-emerald-500" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-oroko-black">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
          Thank you for reaching out. We will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-sm">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs tracking-wider uppercase text-muted-foreground">
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            {...register("name")}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs tracking-wider uppercase text-muted-foreground">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className={cn(errors.email && "border-destructive")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs tracking-wider uppercase text-muted-foreground">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="How can we help?"
          {...register("subject")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs tracking-wider uppercase text-muted-foreground">
          Message *
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Write your message here…"
          {...register("message")}
          className={cn(errors.message && "border-destructive")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-sm"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizonal className="size-4" />
        )}
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
