/**
 * Migrates DailyChallenge to support multiple rounds per day:
 *   1. backfills `round: 1` on all existing challenges,
 *   2. replaces the unique index on `date` alone with a compound
 *      unique index on `{ date, round }`.
 *
 * Run with:  npm run migrate-rounds
 * Uses MONGODB_URI from the environment.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const collection = mongoose.connection.collection("dailychallenges");

  const indexes = await collection.indexes();
  const dateIndex = indexes.find(
    (idx) =>
      idx.key &&
      Object.keys(idx.key).length === 1 &&
      idx.key.date &&
      idx.unique
  );

  if (dateIndex && typeof dateIndex.name === "string") {
    await collection.dropIndex(dateIndex.name);
    console.log(`Dropped date-only unique index: ${dateIndex.name}`);
  } else {
    console.log("No date-only unique index found to drop");
  }

  const backfill = await collection.updateMany(
    { round: { $exists: false } },
    { $set: { round: 1 } }
  );
  console.log(`Backfilled round:1 on ${backfill.modifiedCount} documents`);

  await collection.createIndex({ date: 1, round: 1 }, { unique: true });
  console.log("Created unique compound index on { date, round }");

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});