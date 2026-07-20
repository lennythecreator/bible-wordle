"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { GameHeader } from "@/components/Navigation";
import { GameBoard } from "@/components/GameBoard";
import { Keyboard } from "@/components/Keyboard";
import { GuessResult } from "@/lib/gameLogic";
import { useAuth } from "@/contexts/AuthContext";

interface Challenge {
  challengeId: string;
  wordLength: number;
  hintsEnabled: boolean;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  dayNumber: number;
}

interface Guess {
  guess: string;
  result: GuessResult[];
}

export default function PlayPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, GuessResult>
  >({});

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch("/api/challenge/today");
        if (response.ok) {
          const data = await response.json();
          setChallenge(data);
        } else {
          setError("No challenge available today");
        }
      } catch {
        setError("Failed to load challenge");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChallenge();
    }
  }, [user]);

  const updateLetterStatuses = useCallback((guesses: Guess[]) => {
    const statuses: Record<string, GuessResult> = {};

    for (const { result, guess } of guesses) {
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const currentStatus = statuses[letter];

        if (result[i] === "correct") {
          statuses[letter] = "correct";
        } else if (result[i] === "wrong" && currentStatus !== "correct") {
          statuses[letter] = "wrong";
        } else if (!currentStatus && result[i] === "missing") {
          statuses[letter] = "missing";
        }
      }
    }

    setLetterStatuses(statuses);
  }, []);

  const showError = useCallback((message: string) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setErrorKey((prev) => prev + 1);
    setError(message);
    errorTimerRef.current = setTimeout(() => setError(""), 3000);
  }, []);

  const handleKeyPress = (key: string) => {
    if (gameOver || submitting || isRevealing) return;

    if (challenge && currentGuess.length < challenge.wordLength) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    if (gameOver || submitting || isRevealing) return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleEnter = async () => {
    if (gameOver || submitting || isRevealing || !challenge) return;

    if (currentGuess.length !== challenge.wordLength) {
      showError(`Guess must be ${challenge.wordLength} letters`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          guess: currentGuess,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || "Failed to submit guess");
        setSubmitting(false);
        return;
      }

      const newGuess: Guess = {
        guess: data.attempt.guess,
        result: data.attempt.result,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      setCurrentGuess("");
      setSubmitting(false);
      setIsRevealing(true);

      const revealDuration = challenge.wordLength * 250 + 500;
      revealTimerRef.current = setTimeout(() => {
        setIsRevealing(false);
        updateLetterStatuses(newGuesses);

        if (data.isCorrect) {
          setWon(true);
          setGameOver(true);
        } else if (data.attemptsUsed >= data.maxAttempts) {
          setGameOver(true);
        }
      }, revealDuration);
    } catch {
      showError("Failed to submit guess");
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-on-surface-variant font-body">Loading...</div>
        </main>
      </div>
    );
  }

  if (!user || !challenge) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <GameHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-primary mb-2">
              No Challenge Today
            </h1>
            <p className="font-body text-on-surface-variant">
              Check back tomorrow for a new puzzle!
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GameHeader attempts={guesses.length} maxAttempts={6} />

      <main className="flex-grow flex flex-col items-center justify-start px-3 py-3 max-w-2xl mx-auto w-full md:justify-center md:py-6">
        {/* Game Board */}
        <div className="w-full mb-4 md:mb-10">
          <GameBoard
            guesses={guesses}
            currentGuess={currentGuess}
            wordLength={challenge.wordLength}
            maxAttempts={6}
            gameOver={gameOver}
            isRevealing={isRevealing}
            won={won}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            key={errorKey}
            className="w-full max-w-md mb-3 md:mb-4 bg-error-container border-2 border-error rounded-xl p-3 md:p-4 text-center shake"
          >
            <p className="font-body text-on-error-container text-sm md:text-base">
              {error}
            </p>
          </div>
        )}

        {/* Game Over Message */}
        {gameOver && (
          <div
            className={`w-full max-w-md mb-4 md:mb-6 rounded-xl p-4 md:p-6 text-center card-elevated ${
              won
                ? "bg-tertiary-container border-2 border-tertiary"
                : "bg-surface-container-low border-2 border-outline-variant"
            }`}
          >
            {won ? (
              <>
                <p className="font-display text-headline-lg-mobile text-white mb-2 bounce">
                  🎉 Great Job!
                </p>
                <p className="font-body text-white text-sm md:text-base">
                  Solved in {guesses.length}/6 attempts
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-headline-lg-mobile text-on-surface mb-2">
                  Game Over!
                </p>
                <p className="font-body text-on-surface-variant text-sm md:text-base">
                  Better luck tomorrow!
                </p>
              </>
            )}
          </div>
        )}

        {/* Keyboard */}
        <div className="w-full pb-[max(6rem,calc(5rem+env(safe-area-inset-bottom)))] md:pb-8">
          <Keyboard
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onEnter={handleEnter}
            letterStatuses={letterStatuses}
            disabled={gameOver || submitting || isRevealing}
          />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
        <nav className="flex justify-around items-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 bg-surface border-t-4 border-surface-variant rounded-t-xl">
          <a
            href="/play"
            className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl px-4 py-1 translate-y-[-2px] border-b-4 border-on-secondary-fixed-variant active:translate-y-[4px] active:border-b-0 transition-all duration-75"
          >
            <span className="material-symbols-outlined [font-variation-settings:'FILL'_1]">
              videogame_asset
            </span>
            <span className="font-label text-[14px] leading-[20px] tracking-[0.05em] font-bold">
              Play
            </span>
          </a>

          <a
            href="/stats"
            className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-high active:translate-y-[2px] transition-all duration-75"
          >
            <span className="material-symbols-outlined">
              local_fire_department
            </span>
            <span className="font-label text-[14px] leading-[20px] tracking-[0.05em] font-bold">
              Streaks
            </span>
          </a>

          <a
            href="/dashboard"
            className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 hover:bg-surface-container-high active:translate-y-[2px] transition-all duration-75"
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span className="font-label text-[14px] leading-[20px] tracking-[0.05em] font-bold">
              Bible
            </span>
          </a>
        </nav>
      </div>

      {/* Sparkle Container */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        id="sparkle-container"
      />
    </div>
  );
}
