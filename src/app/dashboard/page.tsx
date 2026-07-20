"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  longestStreak: number;
  averageAttempts: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="page-shell">
        <Navigation showInHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-on-surface-variant font-body">Loading...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page-shell">
      <Navigation showInHeader />

      <main className="flex-1 px-5 md:px-6 py-6 md:py-8 pb-[max(4rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight mb-2">
              Welcome, {user.name} 👋
            </h1>
            {stats && stats.currentStreak > 0 && (
              <p className="font-body-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary [font-variation-settings:'FILL'_1]">
                  local_fire_department
                </span>
                {stats.currentStreak} Day Streak
              </p>
            )}
          </div>

          {/* Today's Challenge Card */}
          <div className="card card-elevated mb-8">
            <h2 className="font-display text-headline-lg-mobile text-on-surface mb-3">
              Today&apos;s Challenge
            </h2>
            <p className="font-body text-on-surface-variant mb-4">
              Ready to test your Bible knowledge? A new puzzle awaits!
            </p>
            <Link
              href="/play"
              className="btn-action inline-block"
            >
              Play Now
            </Link>
          </div>

          {/* Stats Grid */}
          {stats && (
            <>
              <h2 className="font-display text-headline-lg-mobile text-on-surface mb-4">
                Your Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatsCard
                  icon="🎮"
                  label="Games Played"
                  value={stats.gamesPlayed}
                  accent="primary"
                />
                <StatsCard
                  icon="🏆"
                  label="Wins"
                  value={stats.wins}
                  accent="tertiary"
                />
                <StatsCard
                  icon="📊"
                  label="Avg. Attempts"
                  value={stats.averageAttempts}
                  accent="secondary"
                />
                <StatsCard
                  icon="🔥"
                  label="Longest Streak"
                  value={stats.longestStreak}
                  accent="primary"
                />
              </div>
            </>
          )}

          {/* How to Play */}
          <div className="card card-elevated">
            <h2 className="font-display text-headline-lg-mobile text-on-surface mb-4">
              How to Play
            </h2>
            <div className="space-y-3 font-body text-on-surface-variant">
              <p>1. Guess the hidden Bible book in 6 tries</p>
              <p>2. Each guess must be a valid Bible book name (4+ letters)</p>
              <p>3. After each guess, the tiles will change color:</p>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-tertiary-container border border-tertiary" />
                  <span><span className="text-tertiary font-bold">Green</span> - Correct letter in correct position</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-secondary-container border border-secondary" />
                  <span><span className="text-secondary font-bold">Yellow</span> - Correct letter in wrong position</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-surface-variant border border-outline-variant" />
                  <span><span className="text-on-surface-variant font-bold">Gray</span> - Letter not in the word</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
