import "server-only";
import { auth } from "@/auth";
import { isAdminRole, hasPermission, type Permission } from "@/lib/permissions";

export interface AdminSession {
  id: string;
  name: string;
  role: string;
}

/** Resolves the current session and throws unless the user holds an admin role. Use at the top of every admin Server Action. */
export async function requireAdminSession(permission?: Permission): Promise<AdminSession> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role ?? "member";
  if (!isAdminRole(role)) throw new Error("Forbidden: admin access required");
  if (permission && !hasPermission(role, permission)) {
    throw new Error(`Forbidden: "${permission}" permission required`);
  }

  return {
    id: session.user.id,
    name: session.user.name ?? "Administrator",
    role,
  };
}
