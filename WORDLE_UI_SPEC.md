# Wordle UI Logic Specification

**Purpose:** Reference spec for implementing correct Wordle guess/feedback UI behavior.
**Source:** Official NYT Wordle mechanics + verified open-source implementations.

---

## 1. Grid Layout

- **Grid:** 6 rows × 5 columns (6 guesses, 5-letter words)
- Each row represents one guess attempt
- Each cell holds exactly one letter
- Empty cells are blank until filled by user input
- Active row: the row currently being typed into

---

## 2. Input Handling

### Physical Keyboard
- Listen for `keydown` on `window`
- Only accept `a-z` (case-insensitive, store uppercase)
- `Enter` → submit guess
- `Backspace` → delete last letter from current guess
- Ignore all other keys (Shift, Tab, arrows, numbers, etc.)

### On-Screen Keyboard
- Same three actions: `addLetter`, `deleteLetter`, `submitGuess`
- Shares the same handler functions as physical keyboard

### Letter Insertion
- Max 5 letters per guess
- Letters fill left-to-right in the active row
- Typing after 5 letters is ignored (no-op)

---

## 3. Guess Submission Validation

Before evaluation, check:

1. **Length check:** Guess must be exactly 5 letters. If not → show "Not enough letters" toast/alert, shake row.
2. **Valid word check:** Guess must be in the accepted word list. If not → show "Word not in list" toast/alert, shake row.
3. **Duplicate check (optional, for hard mode):** If hard mode is enabled, the guess must use all previously revealed green/yellow hints. If not → show "Must use revealed hints" toast/alert, shake row.

If validation fails, the guess is NOT submitted. The row remains editable.

---

## 4. Two-Pass Guess Evaluation Algorithm

This is the core logic. A single-pass approach **will produce wrong results** for duplicate letters.

### Algorithm

```
function evaluateGuess(guess: string, target: string): TileState[]
  result = array of 5 × 'absent'
  targetPool = target.split('')
  guessLetters = guess.split('')

  // PASS 1: Mark greens (exact position matches), consume letters
  for i = 0 to 4:
    if guessLetters[i] == targetPool[i]:
      result[i] = 'correct'       // green
      targetPool[i] = ''           // consumed
      guessLetters[i] = ''         // consumed

  // PASS 2: Mark yellows (present but wrong position)
  for i = 0 to 4:
    if guessLetters[i] == '' → skip (already consumed)
    idx = targetPool.indexOf(guessLetters[i])
    if idx ≠ -1:
      result[i] = 'present'       // yellow
      targetPool[idx] = ''         // consumed

  return result
```

### Tile States

| State | Color | Meaning |
|-------|-------|---------|
| `correct` | Green | Letter is in the word AND in the correct position |
| `present` | Yellow | Letter is in the word but in the WRONG position |
| `absent` | Gray | Letter is NOT in the word at all |

### Critical Edge Cases for Duplicates

| Target | Guess | Correct Output | Why |
|--------|-------|----------------|-----|
| CRANE | ARRAY | G-Y-G-G-G | A at pos 2 is green. R at pos 0 is yellow. Second A at pos 4 → CRANE only has one A (used by green) → gray. |
| CLOSE | LEAVE | G-G-A-Y-G | E at pos 3 is green. First E at pos 0 → only one E in CLOSE, already used → gray. |
| APPLE | KAYAK | A-A-G-G-A | A at pos 3 is green. First A at pos 0 → only one A in APPLE, already used → gray. |
| EERIE | SERVE | A-Y-Y-G-A | Both E's in EERIE are consumed by green matches. First E in SERVE has no remaining E → gray. |
| ROBOT | HOMER | A-A-Y-G-A | Both O's in ROBOT consumed. HOMER has only one O → yellow for the first O, gray for the second. |

---

## 5. Tile Reveal Animation

### Staggered Flip

After submission, tiles reveal left-to-right with a staggered delay:

- **Animation:** CSS flip (rotateX 0→90→0 or scaleY 1→0→1)
- **Duration per tile:** ~500ms
- **Delay between tiles:** ~250ms (index × 250ms)
- **Total reveal time:** ~1500ms for 5 tiles
- **Fill mode:** `forwards` (color persists after animation)

### Animation Sequence Per Tile

```
0ms:    Tile starts flipping (scaleY shrinks)
250ms:  Midpoint — tile is flat, color changes here
500ms:  Tile finishes flipping (scaleY restored), new color visible
```

### Color Application Timing
- Background color changes at the **50% mark** of the flip animation
- This creates the illusion of the tile "flipping over" to reveal the color

---

## 6. Keyboard Color Updates

### Priority System

The on-screen keyboard tracks the **best known state** for each letter across ALL committed guesses:

| Priority | State | Beats |
|----------|-------|-------|
| 3 | `correct` (green) | Highest — once green, always green |
| 2 | `present` (yellow) | Beats absent |
| 1 | `absent` (gray) | Lowest |
| 0 | `empty` | Not yet used |

### Update Rule

```
For each committed guess:
  For each letter in the guess:
    evaluation = result for that letter
    if keyStates[letter] doesn't exist OR priority[evaluation] > priority[keyStates[letter]]:
      keyStates[letter] = evaluation
```

### Timing
- Keyboard colors update **simultaneously** with tile flip animations (not staggered)
- Or optionally, update keyboard after all tile flips complete

---

## 7. Input Blocking During Evaluation

While the tile flip animation is playing (~1500ms):

- **Disable all input** (physical keyboard + on-screen keyboard)
- **Do not allow** new letters, deletions, or submissions
- After animation completes, re-enable input

---

## 8. Invalid Input Feedback

### Not Enough Letters
- **Trigger:** Enter pressed with < 5 letters
- **Effect:** Row shakes horizontally (CSS `shake` animation)
- **Duration:** ~500ms
- **Toast/Alert:** "Not enough letters!"

### Word Not in List
- **Trigger:** Enter pressed with valid length but word not in dictionary
- **Effect:** Row shakes horizontally
- **Duration:** ~500ms
- **Toast/Alert:** "Word not in list!"

### Shake Animation
```
@keyframes shake {
  0%   { transform: translateX(-5px) }
  25%  { transform: translateX(4px) }
  50%  { transform: translateX(-3px) }
  75%  { transform: translateX(2px) }
  100% { transform: translateX(0) }
}
```

---

## 9. Letter Pop Animation (Typing)

When a letter is typed into a cell:

- **Animation:** Quick scale bounce (scale 1 → 1.1 → 1)
- **Duration:** ~100ms
- **Trigger:** On `addLetter` only

```
@keyframes pop {
  0%   { transform: scale(1.1) }
  100% { transform: scale(1) }
}
```

---

## 10. Win Condition

### Detection
- After evaluation, check if ALL 5 tiles are `correct` (green)
- Or: check if `guessString === targetString`

### Win Effects
1. **Tile celebration:** All tiles in the winning row do a bounce/jump animation (staggered, ~100ms apart)
2. **Keyboard:** All keys remain colored
3. **Game state:** Set to `won`
4. **Input:** Disabled
5. **Modal/Banner:** Show win message with stats
6. **Streak:** Incremented
7. **Share grid:** Generated for clipboard copy

---

## 11. Lose Condition

### Detection
- All 6 guesses used AND none matched the target

### Lose Effects
1. **Reveal answer:** All tiles in the last row or a modal shows the target word
2. **Game state:** Set to `lost`
3. **Input:** Disabled
4. **Modal/Banner:** Show loss message with the answer
5. **Streak:** Reset to 0

---

## 12. Hard Mode Rules

When enabled (toggle in settings):

- After a guess reveals green/yellow tiles, ALL subsequent guesses MUST:
  - Use green letters in their confirmed positions
  - Include yellow letters somewhere in the guess
- If a guess violates these rules → reject with shake + toast
- Green letters must be in the exact position (not just present)
- Yellow letters must appear at least once (any position)

---

## 13. Game State Shape

```typescript
type TileState = 'correct' | 'present' | 'absent' | 'empty' | 'active';

interface GameState {
  targetWord: string;                    // The answer
  guesses: string[];                     // Committed guesses (max 6)
  evaluations: TileState[][];            // Evaluation results per guess
  currentGuess: string;                  // Current in-progress typing
  status: 'playing' | 'won' | 'lost';
  attemptsUsed: number;                  // 0-6
  maxAttempts: number;                   // 6
  isRevealing: boolean;                  // True during flip animation
  hardMode: boolean;                     // Toggle
}
```

---

## 14. Sharing Format

After game ends, generate a shareable grid:

```
📖 Bible Wordle #25

🟩⬜🟨⬜
🟩🟩⬜🟨
🟩🟩🟩🟩

Solved 3/6
🔥 10 day streak
```

- Each row = one guess
- 🟩 = correct, 🟨 = present, ⬜ = absent (or ⬛ for dark mode)
- No actual word letters revealed
- Include day number and streak

---

## 15. Summary of All Animations

| Animation | Trigger | Duration | Delay |
|-----------|---------|----------|-------|
| Pop | Letter typed | 100ms | 0ms |
| Flip (tile reveal) | Guess submitted | 500ms | 250ms × index |
| Shake | Invalid input | 500ms | 0ms |
| Bounce (win) | All green | 500ms | 100ms × index |
| Float (mascot) | Idle | 3s infinite | 0ms |

---

## 16. Bible Wordle Adaptation Notes

For the Bible Book Wordle variant:

- Word length varies (4-7 letters for Bible books)
- Grid should be **dynamic** based on word length
- Evaluation algorithm remains identical (two-pass)
- Valid word list = curated Bible book names only
- No standard 5-letter dictionary — use custom word list
- Consider: books with spaces (e.g., "1 SAMUEL") → decide on normalization (strip numbers, ignore spaces)
- Recommendation: Use uppercase, no spaces, no numbers for internal representation
