import { LucideIcon } from "lucide-react";

export type sidebarContentProps = {
  adminOnly: boolean;
  icon: LucideIcon;
  title: string;
  href: string;
};

export type adminUserProps = {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;

  phone: string | null;
  role: "admin" | "staff";
  isActive: boolean;
  createdAt: string;
};
