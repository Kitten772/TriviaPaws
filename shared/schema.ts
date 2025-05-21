import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trivia game types
export const triviaQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().min(0).max(3),
  explanation: z.string(),
  category: z.string(),
  image: z.string().optional(),
});

export type TriviaQuestion = z.infer<typeof triviaQuestion>;

export const triviaQuestionResponse = z.object({
  questions: z.array(triviaQuestion),
});

export type TriviaQuestionResponse = z.infer<typeof triviaQuestionResponse>;

export const triviaGameState = z.object({
  score: z.number(),
  currentQuestionIndex: z.number(),
  totalQuestions: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.enum(["cats", "mixed"]),
  gameId: z.string(),
});

export type TriviaGameState = z.infer<typeof triviaGameState>;
