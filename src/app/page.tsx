"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="bg-background text-on-background min-h-screen min-h-[100dvh] flex flex-col items-center justify-center font-body relative overflow-hidden">
      {/* Bottom Background Decoration */}
      <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Welcome Canvas */}
      <main className="w-full max-w-md px-6 pb-[env(safe-area-inset-bottom)] flex flex-col items-center text-center relative z-10">
        {/* Mascot Section */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6 animate-float">
            {/* Mascot Container with soft shadow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
            <div className="relative z-10 w-full h-full flex items-center justify-center text-8xl">
              📜
            </div>
          </div>
          <h1 className="font-display text-display text-primary tracking-tight mb-2">
            Shalom!
          </h1>
          <p className="font-display text-headline-lg-mobile text-on-surface-variant leading-tight">
            Ready to Play?
          </p>
        </div>

        {/* Description */}
        <div className="mb-10 max-w-xs">
          <p className="font-body text-body-lg text-outline">
            Step into a world where biblical wisdom meets playful challenges. Discover your daily word and climb the leaderboard!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-6">
          {/* Primary Action */}
          <button
            onClick={() => router.push(user ? "/dashboard" : "/signup")}
            className="tactile-button-primary w-full py-5 rounded-2xl font-label text-label-bold text-on-secondary-container flex items-center justify-center gap-2 group"
          >
            GET STARTED
            <span className="material-symbols-outlined font-bold transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>

          {/* Secondary Action */}
          <button
            onClick={() => router.push(user ? "/dashboard" : "/login")}
            className="tactile-button-secondary w-full py-5 rounded-2xl font-label text-label-bold text-on-surface-variant"
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
        </div>

        {/* Footnote */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-container" />
            <div className="w-2 h-2 rounded-full bg-secondary-container/30" />
            <div className="w-2 h-2 rounded-full bg-tertiary-container/30" />
          </div>
          <p className="font-label text-[12px] text-outline-variant uppercase tracking-widest">
            A DIVINE PLAY ORIGINAL
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .tactile-button-primary {
          position: relative;
          background-color: #febf26;
          border: none;
          border-bottom: 6px solid #6d4f00;
          transition: all 0.1s ease;
        }
        .tactile-button-primary:hover {
          transform: translateY(-2px);
          border-bottom-width: 8px;
        }
        .tactile-button-primary:active {
          transform: translateY(4px);
          border-bottom-width: 0px;
        }
        .tactile-button-secondary {
          position: relative;
          background-color: white;
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
