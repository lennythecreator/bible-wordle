import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyChallenge from "@/models/DailyChallenge";
import Attempt from "@/models/Attempt";
import UserStats from "@/models/UserStats";
import { evaluateGuess, isValidWord, getTodayDate } from "@/lib/gameLogic";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, guess } = await req.json();

    if (!challengeId || !guess) {
      return NextResponse.json(
        { error: "Challenge ID and guess are required" },
        { status: 400 }
      );
    }

    if (!isValidWord(guess)) {
      return NextResponse.json(
        { error: "Invalid word. Must be at least 4 letters and contain only alphabetic characters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const challenge = await DailyChallenge.findById(challengeId).populate("word");

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const today = getTodayDate();
    const challengeDate = new Date(challenge.date);
    challengeDate.setHours(0, 0, 0, 0);

    if (challengeDate.getTime() !== today.getTime()) {
      return NextResponse.json(
        { error: "This challenge is not available today" },
        { status: 400 }
      );
    }

    const word = challenge.word as any;
    const answer = word.word.toUpperCase();

    const existingAttempts = await Attempt.find({
      user: user.id,
      challenge: challengeId,
    }).sort({ attemptNumber: 1 });

    if (existingAttempts.length >= 6) {
      return NextResponse.json(
        { error: "You have used all your attempts" },
        { status: 400 }
      );
    }

    const alreadySolved = existingAttempts.some(
      (attempt) => attempt.result.every((r: string) => r === "correct")
    );

    if (alreadySolved) {
      return NextResponse.json(
        { error: "You have already solved this challenge" },
        { status: 400 }
      );
    }

    const evaluation = evaluateGuess(guess.toUpperCase(), answer);
    const attemptNumber = existingAttempts.length + 1;

    const attempt = await Attempt.create({
      user: user.id,
      challenge: challengeId,
      guess: guess.toUpperCase(),
      result: evaluation.result,
      attemptNumber,
    });

    if (evaluation.isCorrect) {
      let stats = await UserStats.findOne({ user: user.id });

      if (!stats) {
        stats = await UserStats.create({
          user: user.id,
          gamesPlayed: 1,
          wins: 1,
          currentStreak: 1,
          longestStreak: 1,
          lastPlayedAt: new Date(),
        });
      } else {
        const lastPlayed = stats.lastPlayedAt
          ? new Date(stats.lastPlayedAt)
          : null;
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutiveDay =
          lastPlayed &&
          (lastPlayed.getTime() === todayDate.getTime() ||
            lastPlayed.getTime() === yesterday.getTime());

        stats.gamesPlayed += 1;
        stats.wins += 1;
        stats.currentStreak = isConsecutiveDay ? stats.currentStreak + 1 : 1;
        stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
        stats.lastPlayedAt = new Date();
        await stats.save();
      }
    }

    return NextResponse.json({
      attempt: {
        id: attempt._id,
        guess: attempt.guess,
        result: attempt.result,
        attemptNumber: attempt.attemptNumber,
      },
      isCorrect: evaluation.isCorrect,
      attemptsUsed: attemptNumber,
      maxAttempts: 6,
    });
  } catch (error) {
    console.error("Submit guess error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
