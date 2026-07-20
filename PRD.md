# PRD: Bible Book Wordle (Divine Play)

**Version:** 1.1  
**Last Updated:** July 20, 2026  
**Status:** MVP Complete

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Design System](#2-design-system)
3. [Goals](#3-goals)
4. [User Roles](#4-user-roles)
5. [Core User Flow](#5-core-user-flow)
6. [Authentication](#6-authentication)
7. [Daily Game Experience](#7-daily-game-experience)
8. [Game Rules](#8-game-rules)
9. [Hint System](#9-hint-system)
10. [Admin Dashboard](#10-admin-dashboard)
11. [Word Management](#11-word-management)
12. [User Dashboard](#12-user-dashboard)
13. [Results Screen](#13-results-screen)
14. [Sharing](#14-sharing)
15. [Database Design](#15-database-design)
16. [Technical Requirements](#16-technical-requirements)
17. [API Specification](#17-api-specification)
18. [Project Structure](#18-project-structure)
19. [MVP Scope](#19-mvp-scope)
20. [Future Enhancements](#20-future-enhancements)

---

## 1. Product Overview

### Product Name

**Bible Book Wordle** *(working title)*

### Brand Name

**Divine Play**

### Product Summary

A daily Bible-inspired Wordle game where users guess a hidden Bible book using classic Wordle mechanics. The platform encourages Bible engagement through daily challenges, streaks, hints, and community competition.

The initial version focuses on guessing **Bible books with 4+ letters**.

### Brand Personality

The design system is centered on a **Playful Tactile** aesthetic, drawing inspiration from physical toy blocks and modern educational gamification. The brand personality is optimistic and character-driven, aiming to make biblical exploration feel rewarding and approachable.

### Design Philosophy

**Neomorphism-influenced Tactile** approach. Instead of soft, blurry shadows, it employs high-contrast "3D offsets" (thick bottom borders) to simulate physical depth. Every interaction should feel "squishy" and responsive, evoking the sensation of pressing a physical button or moving a tile on a game board. The UI is spacious and breathable, ensuring the "smiling scroll" mascot and high-impact typography remain the focal points.

---

## 2. Design System

### 2.1 Color Palette

The palette is anchored in a high-saturation, cheerful spectrum that feels "lit from within."

#### Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| surface | #fbf9f4 | Main background, replacing pure white |
| surface-dim | #dbdad5 | Dimmed surfaces |
| surface-bright | #fbf9f4 | Bright surfaces |
| surface-container-lowest | #ffffff | Lowest elevation containers |
| surface-container-low | #f5f3ee | Low elevation containers |
| surface-container | #f0eee9 | Default containers |
| surface-container-high | #eae8e3 | High elevation containers |
| surface-container-highest | #e4e2dd | Highest elevation containers |
| surface-variant | #e4e2dd | Variant surfaces |
| on-surface | #1b1c19 | Text on surfaces |
| on-surface-variant | #3e484f | Secondary text on surfaces |

#### Primary - Heaven Blue

| Token | Hex | Usage |
|-------|-----|-------|
| primary | #006689 | Main branding, progress indicators, primary navigation |
| on-primary | #ffffff | Text on primary |
| primary-container | #3abff8 | Primary containers |
| on-primary-container | #004b66 | Text on primary containers |
| inverse-primary | #78d1ff | Inverse primary |
| primary-fixed | #c3e8ff | Fixed primary |
| primary-fixed-dim | #78d1ff | Dimmed fixed primary |
| on-primary-fixed | #001e2c | Text on fixed primary |
| on-primary-fixed-variant | #004c68 | Variant text on fixed primary |

#### Secondary - Sunshine Yellow

| Token | Hex | Usage |
|-------|-----|-------|
| secondary | #7a5900 | High-action buttons (Submit, Play Again), reward states |
| on-secondary | #ffffff | Text on secondary |
| secondary-container | #febf26 | Secondary containers (buttons) |
| on-secondary-container | #6d4f00 | Text on secondary containers |
| secondary-fixed | #ffdea2 | Fixed secondary |
| secondary-fixed-dim | #fabc22 | Dimmed fixed secondary |
| on-secondary-fixed | #261900 | Text on fixed secondary |
| on-secondary-fixed-variant | #5c4200 | Variant text on fixed secondary |

#### Tertiary - Leaf Green

| Token | Hex | Usage |
|-------|-----|-------|
| tertiary | #006c4a | Success states, correct letters |
| on-tertiary | #ffffff | Text on tertiary |
| tertiary-container | #27ca91 | Tertiary containers (correct tiles) |
| on-tertiary-container | #004f36 | Text on tertiary containers |
| tertiary-fixed | #69fcbe | Fixed tertiary |
| tertiary-fixed-dim | #47dfa4 | Dimmed fixed tertiary |
| on-tertiary-fixed | #002114 | Text on fixed tertiary |
| on-tertiary-fixed-variant | #005137 | Variant text on fixed tertiary |

#### Error - Warm Coral

| Token | Hex | Usage |
|-------|-----|-------|
| error | #ba1a1a | Error states, absent letters |
| on-error | #ffffff | Text on error |
| error-container | #ffdad6 | Error containers |
| on-error-container | #93000a | Text on error containers |

#### Background

| Token | Hex | Usage |
|-------|-----|-------|
| background | #fbf9f4 | Main background |
| on-background | #1b1c19 | Text on background |

#### Outline

| Token | Hex | Usage |
|-------|-----|-------|
| outline | #6e7980 | Borders, outlines |
| outline-variant | #bdc8d0 | Variant borders |

#### Inverse

| Token | Hex | Usage |
|-------|-----|-------|
| inverse-surface | #30312e | Inverse surfaces |
| inverse-on-surface | #f2f1ec | Text on inverse surfaces |

### 2.2 Typography

Font pairing of **Quicksand** and **Nunito Sans**. Both fonts feature rounded terminals that complement the soft geometry of the UI.

#### Font Families

- **Headlines (Quicksand):** Used for game titles, modal headers, and large letter tiles. Bold weight is default for "chunky" feel.
- **Body & Metadata (Nunito Sans):** Used for instructions, scripture verses, settings. Slightly more formal structure ensures readability.

#### Type Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| display | Quicksand | 48px | 700 | 56px | -0.02em |
| headline-lg | Quicksand | 32px | 700 | 40px | - |
| headline-lg-mobile | Quicksand | 28px | 700 | 36px | - |
| tile-text | Quicksand | 36px | 700 | 36px | - |
| body-lg | Nunito Sans | 18px | 600 | 28px | - |
| body-md | Nunito Sans | 16px | 500 | 24px | - |
| label-bold | Quicksand | 14px | 700 | 20px | 0.05em |

### 2.3 Spacing

Base-8 unit system with generous safe areas.

| Token | Value | Usage |
|-------|-------|-------|
| base | 8px | Base spacing unit |
| tile-gap | 12px | Gap between game tiles |
| container-padding | 24px | Minimum horizontal padding |
| section-gap | 40px | Vertical space between sections |
| button-depth | 4px | 3D button depth effect |

### 2.4 Border Radius

Consistently "extra-rounded" for friendliness.

| Token | Value | Usage |
|-------|-------|-------|
| sm | 0.25rem (4px) | Small elements |
| DEFAULT | 0.5rem (8px) | Default radius |
| md | 0.75rem (12px) | Medium elements |
| lg | 1rem (16px) | Large elements |
| xl | 1.5rem (24px) | Tiles, buttons, inputs |
| full | 9999px | Fully rounded |

### 2.5 Elevation & Depth

**Structural Depth** system - no ambient shadows, instead physical offsets.

- **Physical Offset:** Interactive elements feature 4px solid bottom border in darker shade
- **Press Effect:** On interaction, element translates down by border height, border disappears
- **Layering:** Modals/cards use soft shadow (20% opacity primary color)

#### Depth Classes

| Class | Border Color | Usage |
|-------|--------------|-------|
| depth-primary | #004c68 | Primary buttons |
| depth-secondary | #5c4200 | Secondary buttons |
| depth-success | #005137 | Success states |
| depth-warning | #5c4200 | Warning states |
| depth-surface | #bdc8d0 | Default elements |
| depth-error | #8c1616 | Error states |

### 2.6 Component Specifications

#### Buttons

"Chunky blocks" with top surface and 4px bottom shadow.

- **Primary Action:** Sunshine Yellow with 4px Amber bottom border
- **Interaction:** Hover lifts (Y-2px), Click sinks (Y+4px)

#### Game Tiles

Core game elements - rounded-square containers.

| State | Background | Border | Text | 3D Effect |
|-------|------------|--------|------|-----------|
| Default | Cream | 2px light grey-blue | - | None |
| Active/Selected | - | 3px Heaven Blue | - | None |
| Correct (Green) | Leaf Green | 2px Leaf Green | White | depth-success |
| Present (Wrong Spot) | Sunshine Yellow | 2px Sunshine Yellow | Dark grey | depth-warning |
| Absent (Incorrect) | Light grey-wash | 2px Light grey | Dark grey | None |

#### Keyboard Keys

Compact version of button logic.

- **Letter Keys:** White background with depth effect
- **Enter/Delete:** Heaven Blue primary color

#### Mascot Container

"Smiling scroll" appears above grid or in modals.

- **Animation:** Subtle float (3s ease-in-out infinite)
- **Success:** Jump animation
- **Error:** Gentle wobble

#### Modals & Cards

- Full-screen or large-centered
- 32px rounded corners
- Thick 2px border
- Used for daily scripture display after win

---

## 3. Goals

### Primary Goals

- Create a fun daily Bible learning experience
- Encourage youth group engagement through friendly competition
- Allow admins to control daily puzzles and hints
- Track user progress and streaks

### Success Metrics

| Metric | Description |
|--------|-------------|
| Daily Active Users | Number of unique users playing daily |
| Completed Puzzles | Percentage of users who finish a puzzle |
| Streak Retention | Users maintaining 7+ day streaks |
| Average Guesses | Mean attempts per solved puzzle |
| Group Participation | Youth group engagement rate |

---

## 4. User Roles

### Player/User

A participant who plays the daily Bible Wordle.

**Capabilities:**

- Sign up/login
- Play the daily challenge
- Submit guesses
- Receive feedback
- Use hints (if enabled)
- View personal statistics
- Track streaks
- Share results

### Admin

A group leader or authorized manager.

**Capabilities:**

- Create/manage daily puzzles
- Schedule weekly words
- Enable/disable hints
- Manage users
- View engagement analytics

---

## 5. Core User Flow

### First Visit Flow

```
┌─────────────────────────────────────┐
│         Landing Page                │
│    (Divine Play branding)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Create Account / Login         │
│    (Name, Email, Password)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Dashboard                  │
│    (Welcome, Stats, Play Now)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Today's Bible Wordle           │
│    (Game Board + Keyboard)          │
└─────────────────────────────────────┘
```

### Daily Play Flow

```
┌─────────────────────────────────────┐
│          Open App                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Check for Today's Puzzle       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Play Game                   │
│    (Guess letters, get feedback)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      View Results / Share           │
└─────────────────────────────────────┘
```

---

## 6. Authentication

### Implementation

Custom JWT authentication with HTTP-only cookies. No external auth libraries.

**Key Files:**

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | JWT utilities, password hashing, cookie management |
| `src/contexts/AuthContext.tsx` | Client-side auth state and methods |
| `src/middleware.ts` | Route protection |

### User Signup

**Required Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Display name |
| email | string | Yes | Unique, lowercase |
| password | string | Yes | Min 6 characters, bcrypt hashed |
| username | string | No | Unique if provided |

**Process:**

1. Validate input
2. Check for existing email/username
3. Hash password with bcrypt (12 rounds)
4. Create user in MongoDB
5. Generate JWT token
6. Set HTTP-only cookie
7. Return user data

**Future Enhancements:**

- Google Sign-In
- Church/group invite codes

### Login

**Process:**

1. Validate input
2. Find user by email
3. Verify password with bcrypt
4. Generate JWT token (7 day expiry)
5. Set HTTP-only cookie (`auth-token`)
6. Return user data

**JWT Payload:**

```typescript
{
  id: string;        // MongoDB user ID
  email: string;
  name: string;
  username?: string;
  role: "user" | "admin";
}
```

### Logout

**Process:**

1. Clear `auth-token` cookie
2. Return success response
3. Client clears user state

### Route Protection

Middleware protects routes by checking for `auth-token` cookie:

| Route Type | Behavior |
|------------|----------|
| Protected (`/dashboard`, `/play`, `/stats`, `/admin`) | Redirect to `/login` if no token |
| Auth (`/login`, `/signup`) | Redirect to `/dashboard` if token exists |

### Client-Side Auth

The `useAuth()` hook provides:

```typescript
{
  user: User | null;           // Current user or null
  loading: boolean;            // Initial load state
  login: (email, password) => Promise<{ error?: string }>;
  signup: (name, email, password, username?) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

---

## 7. Daily Game Experience

### Daily Challenge Screen

```
┌─────────────────────────────────────────────────┐
│  📜                              ⚙️            │
│         Bible Wordle          Leaderboard Archive│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  2/6        [📜 Mascot]                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │ R │ │ O │ │ M │ │ A │ │ N │  Row 1          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │ R │ │ U │ │ T │ │ H │ │ S │  Row 2          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │   │ │   │ │   │ │   │ │   │  Row 3          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │   │ │   │ │   │ │   │ │   │  Row 4          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │   │ │   │ │   │ │   │ │   │  Row 5          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │
│  │   │ │   │ │   │ │   │ │   │  Row 6          │
│  └───┘ └───┘ └───┘ └───┘ └───┘                 │
│                                                 │
├─────────────────────────────────────────────────┤
│   Q   W   E   R   T   Y   U   I   O   P        │
│     A   S   D   F   G   H   J   K   L          │
│   [ENTER] Z   X   C   V   B   N   M   [⌫]     │
├─────────────────────────────────────────────────┤
│  🏠 Home    🎮 Play    🔥 Streaks              │
└─────────────────────────────────────────────────┘
```

---

## 8. Game Rules

### Word Requirements

**Initial Word Database:**

- Bible books only
- Minimum 4 letters
- No numbered books initially

**Valid Examples:**

| Word | Letters | Testament |
|------|---------|-----------|
| RUTH | 4 | Old Testament |
| EZRA | 4 | Old Testament |
| AMOS | 4 | Old Testament |
| JOEL | 4 | Old Testament |
| ROMANS | 6 | New Testament |
| GENESIS | 7 | Old Testament |

**Invalid Examples:**

| Word | Reason |
|------|--------|
| JOB | Too short (3 letters) |
| 1 SAMUEL | Contains number |
| 2 JOHN | Contains number |

### Guess System

Users have **6 attempts** to guess the correct Bible book.

### Feedback System

Each guess returns feedback for each letter:

#### Correct Letter (Green)

- 🟩 **Color:** Leaf Green (#27ca91)
- **Meaning:** Letter is in the correct position
- **Border:** depth-success (#005137)

#### Incorrect Position (Yellow)

- 🟨 **Color:** Sunshine Yellow (#febf26)
- **Meaning:** Letter exists but in wrong position
- **Border:** depth-warning (#5c4200)

#### Missing Letter (Gray)

- ⬜ **Color:** Surface Variant (#e4e2dd)
- **Meaning:** Letter does not exist in the word
- **Border:** outline-variant (#bdc8d0)

---

## 9. Hint System

### Admin Settings

Admins can toggle hints ON/OFF for each daily challenge.

### Hint Types

| Hint | Type | Example |
|------|------|---------|
| Hint 1 | Category | 📜 Old Testament |
| Hint 2 | Author | ✍️ Written by Paul |
| Hint 3 | Description | A book about God's creation of the world. |

### User Experience

When hints are enabled:

```
┌─────────────────────────────────────┐
│         Need help?                  │
├─────────────────────────────────────┤
│  🔒 Hint 1: Category                │
├─────────────────────────────────────┤
│  🔒 Hint 2: Author                  │
├─────────────────────────────────────┤
│  🔒 Hint 3: Description             │
└─────────────────────────────────────┘
```

Click to unlock reveals the hint with animation.

---

## 10. Admin Dashboard

### Dashboard Overview

```
┌─────────────────────────────────────────────────┐
│  📜 Bible Wordle                Dashboard Admin  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Admin Dashboard                                │
│                                                 │
│  ┌─────────────────────┐ ┌─────────────────────┐│
│  │ Create Daily        │ │ Recent Challenges   ││
│  │ Challenge           │ │                     ││
│  │                     │ │ GENESIS - Jul 20    ││
│  │ Bible Word: [    ]  │ │ ROMANS - Jul 21     ││
│  │ Date: [      ]      │ │ RUTH - Jul 22       ││
│  │ Enable Hints: ☑    │ │ ISAIAH - Jul 23     ││
│  │                     │ │ MATTHEW - Jul 24    ││
│  │ [Create Challenge]  │ │                     ││
│  └─────────────────────┘ └─────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

### Today's Puzzle Stats

| Metric | Value |
|--------|-------|
| Word | Genesis |
| Status | Active |
| Players | 52 |
| Average Attempts | 3.4 |

---

## 11. Word Management

### Create Daily Word

Admin can:

1. Select Bible Book from database
2. Set Date for the challenge
3. Enable/Disable Hints
4. Optionally customize hint text

### Weekly Scheduling

Admin can prepare puzzles ahead of time.

**Example Schedule:**

| Day | Word | Hints |
|-----|------|-------|
| Monday | Genesis | ON |
| Tuesday | Romans | ON |
| Wednesday | Ruth | OFF |
| Thursday | Isaiah | ON |
| Friday | Matthew | ON |

### Calendar View

```
┌─────────────────────────────────────┐
│         July 2026                   │
├─────────────────────────────────────┤
│  20  Genesis                        │
│  21  Romans                         │
│  22  Ruth                           │
│  23  Isaiah                         │
│  24  Matthew                        │
│  25  [Empty]                        │
│  26  [Empty]                        │
└─────────────────────────────────────┘
```

---

## 12. User Dashboard

### Home Screen

```
┌─────────────────────────────────────────────────┐
│  📜 Bible Wordle                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Welcome, Lenny 👋                              │
│                                                 │
│  🔥 12 Day Streak                               │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │  Today's Challenge                          ││
│  │                                             ││
│  │  Ready to test your Bible knowledge?        ││
│  │                                             ││
│  │  [Play Now]                                 ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  Your Stats                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 🎮   │ │ 🏆   │ │ 📊   │ │ 🔥   │          │
│  │  25  │ │  22  │ │ 3.1  │ │  15  │          │
│  │Games │ │ Wins │ │ Avg  │ │Long  │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Stats Displayed

| Stat | Description |
|------|-------------|
| Games Played | Total puzzles attempted |
| Wins | Puzzles solved |
| Average Attempts | Mean guesses per solve |
| Longest Streak | Best consecutive days |
| Current Streak | Active daily streak |

---

## 13. Results Screen

### Win Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🎉 Great Job!                      │
│                                                 │
│         You found: GENESIS                      │
│                                                 │
│  📖 Genesis 1:1                                 │
│  "In the beginning God created..."              │
│                                                 │
│         Solved in 4/6 attempts                  │
│                                                 │
│         🔥 Current Streak: 8                    │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │  📖 Bible Wordle #25                        ││
│  │                                             ││
│  │  🟩⬜🟨⬜                                  ││
│  │  🟩🟩⬜🟨                                  ││
│  │  🟩🟩🟩🟩                                  ││
│  │                                             ││
│  │  Solved 3/6                                 ││
│  │  🔥 10 day streak                           ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  [Share Results]  [Play Again Tomorrow]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Loss Screen

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Game Over!                         │
│                                                 │
│         The word was: GENESIS                   │
│                                                 │
│  📖 Genesis 1:1                                 │
│  "In the beginning God created..."              │
│                                                 │
│         Better luck tomorrow!                   │
│                                                 │
│  [Try Again Tomorrow]                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 14. Sharing

### Share Format

Users can copy results as text. **No spoilers** - only color indicators.

**Example:**

```
📖 Bible Wordle #25

🟩⬜🟨⬜
🟩🟩⬜🟨
🟩🟩🟩🟩

Solved 3/6
🔥 10 day streak
```

### Share Implementation

- Copy to clipboard functionality
- Emoji-based grid representation
- Include day number and streak
- No actual word revealed

---

## 15. Database Design

### Users Collection

```typescript
interface IUser {
  _id: ObjectId;
  name: string;           // Required, trimmed
  email: string;          // Required, unique, lowercase
  password: string;       // Required, hashed with bcrypt
  username?: string;      // Optional, unique if provided
  role: "user" | "admin"; // Default: "user"
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- email (unique)
- username (unique, sparse)

### BibleWords Collection

```typescript
interface IBibleWord {
  _id: ObjectId;
  word: string;           // Required, unique, uppercase, min 4 chars
  description: string;    // Required
  testament: "Old Testament" | "New Testament";
  author?: string;        // Optional
  category: "Law" | "History" | "Wisdom" | "Prophets" | 
            "Gospels" | "Epistles" | "Apocalyptic";
  verse?: string;         // Optional (e.g., "Genesis 1:1")
  verseText?: string;     // Optional (actual verse text)
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- word (unique)

### DailyChallenges Collection

```typescript
interface IDailyChallenge {
  _id: ObjectId;
  word: ObjectId;         // Ref: BibleWord
  date: Date;             // Required, unique
  hintsEnabled: boolean;  // Default: true
  hint1?: string;         // Category hint
  hint2?: string;         // Author hint
  hint3?: string;         // Description hint
  createdBy: ObjectId;    // Ref: User (admin)
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- date (unique)

### Attempts Collection

```typescript
interface IAttempt {
  _id: ObjectId;
  user: ObjectId;         // Ref: User
  challenge: ObjectId;    // Ref: DailyChallenge
  guess: string;          // Required, uppercase
  result: ("correct" | "wrong" | "missing")[];
  attemptNumber: number;  // 1-6
  createdAt: Date;
}
```

**Indexes:**

- user + challenge (compound)

### UserStats Collection

```typescript
interface IUserStats {
  _id: ObjectId;
  user: ObjectId;         // Ref: User, unique
  gamesPlayed: number;    // Default: 0
  wins: number;           // Default: 0
  currentStreak: number;  // Default: 0
  longestStreak: number;  // Default: 0
  lastPlayedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- user (unique)

---

## 16. Technical Requirements

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI library |
| Next.js | 16.x | Framework (App Router) |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | - | API endpoints |
| Custom JWT | - | Authentication (jsonwebtoken) |
| Mongoose | 9.x | MongoDB ODM |
| bcryptjs | 3.x | Password hashing |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | 7.x+ | Primary database |

### Animations

- CSS Keyframes (tile flip, shake, bounce, float)
- Tailwind transitions
- Haptic feedback on mobile (navigator.vibrate)

---

## 17. API Specification

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account and set auth cookie.

**Request:**

```json
{
  "name": "Lenny",
  "email": "lenny@example.com",
  "password": "password123",
  "username": "lenny123"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "abc123",
    "name": "Lenny",
    "email": "lenny@example.com",
    "username": "lenny123",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**

- 400: Missing required fields
- 409: Email/username already exists

#### POST /api/auth/login

Authenticate user and set auth cookie.

**Request:**

```json
{
  "email": "lenny@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "abc123",
    "name": "Lenny",
    "email": "lenny@example.com",
    "username": "lenny123",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:**

- 401: Invalid email or password

#### POST /api/auth/logout

Clear auth cookie.

**Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

#### GET /api/auth/me

Get current authenticated user from cookie.

**Response (200):**

```json
{
  "user": {
    "id": "abc123",
    "name": "Lenny",
    "email": "lenny@example.com",
    "username": "lenny123",
    "role": "user"
  }
}
```

**Errors:**

- 401: Not authenticated

### Challenge Endpoints

#### GET /api/challenge/today

Get today's challenge info.

**Response (200):**

```json
{
  "challengeId": "xyz789",
  "wordLength": 6,
  "hintsEnabled": true,
  "hint1": "New Testament",
  "hint2": "Written by Paul",
  "hint3": "A letter to the Romans",
  "dayNumber": 25
}
```

**Errors:**

- 401: Unauthorized
- 404: No challenge today

### Game Endpoints

#### POST /api/guess

Submit a guess for today's challenge.

**Request:**

```json
{
  "challengeId": "xyz789",
  "guess": "ROMANS"
}
```

**Response (200):**

```json
{
  "attempt": {
    "id": "attempt123",
    "guess": "ROMANS",
    "result": ["correct", "wrong", "wrong", "missing", "wrong", "wrong"],
    "attemptNumber": 1
  },
  "isCorrect": false,
  "attemptsUsed": 1,
  "maxAttempts": 6
}
```

**Errors:**

- 400: Invalid word / All attempts used
- 401: Unauthorized
- 404: Challenge not found

### Stats Endpoints

#### GET /api/stats

Get current user's statistics.

**Response (200):**

```json
{
  "gamesPlayed": 25,
  "wins": 22,
  "currentStreak": 12,
  "longestStreak": 15,
  "averageAttempts": "3.1"
}
```

### Admin Endpoints

#### GET /api/admin/challenge

List recent challenges (admin only).

**Response (200):**

```json
{
  "challenges": [
    {
      "_id": "xyz789",
      "word": { "word": "GENESIS", "category": "Law" },
      "date": "2026-07-20",
      "hintsEnabled": true
    }
  ]
}
```

#### POST /api/admin/challenge

Create a new daily challenge (admin only).

**Request:**

```json
{
  "wordId": "word123",
  "date": "2026-07-25",
  "hintsEnabled": true,
  "hint1": "Old Testament",
  "hint2": "Moses",
  "hint3": "The book of beginnings"
}
```

**Response (201):**

```json
{
  "message": "Challenge created successfully",
  "challenge": { ... }
}
```

#### GET /api/admin/words

List all Bible words in database (admin only).

**Response (200):**

```json
{
  "words": [
    { "_id": "word123", "word": "GENESIS", "category": "Law", "testament": "Old Testament" }
  ]
}
```

#### POST /api/admin/words

Add a new Bible word to database (admin only).

**Request:**

```json
{
  "word": "GENESIS",
  "description": "The book of creation",
  "testament": "Old Testament",
  "author": "Moses",
  "category": "Law",
  "verse": "Genesis 1:1",
  "verseText": "In the beginning God created the heavens and the earth."
}
```

#### GET /api/admin/calendar

Get challenges for a specific month (admin only).

**Query Params:**

- month: 1-12
- year: e.g., 2026

**Response (200):**

```json
{
  "challenges": [...],
  "month": 7,
  "year": 2026
}
```

---

## 18. Project Structure

```
bible-wordle/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts           # User login
│   │   │   │   ├── logout/route.ts          # User logout
│   │   │   │   ├── me/route.ts              # Get current user
│   │   │   │   └── signup/route.ts          # User registration
│   │   │   ├── challenge/
│   │   │   │   └── today/route.ts          # Get today's puzzle
│   │   │   ├── guess/route.ts              # Submit guess
│   │   │   ├── stats/route.ts              # User statistics
│   │   │   └── admin/
│   │   │       ├── challenge/route.ts      # Manage challenges
│   │   │       ├── calendar/route.ts       # Calendar view
│   │   │       └── words/route.ts          # Word database
│   │   ├── admin/page.tsx     # Admin dashboard
│   │   ├── dashboard/page.tsx # User dashboard
│   │   ├── login/page.tsx     # Login page
│   │   ├── play/page.tsx      # Main game page
│   │   ├── signup/page.tsx    # Signup page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles + Divine Play tokens
│   ├── components/            # React components
│   │   ├── GameBoard.tsx      # Wordle grid
│   │   ├── GameHeader.tsx     # Game-specific header
│   │   ├── Hints.tsx          # Hint reveal component
│   │   ├── Keyboard.tsx       # On-screen keyboard
│   │   ├── Navigation.tsx     # Navigation components
│   │   ├── Providers.tsx      # Auth provider wrapper
│   │   └── StatsCard.tsx      # Statistics display
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context & hook
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # JWT utilities, password hashing
│   │   ├── gameLogic.ts       # Game evaluation logic
│   │   └── mongodb.ts         # Database connection
│   ├── middleware.ts          # Route protection
│   └── models/                # Mongoose schemas
│       ├── Attempt.ts
│       ├── BibleWord.ts
│       ├── DailyChallenge.ts
│       ├── User.ts
│       ├── UserStats.ts
│       └── index.ts           # Model exports
├── .env.local                 # Environment variables
├── package.json
└── tsconfig.json
```

---

## 19. MVP Scope

### Must Have (v1.0) ✅

| Feature | Status |
|---------|--------|
| User signup/login | ✅ Complete |
| Daily Bible Wordle | ✅ Complete |
| Word validation | ✅ Complete |
| Guess evaluation | ✅ Complete |
| Admin word scheduling | ✅ Complete |
| Weekly puzzle setup | ✅ Complete |
| Hint toggle | ✅ Complete |
| User streak tracking | ✅ Complete |
| Divine Play design system | ✅ Complete |
| Mobile-responsive layout | ✅ Complete |
| Tactile 3D button effects | ✅ Complete |
| Game tile animations | ✅ Complete |
| Bottom mobile navigation | ✅ Complete |

### Nice To Have (v2.0+)

| Feature | Priority |
|---------|----------|
| Leaderboards | High |
| Church group competitions | High |
| Results sharing (copy to clipboard) | High |
| Bible reading plans | Medium |
| Achievements/badges | Medium |
| Push notifications | Medium |
| Social sharing cards (OG images) | Low |
| Mascot reactions/animations | Low |
| Multiplayer mode | Low |
| Google Sign-In | Medium |
| Sound effects | Low |

---

## 20. Future Enhancements

### Phase 2 Features

1. **Leaderboards**
   - Daily/weekly/monthly rankings
   - Youth group specific leaderboards
   - Global rankings

2. **Social Features**
   - Share results with friends
   - Challenge friends to beat your streak
   - Group competitions

3. **Content Expansion**
   - Include numbered books (1 Samuel, 2 John)
   - Add verse of the day
   - Bible reading plans

### Phase 3 Features

1. **Gamification**
   - Achievement system
   - Badges for milestones
   - Experience points

2. **Multiplayer**
   - Real-time competitions
   - Team modes
   - Tournament brackets

3. **Advanced Analytics**
   - Admin analytics dashboard
   - User engagement metrics
   - A/B testing framework

---

## Appendix

### Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/bible-wordle

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing the MVP

1. Start MongoDB locally
2. Run `npm run dev`
3. Navigate to `http://localhost:3000`
4. Create an account
5. Play the daily challenge
6. Access admin at `/admin` (requires admin role)

---

**Product Vision:** *Bible Book Wordle turns Bible learning into a daily habit by combining the addictive simplicity of Wordle with the motivation and joy of Duolingo, wrapped in the playful tactile Divine Play design system.*
