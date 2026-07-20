import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import UserStats from "@/models/UserStats";
import Attempt from "@/models/Attempt";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let stats = await UserStats.findOne({ user: user.id });

    if (!stats) {
      stats = await UserStats.create({
        user: user.id,
        gamesPlayed: 0,
        wins: 0,
        currentStreak: 0,
        longestStreak: 0,
      });
    }

    const recentAttempts = await Attempt.find({ user: user.id })
      .populate("challenge")
      .sort({ createdAt: -1 })
      .limit(10);

    const averageAttempts =
      stats.wins > 0
        ? (
            recentAttempts.reduce((sum: number, a: any) => sum + a.attemptNumber, 0) /
            Math.min(recentAttempts.length, stats.wins)
          ).toFixed(1)
        : "0";

    return NextResponse.json({
      gamesPlayed: stats.gamesPlayed,
      wins: stats.wins,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      averageAttempts,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
