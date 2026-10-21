"use client";

import { fakeUser } from "@/lib/fakeUser";
import { sidebarContentProps } from "@/types/sidebar";
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

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const visibleLinks = sidebarContent.filter(
    (item) => !item.adminOnly || fakeUser.role === "admin",
  );

  return (
    <aside
      className={`sticky overflow-hidden whitespace-nowrap top-0 shrink-0 bg-surface text-ink-secondary ${isCollapsed ? "w-20" : "w-60"} transition-all duration-200 border-r border-r-line p-5 h-screen`}
    >
      <div
        className={`${isCollapsed ? "flex-col gap-2" : ""} mb-12 px-2 flex items-center justify-between`}
      >
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 bg-ink rounded-lg text-surface cursor-default flex items-center justify-center">
            S
          </div>
          {!isCollapsed && <p className="text-lg font-semibold">Shoply</p>}
        </div>

        <button
          title="Sidebar"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hover:bg-stone-100 transition-colors duration-200 cursor-pointer p-2 rounded-md"
        >
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
                className={`${isCollapsed ? "flex justify-center" : ""}`}
              >
                <Link
                  title={isCollapsed ? item.title : undefined}
                  href={item.href}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer ${isCollapsed ? "justify-center w-fit" : ""} ${isActive ? "bg-accent-soft text-accent hover:text-accent hover:bg-accent-soft" : " hover:bg-stone-100 hover:text-ink"}`}
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
