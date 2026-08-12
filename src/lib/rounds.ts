import type mongoose from "mongoose";
import DailyChallenge from "@/models/DailyChallenge";
import Attempt from "@/models/Attempt";
import { MAX_ATTEMPTS } from "@/lib/gameLogic";

export interface PopulatedChallenge {
  _id: mongoose.Types.ObjectId;
  date: Date;
  round: number;
  word: { word: string; _id: mongoose.Types.ObjectId };
  hintsEnabled: boolean;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  reflectionQuestion?: string;
}

export interface ActiveRound {
  challenge: PopulatedChallenge;
  round: number;
  totalRounds: number;
  finished: boolean;
  nextRoundAvailable: boolean;
}

export async function getChallengesForDay(
  today: Date,
  tomorrow: Date
): Promise<PopulatedChallenge[]> {
  return (await DailyChallenge.find({
    date: { $gte: today, $lt: tomorrow },
  })
    .populate("word", "word category testament")
    .sort({ round: 1 })) as unknown as PopulatedChallenge[];
}

export async function getActiveRoundForUser(
  userId: string,
  challenges: PopulatedChallenge[]
): Promise<ActiveRound | null> {
  if (challenges.length === 0) {
    return null;
  }

  const totalRounds = challenges.length;

  for (const challenge of challenges) {
    const attempts = await Attempt.find({
      user: userId,
      challenge: challenge._id,
    }).select("result attemptNumber");

    const solved = attempts.some((a) =>
      a.result.every((r: string) => r === "correct")
    );
    const exhausted = attempts.length >= MAX_ATTEMPTS;

    if (!solved && !exhausted) {
      return {
        challenge,
        round: challenge.round,
        totalRounds,
        finished: false,
        nextRoundAvailable: totalRounds > challenge.round,
      };
    }
  }

  const last = challenges[challenges.length - 1];
  return {
    challenge: last,
    round: last.round,
    totalRounds,
    finished: true,
    nextRoundAvailable: false,
  };
}