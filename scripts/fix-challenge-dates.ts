/**
 * Normalizes all DailyChallenge `date` fields to UTC midnight so that every
 * player query (which is now also UTC-keyed) finds the correct day's puzzle.
 *
 * Prior to this fix, challenge dates were stored at server-local midnight,
 * so challenges written from a non-UTC machine ended up a day off from the
 * UTC-midnight queries on Vercel — the cause of "No challenge today".
 *
 * Run with:  npm run fix-dates
 * Uses MONGODB_URI from the environment.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function startOfUtcDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is required.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const collection = mongoose.connection.collection("dailychallenges");
  const docs = await collection.find({}).sort({ createdAt: 1 }).toArray();

  let fixed = 0;
  let duplicatesSkipped = 0;
  const seenKeys = new Map<string, string>();

  for (const doc of docs) {
    const date = doc.date instanceof Date ? new Date(doc.date) : new Date(doc.date);
    if (Number.isNaN(date.getTime())) {
      console.log(`SKIP ${doc._id} - invalid date value`);
      continue;
    }

    const target = startOfUtcDate(date);
    const key = target.toISOString().slice(0, 10);

    if (seenKeys.has(key)) {
      console.log(
        `SKIP ${doc._id} - duplicate day ${key} already handled (keeping ${seenKeys.get(key)})`
      );
      duplicatesSkipped++;
      continue;
    }

    const existing = await collection.findOne({
      date: target,
      _id: { $ne: doc._id },
    });

    if (existing) {
      console.log(
        `SKIP ${doc._id} - a challenge already exists for day ${key} (${existing._id}); keeping that one`
      );
      duplicatesSkipped++;
      continue;
    }
    seenKeys.set(key, String(doc._id));

    if (date.getTime() !== target.getTime()) {
      await collection.updateOne({ _id: doc._id }, { $set: { date: target } });
      console.log(`FIXED ${doc._id} - ${date.toISOString()} -> ${target.toISOString()}`);
      fixed++;
    }
  }

  console.log(
    `Done. Fixed: ${fixed}, Duplicate-day skips: ${duplicatesSkipped}, Total processed: ${docs.length}`
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});