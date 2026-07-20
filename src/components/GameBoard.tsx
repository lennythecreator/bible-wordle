"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { GuessResult } from "@/lib/gameLogic";

interface GameBoardProps {
  guesses: { guess: string; result: GuessResult[] }[];
  currentGuess: string;
  wordLength: number;
  maxAttempts: number;
  gameOver: boolean;
  isRevealing: boolean;
  won: boolean;
}

interface BoardMetrics {
  tileSize: number;
  boardWidth: number;
  boardHeight: number;
  gap: number;
}

function getBoardMetrics(wordLength: number, maxAttempts: number): BoardMetrics {
  if (typeof window === "undefined") {
    return {
      tileSize: 56,
      boardWidth: 56 * wordLength + 8 * (wordLength - 1),
      boardHeight: 56 * maxAttempts + 8 * (maxAttempts - 1),
      gap: 8,
    };
  }

  const isMobile = window.innerWidth < 768;
  const horizontalPadding = isMobile ? 24 : 40;
  const verticalPadding = isMobile ? 250 : 220;
  const availableWidth = Math.max(220, window.innerWidth - horizontalPadding);
  const availableHeight = Math.max(220, window.innerHeight - verticalPadding);
  const gap = isMobile ? 6 : 8;

  const maxTileWidth = (availableWidth - gap * (wordLength - 1)) / wordLength;
  const maxTileHeight = (availableHeight - gap * (maxAttempts - 1)) / maxAttempts;
  const tileSize = Math.floor(Math.max(34, Math.min(maxTileWidth, maxTileHeight)));

  return {
    tileSize: Math.min(tileSize, 70),
    boardWidth: tileSize * wordLength + gap * (wordLength - 1),
    boardHeight: tileSize * maxAttempts + gap * (maxAttempts - 1),
    gap,
  };
}

export function GameBoard({
  guesses,
  currentGuess,
  wordLength,
  maxAttempts,
  gameOver,
  isRevealing,
  won,
}: GameBoardProps) {
  const [boardMetrics, setBoardMetrics] = useState<BoardMetrics>(() =>
    getBoardMetrics(wordLength, maxAttempts)
  );

  useEffect(() => {
    const handleResize = () => {
      setBoardMetrics(getBoardMetrics(wordLength, maxAttempts));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [wordLength, maxAttempts]);

  const getTileClasses = (result?: GuessResult) => {
    if (!result || result.length === 0) {
      return "tile-empty";
    }

    const baseClasses =
      "border-2 rounded-lg md:rounded-xl font-tile leading-none font-bold";

    if (result === "correct") {
      return `${baseClasses} tile-correct`;
    }
    if (result === "wrong") {
      return `${baseClasses} tile-wrong`;
    }
    return `${baseClasses} tile-missing`;
  };

  const getTileAnimation = (
    rowIndex: number,
    colIndex: number,
    guessData?: { guess: string; result: GuessResult[] },
    isCurrentRow?: boolean
  ) => {
    const animations: string[] = [];

    if (guessData) {
      if (isRevealing && rowIndex === guesses.length - 1) {
        animations.push("tile-flip");
      }

      if (won && rowIndex === guesses.length - 1) {
        animations.push("bounce");
      }
    }

    if (isCurrentRow && currentGuess) {
      animations.push("tile-pop");
    }

    return animations.join(" ");
  };

  const getTileStyle = (
    rowIndex: number,
    colIndex: number,
    guessData?: { guess: string; result: GuessResult[] }
  ): CSSProperties => {
    if (guessData && isRevealing && rowIndex === guesses.length - 1) {
      return { animationDelay: `${colIndex * 250}ms` };
    }

    if (won && rowIndex === guesses.length - 1 && guessData) {
      return {
        animationDelay: `${(guesses.length - 1) * 500 + colIndex * 100}ms`,
      };
    }

    return {};
  };

  const tileSize = boardMetrics.tileSize;
  const tileFontSize = Math.max(16, Math.min(34, Math.floor(tileSize * 0.6)));

  return (
    <div className="w-full flex justify-center">
      <div
        className="grid w-full"
        style={{
          gridTemplateRows: `repeat(${maxAttempts}, 1fr)`,
          width: `${boardMetrics.boardWidth}px`,
          maxWidth: "100%",
          height: `${boardMetrics.boardHeight}px`,
          gap: `${boardMetrics.gap}px`,
        }}
      >
        {Array.from({ length: maxAttempts }, (_, rowIndex) => {
          const guessData = guesses[rowIndex];
          const isCurrentRow = rowIndex === guesses.length && !gameOver;

          return (
            <div
              key={rowIndex}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${wordLength}, 1fr)`,
                gap: `${boardMetrics.gap}px`,
                width: "100%",
              }}
            >
              {Array.from({ length: wordLength }, (_, colIndex) => {
                const letter =
                  guessData?.guess[colIndex] ||
                  (isCurrentRow ? currentGuess[colIndex] : "") ||
                  "";
                const result = guessData?.result[colIndex];
                const isFilled = !!letter;

                const animationClass = getTileAnimation(
                  rowIndex,
                  colIndex,
                  guessData,
                  isCurrentRow
                );
                const animationStyle = getTileStyle(rowIndex, colIndex, guessData);

                return (
                  <div
                    key={colIndex}
                    className={`flex items-center justify-center rounded-lg md:rounded-xl text-on-surface ${getTileClasses(
                      result
                    )} ${isCurrentRow && isFilled ? "tile-active" : ""} ${
                      animationClass
                    }`}
                    style={{
                      width: `${tileSize}px`,
                      height: `${tileSize}px`,
                      maxWidth: "100%",
                      fontSize: `${tileFontSize}px`,
                      lineHeight: 1,
                      ...animationStyle,
                    }}
                  >
                    <span className="font-tile">{letter}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
