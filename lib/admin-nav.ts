import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  IdCard,
  Crown,
  UsersRound,
  CalendarDays,
  Zap,
  FolderKanban,
  HeartHandshake,
  HandCoins,
  Megaphone,
  FileText,
  Images,
  Mail,
  BarChart3,
  ScrollText,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { PERMISSIONS, type Permission } from "@/lib/permissions";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
  { label: "Members", href: "/admin/members", icon: Users, permission: PERMISSIONS.MEMBERS_MANAGE },
  { label: "Membership Applications", href: "/admin/applications", icon: ClipboardList, permission: PERMISSIONS.APPLICATIONS_MANAGE },
  { label: "Member IDs", href: "/admin/member-ids", icon: IdCard, permission: PERMISSIONS.MEMBERS_MANAGE },
  { label: "Leadership", href: "/admin/leadership", icon: Crown, permission: PERMISSIONS.LEADERSHIP_MANAGE },
  { label: "Committees", href: "/admin/committees", icon: UsersRound, permission: PERMISSIONS.COMMITTEE_MANAGE },
  { label: "Events", href: "/admin/events", icon: CalendarDays, permission: PERMISSIONS.EVENTS_MANAGE },
  { label: "News Flash", href: "/admin/news-flash", icon: Zap, permission: PERMISSIONS.NEWSFLASH_MANAGE },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban, permission: PERMISSIONS.PROJECTS_MANAGE },
  { label: "Welfare & Assistance", href: "/admin/welfare", icon: HeartHandshake, permission: PERMISSIONS.WELFARE_VIEW },
  { label: "Donations", href: "/admin/donations", icon: HandCoins, permission: PERMISSIONS.DONATIONS_VIEW },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone, permission: PERMISSIONS.ANNOUNCEMENTS_MANAGE },
  { label: "Documents", href: "/admin/documents", icon: FileText, permission: PERMISSIONS.DOCUMENTS_MANAGE },
  { label: "Gallery", href: "/admin/gallery", icon: Images, permission: PERMISSIONS.GALLERY_MANAGE },
  { label: "Contact Messages", href: "/admin/contact", icon: Mail, permission: PERMISSIONS.CONTACT_MANAGE },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, permission: PERMISSIONS.REPORTS_VIEW },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText, permission: PERMISSIONS.AUDIT_LOGS_VIEW },
  { label: "Administrators", href: "/admin/administrators", icon: ShieldCheck, permission: PERMISSIONS.ADMINISTRATORS_MANAGE },
  { label: "Settings", href: "/admin/settings", icon: Settings, permission: PERMISSIONS.SETTINGS_MANAGE },
];
