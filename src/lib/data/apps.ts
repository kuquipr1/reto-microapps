export interface MicroApp {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  status: "active" | "beta" | "upcoming" | "maintenance";
  category: "business" | "productivity" | "tools" | "finance";
  route?: string;
}

export const microApps: MicroApp[] = [
  {
    id: "crm",
    nameKey: "apps.crm.name",
    descriptionKey: "apps.crm.description",
    icon: "Users",
    status: "active",
    category: "business",
    route: "/apps/crm",
  },
  {
    id: "analytics",
    nameKey: "apps.analytics.name",
    descriptionKey: "apps.analytics.description",
    icon: "BarChart3",
    status: "beta",
    category: "productivity",
    route: "/apps/analytics",
  },
  {
    id: "inventory",
    nameKey: "apps.inventory.name",
    descriptionKey: "apps.inventory.description",
    icon: "Package",
    status: "active",
    category: "tools",
    route: "/apps/inventory",
  },
  {
    id: "payroll",
    nameKey: "apps.payroll.name",
    descriptionKey: "apps.payroll.description",
    icon: "Banknote",
    status: "active",
    category: "finance",
    route: "/apps/payroll",
  },
  {
    id: "documents",
    nameKey: "apps.documents.name",
    descriptionKey: "apps.documents.description",
    icon: "FileText",
    status: "active",
    category: "productivity",
    route: "/apps/documents",
  },
  {
    id: "helpdesk",
    nameKey: "apps.helpdesk.name",
    descriptionKey: "apps.helpdesk.description",
    icon: "Headphones",
    status: "active",
    category: "business",
    route: "/apps/helpdesk",
  },
  {
    id: "settings-portal",
    nameKey: "apps.settings.name",
    descriptionKey: "apps.settings.description",
    icon: "Settings",
    status: "active",
    category: "tools",
    route: "/settings",
  },
];
