import mongoose, { Schema, Document } from "mongoose";
import { IBibleWord } from "./BibleWord";

export interface IDailyChallenge extends Document {
  word: IBibleWord["_id"];
  date: Date;
  round: number;
  hintsEnabled: boolean;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  reflectionQuestion?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DailyChallengeSchema = new Schema<IDailyChallenge>(
  {
    word: {
      type: Schema.Types.ObjectId,
      ref: "BibleWord",
      required: [true, "Word is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    round: {
      type: Number,
      required: [true, "Round is required"],
      default: 1,
      min: [1, "Round must be at least 1"],
    },
    hintsEnabled: {
      type: Boolean,
      default: true,
    },
    hint1: {
      type: String,
      trim: true,
    },
    hint2: {
      type: String,
      trim: true,
    },
    hint3: {
      type: String,
      trim: true,
    },
    reflectionQuestion: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

DailyChallengeSchema.index({ date: 1, round: 1 }, { unique: true });

export default mongoose.models.DailyChallenge ||
  mongoose.model<IDailyChallenge>("DailyChallenge", DailyChallengeSchema);
