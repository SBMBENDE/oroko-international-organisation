export type NavLink = {
  label: string;
  href: string;
  comingSoon?: boolean;
};

export type Pillar = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type OrokoStat = {
  value: string;
  label: string;
  suffix?: string;
};

// Auth / membership types
export type UserRole =
  | "member"
  | "superadmin"
  | "admin"
  | "membership_admin"
  | "finance_admin"
  | "event_admin"
  | "project_admin"
  | "welfare_admin"
  | "content_admin"
  | "viewer";
export type MembershipStatus =
  | "pending"
  | "active"
  | "suspended"
  | "expired"
  | "rejected"
  | "resigned";
// Membership type is now free-form and configurable — see models/MembershipType.ts
export type MembershipType = string;

// Governance types
export type GovernanceOrgan = "general_assembly" | "executive" | "committee";
export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type MeetingFormat = "in_person" | "virtual" | "hybrid";
export type DocumentType = "resolution" | "decision" | "minutes" | "report" | "agenda" | "statute" | "bylaw";
export type CommitteeMemberRole = "chair" | "vice_chair" | "secretary" | "member";

export type ActionResult = {
  success: boolean;
  error?: string;
};

