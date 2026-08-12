import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyChallenge from "@/models/DailyChallenge";
import "@/models/BibleWord";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const now = new Date();
    const month = parseInt(
      searchParams.get("month") || String(now.getUTCMonth() + 1)
    );
    const year = parseInt(
      searchParams.get("year") || String(now.getUTCFullYear())
    );

    await connectToDatabase();

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const challenges = await DailyChallenge.find({
      date: { $gte: startDate, $lt: endDate },
    })
      .populate("word", "word category testament")
      .sort({ date: 1 });

    return NextResponse.json({ challenges, month, year });
  } catch (error) {
    console.error("Get calendar error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
