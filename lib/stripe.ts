import "server-only";
import Stripe from "stripe";

// Stripe instance is created lazily so the build doesn't fail without the key
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// Keep named export for convenience in the webhook handler
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function formatAmountForStripe(amount: number, currency: string): number {
  const zeroCurrencies = ["jpy", "krw", "vnd", "xaf", "xof"];
  return zeroCurrencies.includes(currency.toLowerCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number, currency: string): number {
  const zeroCurrencies = ["jpy", "krw", "vnd", "xaf", "xof"];
  return zeroCurrencies.includes(currency.toLowerCase()) ? amount : amount / 100;
}
