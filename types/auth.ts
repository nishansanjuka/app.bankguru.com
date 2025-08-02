import { icons } from "lucide-react";

export type OrgRole =
  | "org:admin"
  | "org:moderator"
  | "org:user"
  | "org:emp"
  | "non-org";

export type Permission =
  | "cards:read"
  | "cards:write"
  | "contacts:read"
  | "contacts:write"
  | "analytics:read"
  | "users:read"
  | "users:write"
  | "team:read"
  | "team:write"
  | "settings:read"
  | "settings:write"
  | "org:sys_memberships:read"
  | "org:sys_memberships:write"
  | "org:sys_memberships:delete"
  | "org:sys_memberships:manage"
  | "org:sys_profile:delete"
  | "org:sys_profile:manage"
  | "org:sys_domains:read"
  | "org:sys_domains:manage";

export interface RoutePermission {
  requiredRoles: OrgRole[];
  requiredPermissions: Permission[];
}

interface NavItemBase {
  title: string;
  url: string;
  icon: keyof typeof icons;
  permissions?: RoutePermission;
}

export interface NavItem extends NavItemBase {
  items?: NavItemBase[];
}
