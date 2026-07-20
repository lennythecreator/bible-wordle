"use client";

import { useState } from "react";

interface HintsProps {
  hint1?: string;
  hint2?: string;
  hint3?: string;
}

export function Hints({ hint1, hint2, hint3 }: HintsProps) {
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);

  const hints = [
    { number: 1, label: "Category", content: hint1, icon: "📜" },
    { number: 2, label: "Author", content: hint2, icon: "✍️" },
    { number: 3, label: "Description", content: hint3, icon: "💡" },
  ];

  const unlockHint = (hintNumber: number) => {
    if (!unlockedHints.includes(hintNumber)) {
      setUnlockedHints([...unlockedHints, hintNumber]);
    }
  };

  return (
    <div className="w-full">
      <h3 className="font-display text-headline-lg-mobile text-on-surface mb-4">
        Need help?
      </h3>
      <div className="space-y-3">
        {hints.map((hint) => (
          <div key={hint.number}>
            {unlockedHints.includes(hint.number) ? (
              <div className="hint-unlocked">
                <p className="text-body text-on-primary-fixed">
                  <span className="font-bold">{hint.icon} Hint {hint.number}:</span>{" "}
                  {hint.content}
                </p>
              </div>
            ) : (
              <button
                onClick={() => unlockHint(hint.number)}
                className="tile-press hint-locked"
              >
                <span className="text-body text-on-surface-variant">
                  🔒 Hint {hint.number}: {hint.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
