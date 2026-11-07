"use client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Login } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await Login(email, password);
      router.push("/orders");
    } catch {
      setError("Wrong email or password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas p-4">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <Logo size={40} />
          <p className="text-sm font-semibold text-ink-secondary">Shoply</p>
          <h1 className="text-xl font-semibold text-ink">Sign in to admin</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}
