"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMascot, setShowMascot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await signup(name, email, password, username || undefined);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
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
    <div className="page-shell flex flex-col items-center relative overflow-hidden">
      {/* Bottom Background Decoration */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Mascot Section */}
      <div className="w-full flex justify-center pt-12 md:pt-16 pb-6 md:pb-8 relative z-10">
        <div className="relative">
          <button
            onClick={() => setShowMascot(!showMascot)}
            className="w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full flex items-center justify-center text-5xl md:text-6xl transition-all hover:bg-primary/10 cursor-pointer focus:outline-none"
          >
            📜
          </button>
        </div>
      </div>

      {/* Create Account Card */}
      <main className="w-full max-w-md px-5 md:px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] flex-1 flex flex-col z-10">
        <h1 className="font-display text-headline-lg-mobile text-on-surface text-center mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label htmlFor="name" className="font-label text-label-bold text-on-surface w-20 shrink-0">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-field flex-1"
              placeholder="John"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="email" className="font-label text-label-bold text-on-surface w-20 shrink-0">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-field flex-1"
              placeholder="your@email.com"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="username" className="font-label text-label-bold text-on-surface w-20 shrink-0">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-field flex-1"
              placeholder="your_username"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="password" className="font-label text-label-bold text-on-surface w-20 shrink-0">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-field flex-1"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="confirmPassword" className="font-label text-label-bold text-on-surface w-20 shrink-0">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-field flex-1"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-action py-5 rounded-2xl font-label text-label-bold text-primary/70 mt-8"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-10 text-center font-body text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-on-surface font-bold hover:opacity-80 transition-opacity"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
