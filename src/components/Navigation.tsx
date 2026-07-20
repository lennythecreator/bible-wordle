"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

interface GameHeaderProps {
  attempts?: number;
  maxAttempts?: number;
}

export function GameHeader({ attempts = 0, maxAttempts = 6 }: GameHeaderProps) {
  return (
    <header className="w-full top-0 sticky bg-surface z-40 border-b-4 border-surface-variant">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl cursor-pointer hover:opacity-80 transition-opacity">
            menu
          </span>
          <h1 className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight">
            {attempts}/{maxAttempts}
          </h1>
        </div>
        
        {/* Mascot */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4">
          <div className="w-16 h-16 scrollie-float flex items-center justify-center text-4xl">
            📜
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 items-center px-6">
            <span className="nav-link text-primary cursor-pointer">
              Leaderboard
            </span>
            <span className="nav-link text-on-surface-variant cursor-pointer">
              Archive
            </span>
          </div>
          <button className="material-symbols-outlined text-primary text-3xl active:translate-y-[2px] transition-transform">
            settings
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-surface-container">
        <div 
          className="h-full bg-primary-container rounded-r-full progress-fill"
          style={{ width: `${(attempts / maxAttempts) * 100}%` }}
        />
      </div>
    </header>
  );
}

interface NavigationProps {
  showInHeader?: boolean;
}

export function Navigation({ showInHeader = false }: NavigationProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (showInHeader) {
    return (
      <header className="w-full top-0 sticky bg-surface z-40 border-b-4 border-surface-variant">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <span className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight">
              Bible Wordle
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`nav-link ${pathname === "/dashboard" ? "text-primary" : "text-on-surface-variant"}`}
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`nav-link ${pathname === "/admin" ? "text-primary" : "text-on-surface-variant"}`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => logout()}
                  className="text-sm text-error hover:opacity-80 font-bold transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-link text-on-surface-variant"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-action tile-press"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav className="w-full bg-surface border-t-4 border-surface-variant">
      <div className="flex justify-around items-center px-4 py-2 max-w-lg mx-auto">
        <Link
          href="/dashboard"
          className={`nav-item ${pathname === "/dashboard" ? "nav-active" : "text-on-surface-variant"}`}
        >
          <span className={`material-symbols-outlined ${pathname === "/dashboard" ? "filled-icon" : ""}`}>
            home
          </span>
          <span className="text-label">Home</span>
        </Link>
        
        <Link
          href="/play"
          className={`nav-item ${pathname === "/play" ? "nav-active" : "text-on-surface-variant"}`}
        >
          <span className={`material-symbols-outlined ${pathname === "/play" ? "filled-icon" : ""}`}>
            videogame_asset
          </span>
          <span className="text-label">Play</span>
        </Link>
        
        <Link
          href="/stats"
          className={`nav-item ${pathname === "/stats" ? "nav-active" : "text-on-surface-variant"}`}
        >
          <span className={`material-symbols-outlined ${pathname === "/stats" ? "filled-icon" : ""}`}>
            local_fire_department
          </span>
          <span className="text-label">Streaks</span>
        </Link>
      </div>
    </nav>
  );
}
