# Vertical Slices: Multi-round challenges

Build order — each slice ends in a runnable, testable state.

- [ ] **Slice 1 — model + round-aware `/today` (tracer bullet).** Add `round` to
  `DailyChallenge`, swap the unique index, write `scripts/migrate-rounds.ts`, add
  `src/lib/rounds.ts`, and return `round`/`totalRounds`/`finished`/`nextRoundAvailable`
  from `GET /api/challenge/today`. Single-challenge days keep working. Verify with
  curl + mongosh index check. (Still no admin round-2 publishing — that's Slice 2.)
- [ ] **Slice 2 — admin publishes round 2.** `POST /api/admin/challenge` auto-increments
  `round` when omitted (409 + `overwrite` still resolves same date+round collisions).
  `GET /api/admin/challenge` returns `round` and aggregates `attemptCount`/`solvedCount`.
  Verify: publish two challenges for today without `round`, both succeed as rounds 1/2;
  GET shows both with counts.
- [ ] **Slice 3 — round unlock + per-round stats.** `POST /api/guess` rejects guesses for
  non-active rounds; stats count each round as a game; streak stays first-round-of-day
  gated. Verify via curl: round-2 guess blocked until round 1 finished; two same-day
  round wins give gamesPlayed +2 / wins +2, one streak.
- [ ] **Slice 4 — play page Next Round flow.** Parse new `TodayResponse`/`GuessResponse`
  fields; reset board when `challengeId` changes; round badge ("Round 2 of 2"); game-over
  card shows "Next Round" (enabled when `nextRoundAvailable`) or "Check back later".
  Verify in browser across the 3 mockup states.
- [ ] **Slice 5 — admin live polling + counts UI.** Admin page polls
  `GET /api/admin/challenge` every ~15s, renders today's round pills with live
  attempt/solve counts, and the publish flow no longer triggers the overwrite prompt for
  a new round. Verify in two browser tabs (one plays, one admin) — counts tick without
  a reload.

Optional follow-up (not part of this feature): add vitest + unit tests for `rounds.ts`
and stats logic, the two pieces with the most behavior. The repo currently has no test
runner (Gate 3 test plan).