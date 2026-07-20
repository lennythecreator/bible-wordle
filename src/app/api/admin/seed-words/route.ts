import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BibleWord from "@/models/BibleWord";
import { BIBLE_BOOKS } from "@/data/bibleBooks";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const results = { created: 0, skipped: 0, errors: 0 };

    for (const book of BIBLE_BOOKS) {
      try {
        const existing = await BibleWord.findOne({ word: book.word });
        if (existing) {
          results.skipped++;
          continue;
        }

        await BibleWord.create({
          word: book.word,
          description: book.description,
          testament: book.testament,
          category: book.category,
        });
        results.created++;
      } catch {
        results.errors++;
      }
    }

    return NextResponse.json({
      message: "Bible books seeded successfully",
      results,
    });
  } catch (error) {
    console.error("Seed Bible books error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
