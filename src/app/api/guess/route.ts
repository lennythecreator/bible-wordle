import { NextResponse } from "next/server";
import type mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { withTransaction } from "@/lib/transactions";
import DailyChallenge from "@/models/DailyChallenge";
import "@/models/BibleWord";
import Attempt from "@/models/Attempt";
import UserStats from "@/models/UserStats";
import { evaluateGuess, isValidWord, getTodayDate } from "@/lib/gameLogic";
import { toDateKey, addUtcDays } from "@/lib/dates";

const MAX_ATTEMPTS = 6;

interface PopulatedChallenge {
  _id: mongoose.Types.ObjectId;
  date: Date;
  word: { word: string };
}

async function submitAttempt({
  userId,
  challenge,
  guess,
  session,
}: {
  userId: string;
  challenge: PopulatedChallenge;
  guess: string;
  session?: mongoose.ClientSession;
}) {
  const query = Attempt.find({ user: userId, challenge: challenge._id }).sort({
    attemptNumber: 1,
  });
  if (session) query.session(session);
  const existingAttempts = await query;

  if (existingAttempts.length >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "You have used all your attempts" },
      { status: 400 }
    );
  }

  const alreadySolved = existingAttempts.some((attempt) =>
    attempt.result.every((r: string) => r === "correct")
  );
  if (alreadySolved) {
    return NextResponse.json(
      { error: "You have already solved this challenge" },
      { status: 400 }
    );
  }

  const answer = challenge.word.word.toUpperCase();
  const evaluation = evaluateGuess(guess, answer);
  const attemptNumber = existingAttempts.length + 1;

  const [attempt] = await Attempt.create(
    [
      {
        user: userId,
        challenge: challenge._id,
        guess: guess.toUpperCase(),
        result: evaluation.result,
        attemptNumber,
      },
    ],
    session ? { session } : undefined
  );

  const now = new Date();
  const todayKey = toDateKey(now);
  const yesterdayKey = toDateKey(addUtcDays(now, -1));

  let stats = session
    ? await UserStats.findOne({ user: userId }).session(session)
    : await UserStats.findOne({ user: userId });

  if (!stats) {
    const [created] = session
      ? await UserStats.create(
          [
            {
              user: userId,
              gamesPlayed: 1,
              wins: evaluation.isCorrect ? 1 : 0,
              currentStreak: evaluation.isCorrect ? 1 : 0,
              longestStreak: evaluation.isCorrect ? 1 : 0,
              lastPlayedAt: now,
            },
          ],
          { session }
        )
      : await UserStats.create([
          {
            user: userId,
            gamesPlayed: 1,
            wins: evaluation.isCorrect ? 1 : 0,
            currentStreak: evaluation.isCorrect ? 1 : 0,
            longestStreak: evaluation.isCorrect ? 1 : 0,
            lastPlayedAt: now,
          },
        ]);
    stats = created;
  } else {
    const lastPlayedKey = stats.lastPlayedAt
      ? toDateKey(new Date(stats.lastPlayedAt))
      : null;
    const alreadyPlayedToday = lastPlayedKey === todayKey;

    if (!alreadyPlayedToday) {
      stats.gamesPlayed += 1;

      if (evaluation.isCorrect) {
        stats.wins += 1;
        stats.currentStreak =
          lastPlayedKey === yesterdayKey ? stats.currentStreak + 1 : 1;
        stats.longestStreak = Math.max(
          stats.longestStreak,
          stats.currentStreak
        );
      } else {
        stats.currentStreak = 0;
      }

      stats.lastPlayedAt = now;

      if (session) {
        await stats.save({ session });
      } else {
        await stats.save();
      }
    }
  }

  return NextResponse.json({
    attempt: {
      id: attempt._id,
      guess: attempt.guess,
      result: attempt.result,
      attemptNumber: attempt.attemptNumber,
    },
    isCorrect: evaluation.isCorrect,
    attemptsUsed: attemptNumber,
    maxAttempts: MAX_ATTEMPTS,
    answer:
      evaluation.isCorrect || attemptNumber >= MAX_ATTEMPTS
        ? answer
        : undefined,
  });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, guess } = await req.json();

    if (!challengeId || !guess) {
      return NextResponse.json(
        { error: "Challenge ID and guess are required" },
        { status: 400 }
      );
    }

    if (!isValidWord(guess)) {
      return NextResponse.json(
        { error: "Invalid guess. Use only letters and numbers, at least 4 characters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const challenge = (await DailyChallenge.findById(challengeId).populate(
      "word"
    )) as unknown as PopulatedChallenge | null;

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    const today = getTodayDate();

    if (toDateKey(challenge.date) !== toDateKey(today)) {
      return NextResponse.json(
        { error: "This challenge is not available today" },
        { status: 400 }
      );
    }

    const answer = challenge.word.word.toUpperCase();

    if (guess.toUpperCase().length !== answer.length) {
      return NextResponse.json(
        { error: `Guess must be exactly ${answer.length} letters` },
        { status: 400 }
      );
    }

    const result = await withTransaction((session) =>
      submitAttempt({ userId: user.id, challenge, guess, session })
    );

    if (result === null) {
      return submitAttempt({ userId: user.id, challenge, guess });
    }

    return result;
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 11000) {
      return NextResponse.json(
        { error: "Your guess could not be submitted, please try again" },
        { status: 409 }
      );
    }
    console.error("Submit guess error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
