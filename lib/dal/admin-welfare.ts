import "server-only";
import { connectDB } from "@/lib/db";
import WelfareRequest, { type IWelfareRequest } from "@/models/WelfareRequest";
import type { IUser } from "@/models/User";
import { Types } from "mongoose";

export async function getAdminWelfareRequests(filters: { status?: string; page?: number; limit?: number }) {
  await connectDB();
  const { status, page = 1, limit = 20 } = filters;
  const filter: Record<string, unknown> = status ? { status } : {};

  const skip = (page - 1) * limit;
  const [requests, total] = await Promise.all([
    WelfareRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{ member: IUser }>("member", "firstName lastName email")
      .lean(),
    WelfareRequest.countDocuments(filter),
  ]);

  return {
    requests: requests
      .filter((r) => r.member)
      .map((r) => {
        const member = r.member as unknown as IUser;
        return {
          id: r._id.toString(),
          memberName: `${member.firstName} ${member.lastName}`,
          requestType: r.requestType,
          status: r.status,
          amountRequested: r.amountRequested,
          amountApproved: r.amountApproved,
          currency: r.currency,
          createdAt: r.createdAt.toISOString(),
        };
      }),
    total,
    pages: Math.ceil(total / limit) || 1,
    page,
  };
}

export async function getAdminWelfareDetail(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;

  const request = await WelfareRequest.findById(id)
    .populate<{ member: IUser }>("member", "firstName lastName email")
    .populate("internalNotes.author", "firstName lastName")
    .lean<IWelfareRequest & { _id: Types.ObjectId; member: IUser }>();
  if (!request || !request.member) return null;

  return request;
}
