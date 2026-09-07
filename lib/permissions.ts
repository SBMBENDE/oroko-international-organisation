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
  APPLICATIONS_MANAGE: "applications.manage",
  // Events / Projects
  EVENTS_VIEW: "events.view",
  EVENTS_MANAGE: "events.manage",
  PROJECTS_VIEW: "projects.view",
  PROJECTS_MANAGE: "projects.manage",
  // Admin dashboard
  ADMIN_ACCESS: "admin.access",
  DASHBOARD_VIEW: "dashboard.view",
  LEADERSHIP_MANAGE: "leadership.manage",
  NEWSFLASH_MANAGE: "newsflash.manage",
  WELFARE_VIEW: "welfare.view",
  WELFARE_MANAGE: "welfare.manage",
  DONATIONS_VIEW: "donations.view",
  ANNOUNCEMENTS_MANAGE: "announcements.manage",
  GALLERY_MANAGE: "gallery.manage",
  CONTACT_MANAGE: "contact.manage",
  REPORTS_VIEW: "reports.view",
  AUDIT_LOGS_VIEW: "auditlogs.view",
  ADMINISTRATORS_MANAGE: "administrators.manage",
  SETTINGS_MANAGE: "settings.manage",
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

const VIEWER_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.WELFARE_VIEW,
  PERMISSIONS.DONATIONS_VIEW,
  PERMISSIONS.REPORTS_VIEW,
];

const MEMBERSHIP_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.MEMBERS_MANAGE,
  PERMISSIONS.APPLICATIONS_MANAGE,
  PERMISSIONS.REPORTS_VIEW,
];

const FINANCE_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.DONATIONS_VIEW,
  PERMISSIONS.REPORTS_VIEW,
];

const EVENT_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.EVENTS_MANAGE,
  PERMISSIONS.REPORTS_VIEW,
];

const PROJECT_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.PROJECTS_MANAGE,
  PERMISSIONS.REPORTS_VIEW,
];

const WELFARE_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.WELFARE_VIEW,
  PERMISSIONS.WELFARE_MANAGE,
  PERMISSIONS.REPORTS_VIEW,
];

const CONTENT_ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.NEWSFLASH_MANAGE,
  PERMISSIONS.ANNOUNCEMENTS_MANAGE,
  PERMISSIONS.DOCUMENTS_MANAGE,
  PERMISSIONS.GALLERY_MANAGE,
  PERMISSIONS.CONTACT_MANAGE,
];

const ADMIN_PERMISSIONS: Permission[] = [
  ...MEMBER_PERMISSIONS,
  PERMISSIONS.ADMIN_ACCESS,
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.GOVERNANCE_MANAGE,
  PERMISSIONS.ASSEMBLY_MANAGE,
  PERMISSIONS.EXECUTIVE_MANAGE,
  PERMISSIONS.COMMITTEE_MANAGE,
  PERMISSIONS.DOCUMENTS_MANAGE,
  PERMISSIONS.MEMBERS_MANAGE,
  PERMISSIONS.APPLICATIONS_MANAGE,
  PERMISSIONS.EVENTS_MANAGE,
  PERMISSIONS.PROJECTS_MANAGE,
  PERMISSIONS.LEADERSHIP_MANAGE,
  PERMISSIONS.NEWSFLASH_MANAGE,
  PERMISSIONS.WELFARE_VIEW,
  PERMISSIONS.WELFARE_MANAGE,
  PERMISSIONS.DONATIONS_VIEW,
  PERMISSIONS.ANNOUNCEMENTS_MANAGE,
  PERMISSIONS.GALLERY_MANAGE,
  PERMISSIONS.CONTACT_MANAGE,
  PERMISSIONS.REPORTS_VIEW,
  PERMISSIONS.AUDIT_LOGS_VIEW,
];

const SUPERADMIN_PERMISSIONS: Permission[] = [
  ...ADMIN_PERMISSIONS,
  PERMISSIONS.ADMINISTRATORS_MANAGE,
  PERMISSIONS.SETTINGS_MANAGE,
  // superadmin inherits everything
];

// Role → permission set mapping (configurable — change here to adjust access)
export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  member: MEMBER_PERMISSIONS,
  viewer: VIEWER_PERMISSIONS,
  membership_admin: MEMBERSHIP_ADMIN_PERMISSIONS,
  finance_admin: FINANCE_ADMIN_PERMISSIONS,
  event_admin: EVENT_ADMIN_PERMISSIONS,
  project_admin: PROJECT_ADMIN_PERMISSIONS,
  welfare_admin: WELFARE_ADMIN_PERMISSIONS,
  content_admin: CONTENT_ADMIN_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  superadmin: SUPERADMIN_PERMISSIONS,
};

/** Human-readable labels for the Administrators management screen. */
export const ROLE_LABELS: Record<string, string> = {
  member: "Member",
  viewer: "Viewer",
  membership_admin: "Membership Admin",
  finance_admin: "Finance Admin",
  event_admin: "Event Admin",
  project_admin: "Project Admin",
  welfare_admin: "Welfare Admin",
  content_admin: "Content Admin",
  admin: "Admin",
  superadmin: "Super Admin",
};

export const ADMIN_ROLE_VALUES = [
  "superadmin",
  "admin",
  "membership_admin",
  "finance_admin",
  "event_admin",
  "project_admin",
  "welfare_admin",
  "content_admin",
  "viewer",
] as const;

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

/** True if the role should be allowed into the /admin route group at all. */
export function isAdminRole(userRole: string | undefined | null): boolean {
  return hasPermission(userRole, PERMISSIONS.ADMIN_ACCESS);
}
