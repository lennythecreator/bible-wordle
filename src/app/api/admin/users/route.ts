import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import UserStats from "@/models/UserStats";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const users = await User.find({ role: "user" })
      .select("name email username createdAt")
      .sort({ createdAt: -1 })
      .limit(50);

    const userIds = users.map((u) => u._id);
    const stats = await UserStats.find({ user: { $in: userIds } }).select(
      "user currentStreak longestStreak gamesPlayed"
    );

    const statsMap = new Map(
      stats.map((s) => [s.user.toString(), s])
    );

    const usersWithStats = users.map((u) => {
      const userStats = statsMap.get(u._id.toString());
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        username: u.username,
        createdAt: u.createdAt,
        currentStreak: userStats?.currentStreak || 0,
        longestStreak: userStats?.longestStreak || 0,
        gamesPlayed: userStats?.gamesPlayed || 0,
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
