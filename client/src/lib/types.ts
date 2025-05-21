import { TriviaQuestion } from "@shared/schema";

export type GameState = "welcome" | "question" | "finished";

export type Difficulty = "easy" | "medium" | "hard";

export type Category = "cats" | "mixed";

export interface TriviaState {
  gameState: GameState;
  questions: TriviaQuestion[];
  currentQuestion: TriviaQuestion | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  loading: boolean;
  hasAnswered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timer: number;
  timerInterval: NodeJS.Timeout | null;
  timerEnabled: boolean;
  difficulty: Difficulty;
  category: Category;
  gameId: string | null;
}
