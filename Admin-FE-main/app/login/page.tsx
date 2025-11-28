"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const KEY = "demo_logged_in";
const NEXT_PATH = "/dashboard/dashboard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goNext() {
    try {
      router.push(NEXT_PATH);
      setTimeout(() => {
        if (typeof window !== "undefined" && window.location.pathname !== NEXT_PATH) {
          window.location.href = NEXT_PATH;
        }
      }, 50);
    } catch {
      if (typeof window !== "undefined") window.location.href = NEXT_PATH;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const id = email.trim().toLowerCase();
    const ok = (id === "admin" || id === "admin@example.com") && pw === "1234";

    setLoading(false);

    if (ok) {
      localStorage.setItem(KEY, "1");
      goNext();
      return;
    }
    setErr("이메일 또는 비밀번호가 올바르지 않습니다. (admin / 1234)");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-6 space-y-5">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Enter your <b>email and password</b> below to login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="CyberSecurity@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="h-11"
              autoComplete="current-password"
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
