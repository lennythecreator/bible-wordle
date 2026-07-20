import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import BibleWord from "@/models/BibleWord";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const words = await BibleWord.find()
      .sort({ word: 1 })
      .select("word category testament");

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Get words error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { word, description, testament, author, category, verse, verseText } =
      await req.json();

    if (!word || !description || !testament || !category) {
      return NextResponse.json(
        { error: "Word, description, testament, and category are required" },
        { status: 400 }
      );
    }

    if (word.length < 4) {
      return NextResponse.json(
        { error: "Word must be at least 4 letters" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingWord = await BibleWord.findOne({
      word: word.toUpperCase(),
    });

    if (existingWord) {
      return NextResponse.json(
        { error: "This word already exists" },
        { status: 409 }
      );
    }

    const newWord = await BibleWord.create({
      word: word.toUpperCase(),
      description,
      testament,
      author: author || undefined,
      category,
      verse: verse || undefined,
      verseText: verseText || undefined,
    });

    return NextResponse.json(
      { message: "Word created successfully", word: newWord },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create word error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
