# Product: Multi-round challenges

## Problem
As a game master I can only publish one puzzle per day. Once my players finish it,
they're stuck waiting for tomorrow, and if I set another challenge for the same day
it replaces the one they already played — breaking their results. I want to run a
second round on the same day, cleanly, as a fresh game.

## Success metric
GM can publish 2+ rounds for the same calendar day, and players who finish round 1
can start round 2 in the same play session. Measured by: % of players who finish
round 1 and start round 2 (new stat derived from attempts), and # of days where 2+
rounds were published (admin log).

## Announcement — the blog post before the feature
Same-day replays are here! Your game master can now publish multiple rounds for a
single day. Finish today's puzzle and hit "Next Round" to keep playing — every round
is a fresh game and counts toward your stats. New rounds unlock live throughout the
day, so check back whenever you finish one.

## Screens
- `mockups/play-next-round.html` — game-over card with a "Next Round" button when a round 2 is already published
- `mockups/play-no-next-round.html` — game-over card with "Check back later" when no next round exists yet
- `mockups/play-round-two.html` — the board during round 2, showing "Round 2 of 2"
- `mockups/admin-publish-round-two.html` — admin panel with "Publish next round" instead of "overwrite" flow

## Admin: real-time responsiveness
The admin screen updates live, no page reload needed:
- Round list for today/tomorrow refreshes automatically in the background (same polling pattern the play page already uses).
- When the GM publishes a round, the round pills and today's activity update immediately.
- "Live" indicators: one-way challenge list refresh (small polling) instead of manual reload.
