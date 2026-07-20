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

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="font-label text-label-bold text-on-surface-variant uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <button
            type="button"
            className="tactile-button-secondary w-full py-5 mt-6 rounded-2xl font-label text-label-bold text-on-surface-variant flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

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

      <style jsx>{`
        .tactile-button-secondary {
          position: relative;
          background-color: #fbf9f4;
          border: 2px solid #dbdad5;
          border-bottom: 6px solid #dbdad5;
          transition: all 0.1s ease;
        }
        .tactile-button-secondary:hover {
          transform: translateY(-2px);
          border-bottom-width: 8px;
        }
        .tactile-button-secondary:active {
          transform: translateY(4px);
          border-bottom-width: 0px;
        }
      `}</style>
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
