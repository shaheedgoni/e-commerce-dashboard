"use client";

import Sidebar from "@/components/navigation/sidebar";
import Header from "@/components/navigation/header";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Refresh } from "@/lib/services/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(
    Boolean(api.defaults.headers.common.Authorization),
  );
  const started = useRef(false);

  useEffect(() => {
    if (ready || started.current) return;
    started.current = true;

    Refresh()
      .then(() => setReady(true))
      .catch(() => router.push("/login"));
  }, [ready, router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
