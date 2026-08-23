"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2, Heart, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPaymentIntent, confirmDonation } from "@/actions/donation.actions";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"];

const formSchema = z.object({
  donorName: z.string().min(2, "Name is required"),
  donorEmail: z.string().email("Valid email required"),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  projectId?: string;
  projectTitle?: string;
};

export function DonationForm({ projectId, projectTitle }: Props) {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { isAnonymous: false },
  });

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const onDetailsSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    const result = await createPaymentIntent({
      ...data,
      amount: finalAmount,
      currency,
      frequency,
      type: projectId ? "project" : "general",
      projectId,
    });
    setIsLoading(false);
    if (!result.success || !result.clientSecret) {
      setError(result.error ?? "Could not set up payment");
      return;
    }
    setClientSecret(result.clientSecret);
    setDonationId(result.donationId ?? null);
    setStep("payment");
  };

  if (step === "success") {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle className="size-8 text-emerald-500" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-oroko-black">
          Thank you!
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Your donation of {currency} {finalAmount.toLocaleString()} has been received. A receipt will be sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projectTitle && (
        <div className="flex items-center gap-2 text-sm text-oroko-green font-medium">
          <Heart className="size-4 text-oroko-gold" />
          Supporting: {projectTitle}
        </div>
      )}

      {step === "details" && (
        <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-5">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-sm">
              {error}
            </div>
          )}

          {/* Frequency */}
          <div className="flex rounded-sm border border-border overflow-hidden">
            {(["once", "monthly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={cn(
                  "flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors",
                  frequency === f
                    ? "bg-oroko-green text-white"
                    : "text-muted-foreground hover:text-oroko-black"
                )}
              >
                {f === "once" ? "One time" : "Monthly"}
              </button>
            ))}
          </div>

          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full h-8 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Amount presets */}
          <div>
            <Label className="text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Amount ({currency})
            </Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={cn(
                    "py-2 text-sm font-medium border rounded-sm transition-colors",
                    amount === a && !customAmount
                      ? "bg-oroko-gold text-oroko-black border-oroko-gold"
                      : "border-border text-muted-foreground hover:border-oroko-gold/40 hover:text-oroko-black"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min={1}
              className="mt-1"
            />
          </div>

          {/* Personal details */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="donorName" className="text-xs tracking-wider uppercase text-muted-foreground">Full Name</Label>
              <Input id="donorName" {...register("donorName")} placeholder="Your name" className={cn(errors.donorName && "border-destructive")} />
              {errors.donorName && <p className="text-xs text-destructive">{errors.donorName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="donorEmail" className="text-xs tracking-wider uppercase text-muted-foreground">Email</Label>
              <Input id="donorEmail" type="email" {...register("donorEmail")} placeholder="your@email.com" className={cn(errors.donorEmail && "border-destructive")} />
              {errors.donorEmail && <p className="text-xs text-destructive">{errors.donorEmail.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs tracking-wider uppercase text-muted-foreground">Message (optional)</Label>
              <Textarea id="message" {...register("message")} rows={2} placeholder="Leave a message of support…" />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" {...register("isAnonymous")} className="rounded" />
              Donate anonymously
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !finalAmount || finalAmount < 1}
            className="w-full flex items-center justify-center gap-2 py-3 bg-oroko-gold text-oroko-black text-sm font-bold tracking-wider uppercase hover:bg-oroko-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-sm"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Heart className="size-4" />}
            {isLoading ? "Setting up…" : `Donate ${currency} ${(finalAmount || 0).toLocaleString()}`}
          </button>
        </form>
      )}

      {step === "payment" && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: "stripe" } }}
        >
          <StripePaymentForm
            donationId={donationId}
            amount={finalAmount}
            currency={currency}
            donorName={getValues("donorName")}
            onSuccess={() => setStep("success")}
          />
        </Elements>
      )}
    </div>
  );
}

function StripePaymentForm({
  donationId,
  amount,
  currency,
  donorName,
  onSuccess,
}: {
  donationId: string | null;
  amount: number;
  currency: string;
  donorName: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (donationId) await confirmDonation(donationId);
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-sm text-muted-foreground">
        Completing donation of <span className="font-semibold text-oroko-black">{currency} {amount.toLocaleString()}</span> from <span className="font-semibold text-oroko-black">{donorName}</span>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3 bg-oroko-gold text-oroko-black text-sm font-bold tracking-wider uppercase hover:bg-oroko-gold-light disabled:opacity-50 transition-colors rounded-sm"
      >
        {isProcessing ? <Loader2 className="size-4 animate-spin" /> : null}
        {isProcessing ? "Processing…" : `Complete Donation`}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        🔒 Secured by Stripe. No card details are stored by OROKO International.
      </p>
    </form>
  );
}
