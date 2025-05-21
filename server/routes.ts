import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTriviaQuestions } from "./openai";
import { randomUUID } from "crypto";
import { triviaQuestion, triviaGameState } from "@shared/schema";
import { z } from "zod";

// Store active games in memory
const activeGames = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // Start a new trivia game
  app.post("/api/trivia/start", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        difficulty: z.enum(["easy", "medium", "hard"]),
        category: z.enum(["cats", "mixed"]),
        questionsCount: z.number().min(1).max(20).default(10),
      });
      
      const validatedBody = schema.parse(req.body);
      
      // Generate questions using OpenAI
      const questionData = await generateTriviaQuestions(
        validatedBody.difficulty,
        validatedBody.category,
        validatedBody.questionsCount
      );
      
      // Validate the generated questions
      const questions = z.array(triviaQuestion).parse(questionData.questions);
      
      // Create a unique game ID
      const gameId = randomUUID();
      
      // Store game state
      const gameState = {
        score: 0,
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        difficulty: validatedBody.difficulty,
        category: validatedBody.category,
        questions,
        gameId,
      };
      
      activeGames.set(gameId, gameState);
      
      // Return the game ID and questions to the client
      res.json({
        gameId,
        questions,
      });
    } catch (error) {
      console.error("Error starting trivia game:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to start trivia game" });
    }
  });
  
  // Get questions for a specific game
  app.get("/api/trivia/questions/:gameId", (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      
      // Check if the game exists
      if (!activeGames.has(gameId)) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const gameState = activeGames.get(gameId);
      
      res.json({
        questions: gameState.questions,
      });
    } catch (error) {
      console.error("Error getting trivia questions:", error);
      res.status(500).json({ message: "Failed to get trivia questions" });
    }
  });
  
  // Submit an answer
  app.post("/api/trivia/answer", (req: Request, res: Response) => {
    try {
      const schema = z.object({
        gameId: z.string(),
        questionIndex: z.number().min(0),
        selectedAnswerIndex: z.number().min(0).max(3),
      });
      
      const { gameId, questionIndex, selectedAnswerIndex } = schema.parse(req.body);
      
      // Check if the game exists
      if (!activeGames.has(gameId)) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const gameState = activeGames.get(gameId);
      
      // Check if the question index is valid
      if (questionIndex >= gameState.questions.length) {
        return res.status(400).json({ message: "Invalid question index" });
      }
      
      const question = gameState.questions[questionIndex];
      const isCorrect = selectedAnswerIndex === question.correctIndex;
      
      // Update the score if the answer is correct
      if (isCorrect) {
        gameState.score += 1;
        activeGames.set(gameId, gameState);
      }
      
      res.json({
        isCorrect,
        correctAnswerIndex: question.correctIndex,
        explanation: question.explanation,
        currentScore: gameState.score,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });
  
  // Move to the next question
  app.post("/api/trivia/next", (req: Request, res: Response) => {
    try {
      const schema = z.object({
        gameId: z.string(),
      });
      
      const { gameId } = schema.parse(req.body);
      
      // Check if the game exists
      if (!activeGames.has(gameId)) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const gameState = activeGames.get(gameId);
      
      // Increment the current question index
      gameState.currentQuestionIndex += 1;
      
      // Check if the game is finished
      const isFinished = gameState.currentQuestionIndex >= gameState.totalQuestions;
      
      // Update the game state
      activeGames.set(gameId, gameState);
      
      res.json({
        currentQuestionIndex: gameState.currentQuestionIndex,
        isFinished,
        currentScore: gameState.score,
      });
    } catch (error) {
      console.error("Error moving to next question:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to move to next question" });
    }
  });
  
  // Stop the game
  app.post("/api/trivia/stop", (req: Request, res: Response) => {
    try {
      const schema = z.object({
        gameId: z.string(),
      });
      
      const { gameId } = schema.parse(req.body);
      
      // Check if the game exists
      if (!activeGames.has(gameId)) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const gameState = activeGames.get(gameId);
      
      // Remove the game from active games
      activeGames.delete(gameId);
      
      res.json({
        finalScore: gameState.score,
        totalQuestions: gameState.totalQuestions,
      });
    } catch (error) {
      console.error("Error stopping game:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to stop game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
