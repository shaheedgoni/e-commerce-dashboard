"use client";

import Header from "@/components/navigation/header";
import AccessGuard from "@/components/navigation/access-guard";
import Sidebar from "@/components/navigation/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Refresh } from "@/lib/services/auth";
import { TitleContext } from "@/lib/titleContext";

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
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (ready || started.current) return;
    started.current = true;

    Refresh()
      .then(() => setReady(true))
      .catch(() => router.push("/login"));
  }, [ready, router]);

  if (!ready) return null;

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex-1 p-8">
            <AccessGuard>{children}</AccessGuard>
          </main>
        </div>
      </div>
    </TitleContext.Provider>
  );
}
