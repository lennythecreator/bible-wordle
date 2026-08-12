import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Attempt from "@/models/Attempt";
import "@/models/User";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(challengeId)) {
      return NextResponse.json(
        { error: "Invalid challenge ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const attempts = await Attempt.find({ challenge: challengeId })
      .populate("user", "name username email")
      .sort({ attemptNumber: 1, createdAt: 1 });

    const grouped: {
      user: {
        id: string;
        name: string;
        username?: string;
        email: string;
      };
      solved: boolean;
      solvedAt: string | null;
      attemptsUsed: number;
      guesses: { guess: string; result: string[]; attemptNumber: number }[];
    }[] = [];

    const byUser = new Map<string, typeof grouped[number]>();
    for (const attempt of attempts) {
      const u = attempt.user as unknown as {
        _id: string;
        name: string;
        username?: string;
        email: string;
      };
      const uid = u._id.toString();
      let entry = byUser.get(uid);
      if (!entry) {
        entry = {
          user: { id: uid, name: u.name, username: u.username, email: u.email },
          solved: false,
          solvedAt: null,
          attemptsUsed: 0,
          guesses: [],
        };
        byUser.set(uid, entry);
      }
      const solved = attempt.result.every((r) => r === "correct");
      if (solved) entry.solved = true;
      entry.attemptsUsed += 1;
      if (solved && !entry.solvedAt) {
        entry.solvedAt = attempt.createdAt.toISOString();
      }
      entry.guesses.push({
        guess: attempt.guess,
        result: attempt.result,
        attemptNumber: attempt.attemptNumber,
      });
    }

    for (const entry of byUser.values()) {
      if (entry.solved) {
        grouped.push(entry);
      }
    }
    grouped.sort((a, b) => {
      const aTime = a.solvedAt ? new Date(a.solvedAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.solvedAt ? new Date(b.solvedAt).getTime() : Number.MAX_SAFE_INTEGER;

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return a.user.name.localeCompare(b.user.name);
    });

    return NextResponse.json({ players: grouped });
  } catch (error) {
    console.error("Get round attempts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}