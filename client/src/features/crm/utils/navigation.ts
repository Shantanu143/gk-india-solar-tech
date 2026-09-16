import {
  BarChart3,
  Boxes,
  CalendarClock,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  UserCircle,
  Users,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { CRM_ROUTES } from "@/features/crm/utils/routes";

export interface CrmNavLink {
  type: "link";
  label: string;
  href: string;
  icon: LucideIcon;
  /** Which live count (if any) should populate this item's badge — resolved by the Sidebar. */
  badgeKey?: "leads" | "followUps";
}

/** A collapsible group of related links — keeps the rail from becoming one long flat list. */
export interface CrmNavGroup {
  type: "group";
  label: string;
  icon: LucideIcon;
  items: CrmNavLink[];
}

export type CrmNavEntry = CrmNavLink | CrmNavGroup;

function link(label: string, href: string, icon: LucideIcon, badgeKey?: CrmNavLink["badgeKey"]): CrmNavLink {
  return { type: "link", label, href, icon, badgeKey };
}

export const ADMIN_NAV_ITEMS: CrmNavEntry[] = [
  link("Dashboard", CRM_ROUTES.adminDashboard, LayoutDashboard),
  link("Leads", CRM_ROUTES.adminLeads, Users, "leads"),
  link("Customers", CRM_ROUTES.adminCustomers, UserCircle),
  link("Follow-ups", CRM_ROUTES.adminFollowUps, CalendarClock, "followUps"),
  {
    type: "group",
    label: "Sales Tools",
    icon: FileText,
    items: [
      link("Quotations", CRM_ROUTES.adminQuotations, FileText),
      link("Products", CRM_ROUTES.adminProducts, Boxes),
      link("Marketing Leads", CRM_ROUTES.adminMarketingLeads, Megaphone),
    ],
  },
  {
    type: "group",
    label: "Field Operations",
    icon: ClipboardList,
    items: [
      link("Site Surveys", CRM_ROUTES.adminSurveys, ClipboardList),
      link("Projects", CRM_ROUTES.adminProjects, FolderKanban),
      link("Materials", CRM_ROUTES.adminMaterials, Package),
    ],
  },
  link("Employees", CRM_ROUTES.adminEmployees, Users2),
  link("Reports", CRM_ROUTES.adminReports, BarChart3),
  link("Settings", CRM_ROUTES.adminSettings, Settings),
];

export const EMPLOYEE_NAV_ITEMS: CrmNavEntry[] = [
  link("Dashboard", CRM_ROUTES.employeeDashboard, LayoutDashboard),
  link("My Leads", CRM_ROUTES.employeeLeads, Users, "leads"),
  link("Follow-ups", CRM_ROUTES.employeeFollowUps, CalendarClock, "followUps"),
  link("Site Surveys", CRM_ROUTES.employeeSurveys, ClipboardList),
  link("Quotations", CRM_ROUTES.employeeQuotations, FileText),
  link("Projects", CRM_ROUTES.employeeProjects, FolderKanban),
  link("Settings", CRM_ROUTES.employeeSettings, Settings),
];
