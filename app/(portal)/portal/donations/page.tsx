import type { Metadata } from "next";
import Link from "next/link";
import { getDonationHistory } from "@/actions/donation.actions";
import { Receipt, Heart } from "lucide-react";

export const metadata: Metadata = { title: "My Donations" };

const statusStyle: Record<string, string> = {
  succeeded: "text-emerald-600 bg-emerald-50 border-emerald-200",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  failed: "text-destructive bg-destructive/10 border-destructive/20",
  refunded: "text-muted-foreground bg-muted border-border",
};

export default async function DonationsPortalPage() {
  const history = await getDonationHistory();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="h-px w-6 bg-oroko-gold" />
            <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">My Account</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-oroko-black">Donation History</h1>
        </div>
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.15em] uppercase font-bold hover:bg-oroko-gold-light transition-colors rounded-sm"
        >
          <Heart className="size-3.5" /> Make a donation
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-sm">
          <Heart className="size-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-heading text-xl text-oroko-black">No donations yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Your donation history will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((d) => (
            <div key={d.id} className="bg-white border border-border rounded-sm p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-oroko-black">
                    {d.currency} {d.amount.toLocaleString()}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 border rounded-sm ${statusStyle[d.status] ?? statusStyle.pending}`}>
                    {d.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {d.projectTitle ? `Project: ${d.projectTitle}` : "General donation"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(d.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              {d.receiptNumber && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Receipt className="size-3.5" />
                  {d.receiptNumber}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
