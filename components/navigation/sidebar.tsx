"use client";

import { adminUserProps, sidebarContentProps } from "@/types/sidebar";
import {
  Box,
  Contact,
  CreditCard,
  Folder,
  LayoutGrid,
  PanelLeft,
  ReceiptTextIcon,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebarContent: sidebarContentProps[] = [
  {
    adminOnly: true,
    icon: LayoutGrid,
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    adminOnly: false,
    icon: ReceiptTextIcon,
    title: "Orders",
    href: "/orders",
  },
  {
    adminOnly: false,
    icon: Box,
    title: "Stock",
    href: "/stock",
  },
  {
    adminOnly: false,
    icon: CreditCard,
    title: "POS",
    href: "/pos",
  },
  {
    adminOnly: false,
    icon: Tag,
    title: "Products",
    href: "/products",
  },
  {
    adminOnly: true,
    icon: Folder,
    title: "Categories",
    href: "/categories",
  },
  {
    adminOnly: true,
    icon: Users,
    title: "Customers",
    href: "/customers",
  },
  {
    adminOnly: true,
    icon: Contact,
    title: "Staff",
    href: "/staff",
  },
];

const fakeUser: adminUserProps = {
  id: "1",
  email: "conquerer@sample.gg",
  firstName: "Conquest",
  lastName: "Viltum",
  phone: null,
  role: "admin",
  isActive: true,
  createdAt: "2026-10-20T00:00:00.000Z",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const visibleLinks = sidebarContent.filter(
    (item) => !item.adminOnly || fakeUser.role === "admin",
  );

  return (
    <aside
      className={`bg-white text-stone-600 ${isCollapsed ? "w-20 overflow-hidden whitespace-nowrap" : "w-60"} transition-all duration-200 border-r border-r-stone-200 p-5 h-screen`}
    >
      <div
        className={`${isCollapsed && "flex-col gap-2"} mb-12 px-2 flex items-center justify-between`}
      >
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 bg-stone-900 rounded-lg text-white flex items-center justify-center">
            S
          </div>
          {!isCollapsed && <p className="text-lg font-semibold">Shoply</p>}
        </div>

        <button onClick={() => setIsCollapsed((prev) => !prev)}>
          <PanelLeft size={18} className="hover:cursor-pointer" />
        </button>
      </div>

      <div>
        <ul className="flex flex-col gap-2">
          {visibleLinks.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li
                key={item.href}
                className={`${isCollapsed && "flex justify-center"}`}
              >
                <Link
                  title={`${isCollapsed ? item.title : undefined}`}
                  href={item.href}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer hover:bg-stone-100 hover:text-stone-900 ${isCollapsed ? "justify-center w-fit" : ""} ${isActive ? "bg-teal-50 text-teal-700 hover:text-teal-700 hover:bg-teal-50" : ""}`}
                >
                  <Icon size={18} />
                  {!isCollapsed && item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
