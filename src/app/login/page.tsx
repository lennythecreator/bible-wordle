"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(from);
      router.refresh();
    }
  };

  if (authLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-on-surface-variant">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-shell relative overflow-hidden">
      {/* Bottom Background Decoration */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Mascot Floating Peek */}
      <div className="fixed top-0 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <div className="relative -mt-4 md:-mt-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-surface rounded-full border-4 border-surface-container flex items-center justify-center text-4xl md:text-5xl shadow-lg">
            📜
          </div>
        </div>
      </div>

      {/* Sign In Card */}
      <main className="page-main-compact flex-1 flex items-center justify-center pt-24 md:pt-28 pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-md flex-1 flex flex-col">
          <h1 className="font-display text-headline-lg-mobile text-on-surface text-center mb-8">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="error-banner">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block font-label text-label-bold text-on-surface mb-3">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-label text-label-bold text-on-surface mb-3">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-action py-5 rounded-2xl font-label text-label-bold text-on-secondary-container mt-8"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 text-center font-body text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-on-surface font-bold hover:opacity-80 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex items-center justify-center">
          <div className="text-on-surface-variant">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
