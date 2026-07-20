export type GuessResult = "correct" | "wrong" | "missing";

export interface EvaluateGuessResponse {
  result: GuessResult[];
  isCorrect: boolean;
}

export function evaluateGuess(guess: string, answer: string): EvaluateGuessResponse {
  const normalizedGuess = guess.toUpperCase();
  const normalizedAnswer = answer.toUpperCase();

  const result: GuessResult[] = [];
  const answerLetters = normalizedAnswer.split("");
  const guessLetters = normalizedGuess.split("");

  const answerLetterCounts: Record<string, number> = {};
  for (const letter of answerLetters) {
    answerLetterCounts[letter] = (answerLetterCounts[letter] || 0) + 1;
  }

  const resultArray: GuessResult[] = new Array(guessLetters.length).fill("missing");

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      resultArray[i] = "correct";
      answerLetterCounts[guessLetters[i]]--;
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (resultArray[i] === "correct") {
      continue;
    }

    if (answerLetterCounts[guessLetters[i]] > 0) {
      resultArray[i] = "wrong";
      answerLetterCounts[guessLetters[i]]--;
    }
  }

  const isCorrect = normalizedGuess === normalizedAnswer;

  return {
    result: resultArray,
    isCorrect,
  };
}

export function isValidWord(word: string): boolean {
  return word.length >= 4 && /^[A-Z]+$/i.test(word);
}

export function getWordLength(word: string): number {
  return word.length;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayDate(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}
