# Architecture: Multi-round challenges

## Fit
Touches the challenge/guess/admin stack. No new services. Key insight: **Attempt is
already scoped to `challenge`** (`Attempt.ts:48` unique on `{user, challenge,
attemptNumber}`), so rounds can piggyback on challenges — one challenge = one round —
without touching the Attempt schema.

## Endpoints
- `GET /api/challenge/today` (modified) — returns the player's **active** round (first
  today challenge they haven't finished) plus round context: `round`, `totalRounds`,
  `finished`, `nextRoundAvailable`. Keeps the same field shape as today so hints/board
  logic is untouched.
- `POST /api/guess` (modified) — two additions: (1) **round unlock check** — reject a
  guess for challenge N if the user hasn't finished challenge N-1 for the same date;
  (2) stats accounting becomes per-round (see Data).
- `POST /api/admin/challenge` (modified) — accepts optional `round`. Defaults to
  `max(existing round for date) + 1` (auto "publish next round"). `overwrite` still
  resolves a 409 for the *same* date+round pair.
- `GET /api/admin/challenge` (modified) — returns each challenge with its `round`
  number plus attempt/solve counts (aggregated from Attempt) so the admin page can
  render the live activity line without a page reload.

No new endpoints required.

## Data
- `DailyChallenge`: add `round: number` (default 1, min 1). Replace inline
  `date: { unique: true }` with a compound unique index `{ date: 1, round: 1 }`.
  - Migration: existing collection has a unique index on `date` alone — must drop it
    and create the compound one (`db.dailychallenges.dropIndex({date:1})` then let the
    model re-index, or `createIndex`). Existing docs get `round: 1`.
- `Attempt`: unchanged.
- `UserStats`: per-round accounting. On a guess for a challenge with **zero prior
  attempts** for that user → `gamesPlayed += 1` (a new game/round). Win → `wins += 1`.
  Streak stays **day-based**: only the first round finished on a given UTC day updates
  `currentStreak`/`lastPlayedAt`; later same-day rounds count games/wins but never touch
  streak (prevents a player farming the streak). This replaces the current `lastPlayedAt`
  day-gate (`guess/route.ts:74`).

## Flow
Player:
1. `GET /api/challenge/today` → server finds today's challenges sorted by `round`,
   returns first unfinished one (active round) + round context.
2. Player guesses → `POST /api/guess` with `challengeId` → unlock check → evaluate →
   save Attempt → update UserStats per-round → response includes `round`, `isCorrect`,
   `attemptsUsed`, `answer` if finished.
3. On round finish, server response carries `nextRoundAvailable`; play page shows
   "Next Round" button → refetch `/today` → loads next round, board resets.

Admin:
1. `GET /api/admin/challenge` → rounds for date(s) with counts; page polls it on an
   interval (same polling pattern as `play/page.tsx:246`) → live updates.
2. "Publish Round N" → `POST /api/admin/challenge` with `{date, wordId, round?}` →
   auto-increments round when omitted.

## External
None. No env vars added.