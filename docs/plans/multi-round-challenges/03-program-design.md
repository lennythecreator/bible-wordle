# Program Design: Multi-round challenges

## Files

| File | Change |
| --- | --- |
| `src/models/DailyChallenge.ts` | Add `round: number` (default 1, min 1); replace inline `date: { unique: true }` with compound unique index `{ date: 1, round: 1 }` |
| `src/lib/rounds.ts` (NEW) | Shared day-challenge queries: today's rounds (sorted), the user's active round, "next round available" computation. Used by both `/today` and `/guess` |
| `src/app/api/challenge/today/route.ts` | Return active round + round context fields |
| `src/app/api/guess/route.ts` | Add round-unlock check; per-round stats; response gains `round`/`totalRounds`/`nextRoundAvailable` |
| `src/app/api/admin/challenge/route.ts` | GET returns `round` + per-challenge attempt/solve counts; POST auto-increments `round` when omitted (409+`overwrite` still resolves same date+round collisions) |
| `src/app/play/page.tsx` | Parse new fields; reset board when `challengeId` changes; game-over card gains Next Round button + round badge |
| `src/app/admin/page.tsx` | Publish flow stops treating a 2nd round as "overwrite"; poll challenge list every ~15s; render today's rounds with live counts |
| `scripts/migrate-rounds.ts` (NEW) | Drop the `date`-only unique index, backfill `round: 1`, create `{ date, round }` unique index |

## Types & signatures

```ts
// DailyChallenge
interface IDailyChallenge extends Document {
  word: IBibleWord["_id"];
  date: Date;
  round: number; // min 1, default 1
  // ...existing fields unchanged
}
DailyChallengeSchema.index({ date: 1, round: 1 }, { unique: true });

// rounds.ts
interface PopulatedChallenge {
  _id: mongoose.Types.ObjectId;
  date: Date;
  round: number;
  word: { word: string };
}

/** All challenges for a UTC day, oldest round first. */
async function getChallengesForDay(
  today: Date
): Promise<PopulatedChallenge[]>;

/** First challenge for the day the user has NOT finished (no solved
 *  attempt AND fewer than 6 attempts). If all finished, the last one,
 *  flagged finished=true. */
async function getActiveRoundForUser(
  userId: string,
  challenges: PopulatedChallenge[]
): Promise<{
  challenge: PopulatedChallenge;
  round: number;
  totalRounds: number;
  finished: boolean;
  nextRoundAvailable: boolean; // totalRounds > this round
}>;

// challenge/today response — superset of the current payload:
interface TodayResponse {
  challengeId: string;
  round: number;
  totalRounds: number;
  wordLength: number;
  answer?: string;
  maxAttempts: number;
  hintsEnabled: boolean;
  hint1?: string; hint2?: string; hint3?: string;
  reflectionQuestion?: string;
  dayNumber: number;
  finished: boolean;
  nextRoundAvailable: boolean;
  attempts: { guess: string; result: GuessResult[]; attemptNumber: number }[];
}

// guess: same as TodayResponse minus hints/reflection/dayNumber, plus:
interface GuessResponse {
  // ...existing (attempt, isCorrect, attemptsUsed, maxAttempts, answer)
  round: number;
  totalRounds: number;
  nextRoundAvailable: boolean;
}

// admin challenge GET: each challenge document in the array gains:
{ round: number; attemptCount: number; solvedCount: number }

// admin challenge POST body — `round` optional:
{ wordId: string; date: string; round?: number; hintsEnabled?: boolean;
  hint1?: string; hint2?: string; hint3?: string;
  reflectionQuestion?: string; overwrite?: boolean }
// omitted round -> computed as max(existing round for date) + 1
```

## Call stack

Player:
1. `PlayPage` mount/poll → `GET /api/challenge/today`
   → `getChallengesForDay(today)` → `getActiveRoundForUser(user, challenges)`
   → populate word, find attempts for active round → `TodayResponse` (404 if no challenges today).
2. Guess → `POST /api/guess` → validate → find challenge by id, must belong to today
   → `getActiveRoundForUser` and require `challenge._id` is that active round (else 400 "Finish the previous round first")
   → `submitAttempt` (+ transaction) → Attempt.create + UserStats update → `GuessResponse`.
3. Finish round → game-over card reads `nextRoundAvailable` → "Next Round" button → re-run call 1 → new `challengeId` → PlayPage resets board.

Admin:
1. Load + 15s poll → `GET /api/admin/challenge` → DailyChallenge.find for recent dates, populate word/creator, `Attempt.aggregate` for per-challenge `attemptCount`/`solvedCount`.
2. "SET CHALLENGE FOR TODAY" → `POST /api/admin/challenge` with no `round` → auto round = next for that day → admin list refreshes on next poll.

## Stats logic (inside submitAttempt)

```ts
const isNewRound = existingAttempts.length === 0; // first guess on this round
const lastPlayedKey = stats.lastPlayedAt ? toDateKey(stats.lastPlayedAt) : null;
const alreadyPlayedToday = lastPlayedKey === todayKey; // todayKey from lastPlayedAt

if (isNewRound) stats.gamesPlayed += 1;
if (evaluation.isCorrect) stats.wins += 1;

if (!alreadyPlayedToday) { // first ROUND started today -> streak decided here
  if (evaluation.isCorrect) {
    stats.currentStreak = lastPlayedKey === yesterdayKey ? stats.currentStreak + 1 : 1;
    stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }
  stats.lastPlayedAt = now;
  // save
} else if (isNewRound) {
  // later rounds same day: count the game, never touch streak
  // save
}
```
Note: `round` isn't stored on stats — only the streak logic cares, and that's day-gated,
so existing code shape (once-per-day gate) is preserved, just with `gamesPlayed`/`wins`
moved out of the gate.

## Test plan

No test runner exists in the repo (verified: zero `*.test.*` files, no test script in
package.json). Two options offered in slices: add `vitest` for unit tests, or verify via
curl/tsx scripts + manual browser checks. Test cases:

1. **Today endpoint** — with no challenges: 404. With challenges: returns active (first unfinished) round, correct `round`/`totalRounds`.
2. **Active round progression** — finished round 1 → active becomes round 2 (if published) or round 1 flagged `finished: true` (if not).
3. **Round unlock** — guess on round 3 while round 2 unfinished → 400; guess on active round → 200.
4. **Stats per round** — 2 rounds won on same day → `gamesPlayed` +2, `wins` +2, streak advanced at most once.
5. **Admin GET counts** — `attemptCount`/`solvedCount` match seeded attempts.
6. **Admin POST auto-round** — two POSTs same date without `round` → rounds 1 then 2; explicit same round → 409; `overwrite: true` → 200.
7. **Migration script** — idempotent; after run, old date-only index gone, `{date, round}` unique exists, all docs have `round`.

Least confident decisions:
1. Streak semantics: only the FIRST round started per day decides the streak. Worth confirming this is the intended "each round = a game but streak day-based" reading — later-round wins add to `wins` but can't extend/repair a streak.
2. `nextRoundAvailable` = another round exists for today, shown even mid-round — deliberate, harmless leak, keeps Day-1 options simple.
3. Reusing the existing play-page polling (30s) as-is vs dropping it to reduce chatter now that admin polls too.
4. Adding vitest vs keeping the repo's no-test convention for this feature.