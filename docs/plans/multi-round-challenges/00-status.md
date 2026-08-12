# Status: Multi-round challenges

- Gate 1 — Product: APPROVED
- Gate 2 — Architecture: APPROVED
- Gate 3 — Program Design: APPROVED
- Gate 4 — Slice plan: APPROVED

## Slices
- [x] Slice 1 — model + round-aware /today (tracer bullet)
- [x] Slice 2 — admin publishes round 2
- [x] Slice 3 — round unlock + per-round stats
- [x] Slice 4 — play page Next Round flow
- [x] Slice 5 — admin live polling + counts UI

## Notes for a fresh session

- Feature: let a game master (admin) publish more than one challenge ("round") for the same calendar day, and let players play round 2+ after finishing round 1.
- Player decisions (from chat): players reach the next round via a live "Next Round" button on the game-over card; each round counts as a separate game in stats; GM adds rounds live (round N only appears after round N-1 is finished); no cap on rounds per day.
- DONE: all 5 slices built and verified. Model has `round` (default 1) + unique `{date, round}` index; run `npm run migrate-rounds` on any other environment (it drops the old `date`-only unique index, backfills `round:1`, creates the compound index). `src/lib/rounds.ts` shared active-round logic. Admin POST auto-increments round; admin GET returns `round` + `attemptCount`/`solvedCount` and the admin page polls it every 15s. Play page: board resets on `challengeId` change, "Next Round" button on game-over when `nextRoundAvailable`.
- Streak semantics: only the FIRST round started per day updates `currentStreak` (day-gated on `lastPlayedAt`); every round counts `gamesPlayed` +1, wins +1.
- Known data artifact: two pre-existing challenges both dated 2026-07-20 (round 1) survive because their exact millis differ; should be cleaned up (delete one).
- Repo has NO test runner (no `*.test.*`, no test script). Verification was via curl + manual browser check.
- Pre-existing lint: `react-hooks/set-state-in-effect` fires on the polling `useEffect` in play + admin pages (fetch called synchronously); matches the pattern in the user's earlier commits.