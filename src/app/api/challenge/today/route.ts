import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyChallenge from "@/models/DailyChallenge";
import { getTodayDate } from "@/lib/gameLogic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const today = getTodayDate();

    const challenge = await DailyChallenge.findOne({ date: today })
      .populate("word", "word category testament")
      .populate("createdBy", "name");

    if (!challenge) {
      return NextResponse.json(
        { error: "No challenge available for today" },
        { status: 404 }
      );
    }

    const word = challenge.word as any;

    return NextResponse.json({
      challengeId: challenge._id,
      wordLength: word.word.length,
      hintsEnabled: challenge.hintsEnabled,
      hint1: challenge.hintsEnabled ? challenge.hint1 : undefined,
      hint2: challenge.hintsEnabled ? challenge.hint2 : undefined,
      hint3: challenge.hintsEnabled ? challenge.hint3 : undefined,
      dayNumber: Math.floor(
        (today.getTime() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24)
      ),
    });
  } catch (error) {
    console.error("Get challenge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
