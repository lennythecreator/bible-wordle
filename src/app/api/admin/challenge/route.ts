import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import DailyChallenge from "@/models/DailyChallenge";
import BibleWord from "@/models/BibleWord";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const challenges = await DailyChallenge.find()
      .populate("word", "word category testament")
      .populate("createdBy", "name")
      .sort({ date: -1 })
      .limit(30);

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Get admin challenges error:", error);
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

    const { wordId, date, hintsEnabled, hint1, hint2, hint3, overwrite } =
      await req.json();

    if (!wordId || !date) {
      return NextResponse.json(
        { error: "Word ID and date are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const word = await BibleWord.findById(wordId);

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    const challengeDate = new Date(date);
    challengeDate.setHours(0, 0, 0, 0);

    const existingChallenge = await DailyChallenge.findOne({
      date: challengeDate,
    });

    if (existingChallenge && !overwrite) {
      return NextResponse.json(
        {
          error: "A challenge already exists for this date",
          existingChallenge: {
            id: existingChallenge._id,
            wordId: existingChallenge.word,
            date: existingChallenge.date,
          },
        },
        { status: 409 }
      );
    }

    if (existingChallenge && overwrite) {
      existingChallenge.word = wordId;
      existingChallenge.hintsEnabled = hintsEnabled ?? true;
      existingChallenge.hint1 = hint1 || `Category: ${word.category}`;
      existingChallenge.hint2 =
        hint2 || (word.author ? `Written by ${word.author}` : undefined);
      existingChallenge.hint3 = hint3 || word.description;
      existingChallenge.createdBy = user.id;
      await existingChallenge.save();

      return NextResponse.json({
        message: "Challenge updated successfully",
        challenge: existingChallenge,
      });
    }

    const challenge = await DailyChallenge.create({
      word: wordId,
      date: challengeDate,
      hintsEnabled: hintsEnabled ?? true,
      hint1: hint1 || `Category: ${word.category}`,
      hint2: hint2 || (word.author ? `Written by ${word.author}` : undefined),
      hint3: hint3 || word.description,
      createdBy: user.id,
    });

    return NextResponse.json(
      { message: "Challenge created successfully", challenge },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create challenge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
