import mongoose, { Schema, Document } from "mongoose";

export interface IAttempt extends Document {
  user: mongoose.Types.ObjectId;
  challenge: mongoose.Types.ObjectId;
  guess: string;
  result: ("correct" | "wrong" | "missing")[];
  attemptNumber: number;
  createdAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "DailyChallenge",
      required: [true, "Challenge is required"],
    },
    guess: {
      type: String,
      required: [true, "Guess is required"],
      uppercase: true,
    },
    result: [
      {
        type: String,
        enum: ["correct", "wrong", "missing"],
        required: true,
      },
    ],
    attemptNumber: {
      type: Number,
      required: [true, "Attempt number is required"],
      min: 1,
      max: 6,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Attempt ||
  mongoose.model<IAttempt>("Attempt", AttemptSchema);
