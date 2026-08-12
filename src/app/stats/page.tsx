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

export default function StatsPage() {
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

  const winRate =
    stats && stats.gamesPlayed > 0
      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
      : 0;

  return (
    <div className="page-shell">
      <Navigation showInHeader />

      <main className="flex-1 px-5 md:px-6 py-6 md:py-8 pb-[max(4rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight mb-2">
              Your Stats
            </h1>
            <p className="font-body text-on-surface-variant">
              Track your Bible Wordle journey, one book at a time.
            </p>
          </div>

          {stats && (
            <>
              {/* Current Streak Banner */}
              <div className="card card-elevated mb-8 text-center">
                <span className="material-symbols-outlined text-secondary text-5xl [font-variation-settings:'FILL'_1]">
                  local_fire_department
                </span>
                <p className="font-display text-display text-on-surface mt-2">
                  {stats.currentStreak}
                </p>
                <p className="font-label text-label-bold text-on-surface-variant uppercase">
                  Day Streak
                </p>
                <p className="font-body text-on-surface-variant text-sm mt-3">
                  {stats.currentStreak > 0
                    ? "Keep it up! Play again tomorrow to extend your streak."
                    : "Play today to start a new streak!"}
                </p>
              </div>

              {/* Overview Grid */}
              <h2 className="font-display text-headline-lg-mobile text-on-surface mb-4">
                Overview
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

              {/* Win Rate Card */}
              <div className="card card-elevated mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-headline-lg-mobile text-on-surface">
                      Win Rate
                    </p>
                    <p className="font-body text-on-surface-variant text-sm">
                      {stats.wins} of {stats.gamesPlayed} puzzles solved
                    </p>
                  </div>
                  <div className="font-display text-display text-tertiary">
                    {winRate}%
                  </div>
                </div>
                <div className="progress-bar mt-4">
                  <div
                    className="progress-fill bg-tertiary"
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="card card-elevated">
            <h2 className="font-display text-headline-lg-mobile text-on-surface mb-3">
              Ready for another?
            </h2>
            <p className="font-body text-on-surface-variant mb-4">
              A new challenge is waiting for you.
            </p>
            <Link href="/play" className="btn-action inline-block">
              Play Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
