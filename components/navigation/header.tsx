"use client";

import { fakeUser } from "@/lib/fakeUser";
import { captilaze, getInitials } from "@/lib/format";
import { SquareArrowRightExit } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function getPageTitle(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return "Shoply";

  const primarySegment = segments[0];

  return primarySegment[0].toUpperCase() + primarySegment.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeIfOutside(event: MouseEvent) {
      const clickedInside = menuRef.current?.contains(event.target as Node);

      if (!clickedInside) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeIfOutside);

    return () => document.removeEventListener("mousedown", closeIfOutside);
  }, []);

  return (
    <header className="flex items-center justify-between h-20 bg-surface border-b border-line px-8 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-ink">
        {getPageTitle(pathname)}
      </h1>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-stone-100 ${isOpen ? "bg-stone-100" : ""}`}
        >
          <p>
            {fakeUser.firstName} {fakeUser.lastName}
          </p>

          <span
            className={`text-xs px-2 py-0.5 rounded-md ${fakeUser.role === "admin" ? "bg-accent-soft text-accent" : "bg-stone-100 text-ink-secondary"}`}
          >
            {captilaze(fakeUser.role)}
          </span>
          <span className="size-9 rounded-full bg-stone-200 text-xs font-semibold flex items-center justify-center">
            {getInitials(fakeUser.firstName, fakeUser.lastName)}
          </span>
        </button>

        {isOpen && (
          <div className="absolute overflow-hidden right-0 top-full mt-2 w-60 bg-surface border border-line rounded-xl shadow-sm">
            <div className="px-4 py-3">
              <span className="block">
                {fakeUser.firstName} {fakeUser.lastName}
              </span>
              <span className="text-xs text-ink-muted">{fakeUser.email}</span>
            </div>

            <div className="border-t border-line" />

            <button className="flex items-center w-full gap-2 px-4 py-2.5 cursor-pointer hover:bg-stone-100">
              <SquareArrowRightExit size={18} />
              <p>Log out</p>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
