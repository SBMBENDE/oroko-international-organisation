import "server-only";
import { connectDB } from "@/lib/db";
import Donation, { type IDonation } from "@/models/Donation";
import { Types } from "mongoose";

export async function getAdminDonations(filters: { status?: string; page?: number; limit?: number }) {
  await connectDB();
  const { status, page = 1, limit = 25 } = filters;
  const filter: Record<string, unknown> = status ? { status } : {};

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const skip = (page - 1) * limit;
  const [donations, total, totalAgg, monthAgg, yearAgg, donorCount] = await Promise.all([
    Donation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("project", "title")
      .lean<(IDonation & { _id: Types.ObjectId })[]>(),
    Donation.countDocuments(filter),
    Donation.aggregate([{ $match: { status: "succeeded" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Donation.aggregate([{ $match: { status: "succeeded", createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Donation.aggregate([{ $match: { status: "succeeded", createdAt: { $gte: yearStart } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
    Donation.distinct("donorEmail", { status: "succeeded" }),
  ]);

  return {
    donations: donations.map((d) => ({
      id: d._id.toString(),
      donorName: d.donorName,
      amount: d.amount,
      currency: d.currency,
      type: d.type,
      projectTitle: (d.project as unknown as { title?: string } | null)?.title,
      status: d.status,
      receiptNumber: d.receiptNumber,
      createdAt: d.createdAt.toISOString(),
    })),
    total,
    pages: Math.ceil(total / limit) || 1,
    page,
    totalAmount: totalAgg[0]?.total ?? 0,
    monthAmount: monthAgg[0]?.total ?? 0,
    yearAmount: yearAgg[0]?.total ?? 0,
    donorCount: donorCount.length,
  };
}
