/**
 * Configurable RBAC permission system.
 * Add new permissions here; never hard-code permission logic in components.
 * In Phase 10 these mappings will be stored in DB and loaded dynamically.
 */

export const PERMISSIONS = {
  // Portal
  PORTAL_ACCESS: "portal.access",
  // Governance — viewing
  GOVERNANCE_VIEW: "governance.view",
  ASSEMBLY_VIEW: "assembly.view",
  EXECUTIVE_VIEW: "executive.view",
  COMMITTEE_VIEW: "committee.view",
  DOCUMENTS_VIEW: "documents.view",
  // Governance — management (admin+)
  GOVERNANCE_MANAGE: "governance.manage",
  ASSEMBLY_MANAGE: "assembly.manage",
  EXECUTIVE_MANAGE: "executive.manage",
  COMMITTEE_MANAGE: "committee.manage",
  DOCUMENTS_MANAGE: "documents.manage",
  // Members
  MEMBERS_VIEW: "members.view",
  MEMBERS_MANAGE: "members.manage",
  // Events / Projects (Phase 5+)
  EVENTS_VIEW: "events.view",
  EVENTS_MANAGE: "events.manage",
  PROJECTS_VIEW: "projects.view",
  PROJECTS_MANAGE: "projects.manage",
  // Admin
  ADMIN_ACCESS: "admin.access",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const MEMBER_PERMISSIONS: Permission[] = [
  PERMISSIONS.PORTAL_ACCESS,
  PERMISSIONS.GOVERNANCE_VIEW,
  PERMISSIONS.ASSEMBLY_VIEW,
  PERMISSIONS.EXECUTIVE_VIEW,
  PERMISSIONS.COMMITTEE_VIEW,
  PERMISSIONS.DOCUMENTS_VIEW,
  PERMISSIONS.MEMBERS_VIEW,
  PERMISSIONS.EVENTS_VIEW,
  PERMISSIONS.PROJECTS_VIEW,
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.GOVERNANCE_MANAGE,
  PERMISSIONS.ASSEMBLY_MANAGE,
  PERMISSIONS.EXECUTIVE_MANAGE,
  PERMISSIONS.COMMITTEE_MANAGE,
  PERMISSIONS.DOCUMENTS_MANAGE,
  PERMISSIONS.MEMBERS_MANAGE,
  PERMISSIONS.EVENTS_MANAGE,
  PERMISSIONS.PROJECTS_MANAGE,
  PERMISSIONS.ADMIN_ACCESS,
];

const SUPERADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  // superadmin inherits everything
];

// Role → permission set mapping (configurable — change here to adjust access)
export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  member: MEMBER_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  superadmin: SUPERADMIN_PERMISSIONS,
};

export function hasPermission(
  userRole: string | undefined | null,
  permission: Permission
): boolean {
  if (!userRole) return false;
  if (userRole === "superadmin") return true;
  return (ROLE_PERMISSIONS[userRole] ?? []).includes(permission);
}

/** Throws if the user does not hold the required permission. Use in Server Actions. */
export function requirePermission(
  userRole: string | undefined | null,
  permission: Permission
): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(`Permission denied: "${permission}" required`);
  }
}
