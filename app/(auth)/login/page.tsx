"use client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
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
    <main className="h-screen flex items-center">
      <Card className="w-100 p-6 mx-auto">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </main>
  );
}
