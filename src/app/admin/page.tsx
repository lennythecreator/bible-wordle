"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addUtcDays, toDateKey } from "@/lib/dates";

interface BibleWord {
  _id: string;
  word: string;
  category: string;
  testament: string;
  author?: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  username?: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  gamesPlayed: number;
}

interface TodayRound {
  _id: string;
  round: number;
  date: string;
  word?: { _id: string; word: string; category: string };
  attemptCount: number;
  solvedCount: number;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [words, setWords] = useState<BibleWord[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [reflectionQuestion, setReflectionQuestion] = useState(
    "How does this word remind you of God\u2019s faithfulness in your life today?"
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<{
    word: string;
    date: string;
  } | null>(null);
  const [todayRounds, setTodayRounds] = useState<TodayRound[]>([]);
  const [editingRound, setEditingRound] = useState<{
    date: string;
    round: number;
  } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [pendingOverwrite, setPendingOverwrite] = useState<{
    wordId: string;
    date: string;
    hintsEnabled: boolean;
    hint1: string;
    hint2?: string;
    hint3?: string;
    reflectionQuestion: string;
  } | null>(null);

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayTags = searchQuery
    ? filteredWords.slice(0, 8)
    : words.slice(0, 8);

  const selectedWordData = words.find((w) => w._id === selectedWord);
  const previewWord = selectedWordData?.word || activeChallenge?.word || "BEGIN";
  const previewLetters = previewWord.split("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const fetchChallenges = useCallback(async () => {
      const challengesRes = await fetch("/api/admin/challenge");

      if (!challengesRes.ok) {
        return;
      }

      const challengesData = await challengesRes.json();
      const today = toDateKey(new Date());
      const todayChallenges = (challengesData.challenges || [])
        .filter((c: { date: string }) => c.date.split("T")[0] === today)
        .sort((a: { round: number }, b: { round: number }) => a.round - b.round);

      setTodayRounds(todayChallenges as TodayRound[]);

      const latest = todayChallenges[todayChallenges.length - 1];
      if (latest?.word?.word) {
        setActiveChallenge({
          word: latest.word.word,
          date: latest.date,
        });
      }
    }, []);

  const fetchData = useCallback(async () => {
    try {
      const [wordsRes, usersRes] = await Promise.all([
        fetch("/api/admin/words"),
        fetch("/api/admin/users"),
      ]);

      if (wordsRes.ok) {
        const wordsData = await wordsRes.json();
        setWords(wordsData.words || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      await fetchChallenges();
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchChallenges]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }

    fetchData();

    const intervalId = window.setInterval(() => {
      fetchChallenges();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user, fetchData, fetchChallenges]);

  const handleCreateChallenge = async (
    overwrite = false,
    publishToday = false,
    dateStr?: string,
    round?: number
  ) => {
    if (!selectedWord) {
      setMessage("Please select a Bible word");
      return;
    }
    setMessage("");

    const dayOffset = publishToday ? 0 : 1;
    const resolvedDate = dateStr ?? toDateKey(addUtcDays(new Date(), dayOffset));

    const payload = {
      wordId: selectedWord,
      date: resolvedDate,
      round,
      hintsEnabled: true,
      hint1: `Category: ${selectedWordData?.category || "Unknown"}`,
      hint2: selectedWordData?.author
        ? `Written by ${selectedWordData.author}`
        : undefined,
      hint3: selectedWordData?.category || undefined,
      reflectionQuestion,
      overwrite,
    };

    try {
      const response = await fetch("/api/admin/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 409 && !overwrite) {
        setPendingOverwrite(payload);
        setMessage(
          `A challenge already exists for ${publishToday ? "today" : "tomorrow"}. Replace it?`
        );
        return;
      }

      if (!response.ok) {
        setMessage(data.error || "Failed to create challenge");
      } else {
        setMessage(
          editingRound
            ? `Round ${editingRound.round} updated successfully!`
            : "Challenge published successfully!"
        );
        setSelectedWord("");
        setPendingOverwrite(null);
        setEditingRound(null);
        await fetchChallenges();
      }
    } catch {
      setMessage("Failed to create challenge");
    } finally {
      setPublishing(false);
    }
  };

  const confirmOverwrite = () => {
    if (pendingOverwrite) {
      handleCreateChallenge(true, false, pendingOverwrite.date);
    }
  };

  const cancelOverwrite = () => {
    setPendingOverwrite(null);
    setMessage("");
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setMessage("");

    const today = toDateKey(new Date());

    try {
      const response = await fetch("/api/admin/challenge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, reflectionQuestion }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "No challenge published yet. Your question will be saved when you publish."
        );
      } else {
        setMessage("Changes saved!");
      }
    } catch {
      setMessage("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishLive = async () => {
    setPublishing(true);
    if (editingRound) {
      await handleCreateChallenge(true, true, editingRound.date, editingRound.round);
    } else {
      await handleCreateChallenge(false, true);
    }
    setPublishing(false);
  };

  const handlePublishTomorrow = async () => {
    setPublishing(true);
    await handleCreateChallenge(false, false);
    setPublishing(false);
  };

  const handleEditRound = (round: TodayRound) => {
    setEditingRound({ date: toDateKey(new Date(round.date)), round: round.round });
    setSelectedWord(round.word?._id ?? "");
    setMessage(`Editing Round ${round.round} — pick a new word and save`);
  };

  const cancelEditRound = () => {
    setEditingRound(null);
    setSelectedWord("");
    setMessage("");
  };

  const handleDeleteRound = async (round: TodayRound) => {
    if (round.attemptCount > 0) {
      const ok = window.confirm(
        `Round ${round.round} (${round.word?.word}) already has ${round.attemptCount} attempt(s) by players. Delete it anyway?`
      );
      if (!ok) {
        return;
      }
    } else if (
      !window.confirm(
        `Delete Round ${round.round} (${round.word?.word})? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/challenge?challengeId=${round._id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to delete round");
      } else {
        setMessage(`Round ${round.round} deleted`);
        if (editingRound?.round === round.round) {
          setEditingRound(null);
          setSelectedWord("");
        }
        await fetchChallenges();
      }
    } catch {
      setMessage("Failed to delete round");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="page-shell">
        <Navigation showInHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-on-surface-variant text-body">Loading...</div>
        </main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="page-shell">
        <Navigation showInHeader />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-error mb-4 block">
              lock
            </span>
            <h1 className="text-primary text-headline-lg-mobile font-display mb-2">
              Access Denied
            </h1>
            <p className="text-on-surface-variant text-body">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell pb-24 md:pb-8">
      <Navigation showInHeader />

      <main className="page-main">
        {/* Welcome Section */}
        <section className="welcome-banner">
          <div className="icon-circle scrollie-float w-16 h-16 md:w-20 md:h-20">
            <span className="material-symbols-outlined text-on-primary-container text-4xl md:text-6xl">
              menu_book
            </span>
          </div>
          <div className="welcome-banner-text">
            <h2 className="text-primary text-headline-lg-mobile md:text-display font-display">
              Shalom, Guardian!
            </h2>
            <p className="text-on-surface-variant text-body mt-1">
              Manage the word path and keep the community shining. Tomorrow&apos;s
              challenge awaits your wisdom.
            </p>
          </div>
        </section>

        {/* Message Toast */}
        {message && (
          <div
            className={`toast ${
              message.includes("success") || message.includes("saved")
                ? "toast-success"
                : pendingOverwrite
                  ? "toast-warning"
                  : "toast-error"
            }`}
          >
            <p>{message}</p>
            {pendingOverwrite && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={confirmOverwrite}
                  className="flex-1 py-2 px-4 rounded-lg bg-error text-white font-bold text-sm"
                >
                  Replace It
                </button>
                <button
                  onClick={cancelOverwrite}
                  className="flex-1 py-2 px-4 rounded-lg bg-surface-container text-on-surface font-bold text-sm border border-outline-variant"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Bento Grid */}
        <div className="bento-grid">
          {/* Left Column */}
          <div className="bento-col-wide">
            {/* Set Daily Book */}
            <section className="card">
              <div className="section-header">
                <span className="material-symbols-outlined text-primary text-3xl">
                  auto_stories
                </span>
                <h3 className="text-on-surface text-headline-lg-mobile md:text-headline-lg font-display">
                  Set Daily Book
                </h3>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="field-label">
                    PICK TOMORROW&apos;S SOURCE
                  </label>
                  <div className="relative">
                    <input
                      className="input input-search"
                      placeholder="Search Bible Books (e.g., Genesis, Psalms)..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="material-symbols-outlined search-icon">
                      search
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {displayTags.map((word) => (
                    <button
                      key={word._id}
                      onClick={() => {
                        setSelectedWord(word._id);
                        setSearchQuery("");
                      }}
                      className={`tag ${
                        selectedWord === word._id ? "tag-active" : "tag-default"
                      }`}
                    >
                      {word.word}
                    </button>
                  ))}
                  {searchQuery && filteredWords.length === 0 && (
                    <p className="text-on-surface-variant text-body-sm">
                      No books found
                    </p>
                  )}
                </div>
                {selectedWordData && (
                  <div className="card-inset">
                    <p className="text-primary text-label font-bold">
                      Selected: {selectedWordData.word}
                    </p>
                    <p className="text-on-surface-variant text-body-sm mt-1">
                      {selectedWordData.category} &middot;{" "}
                      {selectedWordData.testament}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Community Prompt */}
            <section className="card">
              <div className="section-header">
                <span className="material-symbols-outlined text-primary text-3xl">
                  chat_bubble
                </span>
                <h3 className="text-on-surface text-headline-lg-mobile md:text-headline-lg font-display">
                  Community Prompt
                </h3>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="field-label">
                    DAILY REFLECTION QUESTION
                  </label>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={reflectionQuestion}
                    onChange={(e) => setReflectionQuestion(e.target.value)}
                  />
                </div>
                <div className="info-banner">
                  <div className="info-banner-content">
                    <span className="material-symbols-outlined text-tertiary">
                      verified_user
                    </span>
                    <p className="text-tertiary text-body-sm">
                      Safe for all ages filter is active.
                    </p>
                  </div>
                  <button className="text-label text-tertiary underline uppercase">
                    Settings
                  </button>
                </div>
              </div>
            </section>

            {/* User Management */}
            <section className="card overflow-hidden">
              <div className="section-header-row">
                <div className="section-header">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    group
                  </span>
                  <h3 className="text-on-surface text-headline-lg-mobile md:text-headline-lg font-display">
                    User Management
                  </h3>
                </div>
                {users.length > 5 && (
                  <button
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="text-label text-primary flex items-center gap-1 btn-ghost"
                  >
                    {showAllUsers ? "SHOW LESS" : "VIEW ALL"}
                    <span className="material-symbols-outlined">
                      {showAllUsers ? "expand_less" : "chevron_right"}
                    </span>
                  </button>
                )}
              </div>
              <div className="divider-list">
                {users.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-on-surface-variant text-body">
                      No users found
                    </p>
                  </div>
                ) : (
                  (showAllUsers ? users : users.slice(0, 5)).map((u, idx) => {
                    const initials = u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    const avatarClass =
                      idx % 2 === 0
                        ? "user-avatar-secondary"
                        : "user-avatar-primary";
                    const textClass =
                      idx % 2 === 0
                        ? "text-on-secondary-container"
                        : "text-on-primary-container";
                    return (
                      <div key={u._id} className="user-row">
                        <div className="user-row-info">
                          <div className={`user-avatar ${avatarClass}`}>
                            <span className={`text-label font-bold ${textClass}`}>
                              {initials}
                            </span>
                          </div>
                          <div>
                            <p className="text-body font-bold text-on-surface">
                              {u.username || u.name}
                            </p>
                            <p className="text-label text-on-surface-variant">
                              {u.email}
                            </p>
                            <div className="flex gap-3 mt-1">
                              <span className="text-label text-on-surface-variant">
                                Games: {u.gamesPlayed}
                              </span>
                              <span className="text-label text-on-surface-variant">
                                Streak: {u.currentStreak}
                              </span>
                              <span className="text-label text-on-surface-variant">
                                Best: {u.longestStreak}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-error hover:bg-error-container rounded-xl transition-colors">
                          <span className="material-symbols-outlined">
                            block
                          </span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="bento-col-narrow">
            {/* Today's Rounds */}
            <section className="card">
              <div className="section-header">
                <span className="material-symbols-outlined text-primary text-3xl">
                  repeat
                </span>
                <h3 className="text-on-surface text-headline-lg-mobile md:text-headline-lg font-display">
                  Today&apos;s Rounds
                </h3>
                <span className="text-label text-tertiary uppercase">
                  ● LIVE
                </span>
              </div>
              {todayRounds.length === 0 ? (
                <p className="text-on-surface-variant text-body-sm">
                  No round published for today yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {todayRounds.map((round) => {
                    const isEditing =
                      editingRound?.round === round.round &&
                      editingRound?.date ===
                        toDateKey(new Date(round.date));
                    return (
                      <div
                        key={round._id}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                          isEditing
                            ? "bg-primary/15 border-2 border-primary"
                            : "bg-surface-container"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/15 text-primary text-label font-bold px-2 py-0.5">
                            R{round.round}
                          </span>
                          <span className="text-body font-bold text-on-surface">
                            {round.word?.word ?? "?"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-label text-on-surface-variant">
                            {round.solvedCount}/{round.attemptCount} solved
                          </span>
                          <button
                            onClick={() => handleEditRound(round)}
                            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                            aria-label={`Edit round ${round.round}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteRound(round)}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-xl transition-colors"
                            aria-label={`Delete round ${round.round}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {editingRound && (
                <button
                  onClick={cancelEditRound}
                  className="mt-3 text-label text-on-surface-variant underline uppercase hover:text-error"
                >
                  Cancel edit
                </button>
              )}
            </section>

            {/* Live Preview Card */}
            <section className="card-accent">
              <div className="section-header">
                <span className="material-symbols-outlined text-primary">
                  visibility
                </span>
                <h3 className="text-label text-primary uppercase">
                  Player Preview
                </h3>
              </div>
              <div className="card-inner">
                <div className="text-center mb-8">
                  <h4 className="text-2xl text-primary font-display mb-1">
                    {selectedWordData
                      ? `${previewWord.charAt(0)}${previewWord.slice(1).toLowerCase()} 1:1`
                      : activeChallenge
                        ? `${activeChallenge.word.charAt(0)}${activeChallenge.word.slice(1).toLowerCase()} 1:1`
                        : "No Active Challenge"}
                  </h4>
                  <p className="text-label text-on-surface-variant text-xs">
                    {selectedWordData
                      ? "PREVIEW"
                      : activeChallenge
                        ? "TODAY'S WORD"
                        : "SELECT A WORD TO SET"}
                  </p>
                </div>

                {/* Mini Wordle Grid */}
                <div className="grid gap-2 mb-8" style={{ gridTemplateColumns: `repeat(${previewLetters.length || 5}, 1fr)` }}>
                  {Array.from({ length: previewLetters.length || 5 }).map((_, i) => {
                    const letter = previewLetters[i] || "";
                    const tileColor =
                      i === 0
                        ? "tile-correct"
                        : i === 1
                          ? "tile-wrong"
                          : "tile-missing";
                    return (
                      <div
                        key={i}
                        className={`aspect-square ${tileColor} rounded-xl flex items-center justify-center font-display font-bold text-lg md:text-2xl`}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>

                <div className="w-full text-center p-4 bg-primary/5 rounded-xl border border-dashed border-primary">
                  <p className="text-primary italic text-body-sm">
                    &ldquo;{reflectionQuestion}&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* Global Actions */}
            <div className="sticky-actions">
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="btn-chunky btn-secondary"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                onClick={handlePublishLive}
                disabled={publishing || !selectedWord}
                className="btn-chunky btn-primary"
              >
                {publishing
                  ? "PUBLISHING..."
                  : editingRound
                    ? `SAVE ROUND ${editingRound.round}`
                    : "SET CHALLENGE FOR TODAY"}
              </button>
              <button
                onClick={handlePublishTomorrow}
                disabled={publishing || !selectedWord || editingRound !== null}
                className="btn-chunky btn-secondary"
              >
                {publishing ? "PUBLISHING..." : "SET CHALLENGE FOR TOMORROW"}
              </button>

              {/* System Health */}
              <div className="card">
                <h4 className="text-label text-on-surface-variant mb-4">
                  SYSTEM HEALTH
                </h4>
                <div className="flex flex-col gap-3">
                  <div className="stat-row">
                    <span className="text-body-sm text-on-surface">
                      Daily Reset
                    </span>
                    <span className="text-label text-tertiary">
                      08:42:11
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }} />
                  </div>
                  <div className="stat-row">
                    <span className="text-body-sm text-on-surface">
                      Online Players
                    </span>
                    <span className="text-label text-on-surface">
                      1,204
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
