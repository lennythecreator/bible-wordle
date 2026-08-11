import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyChallenge from "@/models/DailyChallenge";
import Attempt from "@/models/Attempt";
import { getTodayDate } from "@/lib/gameLogic";
import { addUtcDays } from "@/lib/dates";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const today = getTodayDate();
    const tomorrow = addUtcDays(today, 1);

    const challenge = await DailyChallenge.findOne({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("word", "word category testament")
      .populate("createdBy", "name");

    if (!challenge) {
      return NextResponse.json(
        { error: "No challenge available for today" },
        { status: 404 }
      );
    }

    const word = challenge.word as unknown as { word: string };

    const attempts = await Attempt.find({
      user: user.id,
      challenge: challenge._id,
    })
      .select("guess result attemptNumber")
      .sort({ attemptNumber: 1 });

    const finished =
      attempts.some((a) => a.result.every((r: string) => r === "correct")) ||
      attempts.length >= 6;

    return NextResponse.json({
      challengeId: challenge._id,
      wordLength: word.word.length,
      answer: finished ? word.word : undefined,
      maxAttempts: 6,
      hintsEnabled: challenge.hintsEnabled,
      hint1: challenge.hintsEnabled ? challenge.hint1 : undefined,
      hint2: challenge.hintsEnabled ? challenge.hint2 : undefined,
      hint3: challenge.hintsEnabled ? challenge.hint3 : undefined,
      reflectionQuestion: challenge.reflectionQuestion,
      dayNumber: Math.floor(
        (today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24)
      ),
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
