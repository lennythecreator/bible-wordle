import { NextResponse } from "next/server";
import type mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { utcDateFromKey } from "@/lib/dates";
import DailyChallenge from "@/models/DailyChallenge";
import BibleWord from "@/models/BibleWord";
import Attempt from "@/models/Attempt";

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
      .sort({ date: -1, round: 1 })
      .limit(30);

    const challengeIds = challenges.map((c) => c._id);
    const counts = await Attempt.aggregate<{
      _id: mongoose.Types.ObjectId;
      attemptCount: number;
      solvedCount: number;
    }>([
      { $match: { challenge: { $in: challengeIds } } },
      {
        $group: {
          _id: { challenge: "$challenge", user: "$user" },
          solved: {
            $max: {
              $cond: [
                {
                  $allElementsTrue: {
                    $map: {
                      input: "$result",
                      as: "r",
                      in: { $eq: ["$$r", "correct"] },
                    },
                  },
                },
                1,
                0,
              ],
            },
          },
          attempts: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.challenge",
          attemptCount: { $sum: "$attempts" },
          solvedCount: { $sum: "$solved" },
        },
      },
    ]);

    const countMap = new Map(
      counts.map((c) => [c._id.toString(), c])
    );

    const rounds = challenges.map((challenge) => {
      const c = countMap.get(challenge._id.toString());
      return {
        ...challenge.toObject(),
        round: challenge.round,
        attemptCount: c?.attemptCount ?? 0,
        solvedCount: c?.solvedCount ?? 0,
      };
    });

    return NextResponse.json({ challenges: rounds });
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

    const { wordId, date, round, hintsEnabled, hint1, hint2, hint3, reflectionQuestion, overwrite } =
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

    let challengeDate: Date;
    try {
      challengeDate = utcDateFromKey(date);
    } catch {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const maxRoundResult = await DailyChallenge.find({ date: challengeDate })
      .sort({ round: -1 })
      .select("round")
      .limit(1);
    const targetRound =
      round ?? (maxRoundResult.length > 0 ? maxRoundResult[0].round + 1 : 1);

    const existingChallenge = await DailyChallenge.findOne({
      date: challengeDate,
      round: targetRound,
    });

    if (existingChallenge && !overwrite) {
      return NextResponse.json(
        {
          error: "A challenge already exists for this date and round",
          existingChallenge: {
            id: existingChallenge._id,
            wordId: existingChallenge.word,
            date: existingChallenge.date,
            round,
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
      existingChallenge.reflectionQuestion = reflectionQuestion;
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
      round: targetRound,
      hintsEnabled: hintsEnabled ?? true,
      hint1: hint1 || `Category: ${word.category}`,
      hint2: hint2 || (word.author ? `Written by ${word.author}` : undefined),
      hint3: hint3 || word.description,
      reflectionQuestion,
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

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, reflectionQuestion } = await req.json();

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let challengeDate: Date;
    try {
      challengeDate = utcDateFromKey(date);
    } catch {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const challenges = await DailyChallenge.find({ date: challengeDate });

    if (challenges.length === 0) {
      return NextResponse.json(
        { error: "No challenge found for this date" },
        { status: 404 }
      );
    }

    for (const challenge of challenges) {
      challenge.reflectionQuestion = reflectionQuestion;
      await challenge.save();
    }

    return NextResponse.json({
      message: "Challenge updated successfully",
      challenge: challenges[0],
    });
  } catch (error) {
    console.error("Update challenge error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
