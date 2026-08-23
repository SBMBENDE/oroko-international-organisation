import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
    return NextResponse.json({ error: "Webhook configuration missing" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    try {
      await connectDB();
      const donation = await Donation.findOneAndUpdate(
        { stripePaymentIntentId: pi.id },
        {
          $set: {
            status: "succeeded",
            receiptNumber: `OROKO-${Date.now()}`,
          },
        },
        { new: true }
      );
      if (donation?.project) {
        await Project.findByIdAndUpdate(donation.project, {
          $inc: { fundingRaised: donation.amount },
        });
      }
    } catch (err) {
      console.error("[webhook payment_intent.succeeded]", err);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await connectDB();
    await Donation.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { $set: { status: "failed" } }
    );
  }

  return NextResponse.json({ received: true });
}
