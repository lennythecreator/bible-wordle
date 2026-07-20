"use client";

import { GuessResult } from "@/lib/gameLogic";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStatuses: Record<string, GuessResult>;
  disabled: boolean;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

export function Keyboard({
  onKeyPress,
  onDelete,
  onEnter,
  letterStatuses,
  disabled,
}: KeyboardProps) {
  const getKeyStyle = (key: string) => {
    if (key === "ENTER" || key === "DELETE") {
      return "key key-action tile-press flex-[1.5]";
    }

    const status = letterStatuses[key];
    if (status === "correct") {
      return "key tile-press tile-correct flex-1";
    }
    if (status === "wrong") {
      return "key tile-press tile-wrong flex-1";
    }
    if (status === "missing") {
      return "key tile-press tile-missing flex-1";
    }

    return "key key-default tile-press flex-1";
  };

  const handleKeyPress = (key: string) => {
    if (disabled) return;

    if (key === "ENTER") {
      onEnter();
    } else if (key === "DELETE") {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[6px] md:gap-2 px-1">
      {ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-[4px] md:gap-[6px] w-full"
          style={{
            paddingLeft: rowIndex === 1 ? '12px' : '0',
            paddingRight: rowIndex === 1 ? '12px' : '0'
          }}
        >
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`${getKeyStyle(key)} ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } min-h-[46px] md:h-14`}
              aria-label={key === "DELETE" ? "Backspace" : key}
            >
              {key === "DELETE" ? (
                <span className="material-symbols-outlined text-xl md:text-2xl">backspace</span>
              ) : (
                <span className="text-sm md:text-base">{key}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
