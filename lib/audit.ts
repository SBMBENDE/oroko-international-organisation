import "server-only";
import { connectDB } from "@/lib/db";
import AuditLog from "@/models/AuditLog";

interface LogAuditParams {
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

/** Records an immutable audit trail entry. Never throws — logging failures must not block the action. */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    await connectDB();
    await AuditLog.create({
      actor: params.actorId,
      actorName: params.actorName,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata,
    });
  } catch (err) {
    console.error("[logAudit]", err);
  }
}
