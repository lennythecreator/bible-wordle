import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import "@/models/BibleWord";
import Attempt from "@/models/Attempt";
import { getTodayDate, MAX_ATTEMPTS } from "@/lib/gameLogic";
import { addUtcDays } from "@/lib/dates";
import {
  getChallengesForDay,
  getActiveRoundForUser,
} from "@/lib/rounds";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const today = getTodayDate();
    const tomorrow = addUtcDays(today, 1);

    const challenges = await getChallengesForDay(today, tomorrow);

    const active = await getActiveRoundForUser(user.id, challenges);

    if (!active) {
      return NextResponse.json(
        { error: "No challenge available for today" },
        { status: 404 }
      );
    }

    const { challenge } = active;
    const word = challenge.word as unknown as { word: string };

    const attempts = await Attempt.find({
      user: user.id,
      challenge: challenge._id,
    })
      .select("guess result attemptNumber")
      .sort({ attemptNumber: 1 });

    const answer = active.finished ? word.word : undefined;

    return NextResponse.json({
      challengeId: challenge._id,
      round: active.round,
      totalRounds: active.totalRounds,
      wordLength: word.word.length,
      answer,
      maxAttempts: MAX_ATTEMPTS,
      hintsEnabled: challenge.hintsEnabled,
      hint1: challenge.hintsEnabled ? challenge.hint1 : undefined,
      hint2: challenge.hintsEnabled ? challenge.hint2 : undefined,
      hint3: challenge.hintsEnabled ? challenge.hint3 : undefined,
      reflectionQuestion: challenge.reflectionQuestion,
      dayNumber: Math.floor(
        (today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24)
      ),
      finished: active.finished,
      nextRoundAvailable: active.nextRoundAvailable,
      attempts: attempts.map((a) => ({
        guess: a.guess,
        result: a.result,
        attemptNumber: a.attemptNumber,
      })),
    });
  } catch (error) {
    console.error("Get challenge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}