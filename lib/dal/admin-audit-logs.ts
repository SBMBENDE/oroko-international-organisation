import "server-only";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

export async function getAuditLogs(filters: { entityType?: string; page?: number; limit?: number }) {
  await connectDB();
  const { entityType, page = 1, limit = 30 } = filters;

  const filter: Record<string, unknown> = {};
  if (entityType) filter.entityType = entityType;

  const skip = (page - 1) * limit;
  const [logs, total, entityTypes] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
    AuditLog.distinct("entityType"),
  ]);

  return {
    logs: logs.map((l) => ({
      id: l._id.toString(),
      actorName: l.actorName,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      description: l.description,
      createdAt: l.createdAt.toISOString(),
    })),
    total,
    pages: Math.ceil(total / limit) || 1,
    page,
    entityTypes: entityTypes.sort(),
  };
}
