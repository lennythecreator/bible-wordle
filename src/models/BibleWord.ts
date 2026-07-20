import mongoose, { Schema, Document } from "mongoose";

export interface IBibleWord extends Document {
  word: string;
  description: string;
  testament: "Old Testament" | "New Testament";
  author?: string;
  category: string;
  verse?: string;
  verseText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BibleWordSchema = new Schema<IBibleWord>(
  {
    word: {
      type: String,
      required: [true, "Word is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 4,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    testament: {
      type: String,
      enum: ["Old Testament", "New Testament"],
      required: [true, "Testament is required"],
    },
    author: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Law",
        "History",
        "Wisdom",
        "Prophets",
        "Gospels",
        "Epistles",
        "Apocalyptic",
      ],
    },
    verse: {
      type: String,
      trim: true,
    },
    verseText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BibleWord ||
  mongoose.model<IBibleWord>("BibleWord", BibleWordSchema);
