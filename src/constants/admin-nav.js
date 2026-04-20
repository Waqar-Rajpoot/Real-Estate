import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCog, 
  Settings, 
  ClipboardList 
} from "lucide-react";

export const ADMIN_NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Agencies", href: "/admin/agencies", icon: Building2 },
      { title: "Agents", href: "/admin/agents", icon: Users },
      { title: "Individual Users", href: "/admin/users", icon: UserCog },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Audit Logs", href: "/admin/logs", icon: ClipboardList },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];