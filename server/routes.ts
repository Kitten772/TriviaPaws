import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTriviaQuestions } from "./openai";
import { randomUUID } from "crypto";
import { triviaQuestion, triviaGameState, triviaQuestions } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { fetchExternalTriviaQuestions } from "./externalTrivia";

// Store active games in memory
const activeGames = new Map();

// Function to shuffle an array randomly (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Hardcoded questions in case the API key doesn't work
const catTriviaQuestions = [
  {
    question: "Which famous internet cat was known for its grumpy facial expression?",
    options: ["Lil Bub", "Grumpy Cat", "Maru", "Keyboard Cat"],
    correctIndex: 1,
    explanation: "Grumpy Cat (real name Tardar Sauce) became famous for her permanently grumpy facial expression caused by feline dwarfism.",
    category: "Famous Cats"
  },
  {
    question: "What is the average lifespan of an indoor cat?",
    options: ["5-8 years", "10-15 years", "15-20 years", "20-25 years"],
    correctIndex: 1,
    explanation: "Indoor cats typically live between 10-15 years, though some may live up to 20 years.",
    category: "Cat Facts"
  },
  {
    question: "Which of these cat breeds is known for having no fur?",
    options: ["Persian", "Maine Coon", "Sphynx", "Siamese"],
    correctIndex: 2,
    explanation: "The Sphynx cat is known for being hairless, although they may have a fine layer of fuzz.",
    category: "Cat Breeds"
  },
  {
    question: "How many toes does a normal cat have on its front paws?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "Most cats have 5 toes on their front paws and 4 on their back paws, for a total of 18.",
    category: "Cat Anatomy"
  },
  {
    question: "What is a group of cats called?",
    options: ["A clowder", "A murder", "A pride", "A pack"],
    correctIndex: 0,
    explanation: "A group of cats is called a clowder, while a group of kittens is called a kindle.",
    category: "Cat Terminology"
  },
  {
    question: "Which part of their body do cats use to help maintain balance?",
    options: ["Whiskers", "Ears", "Tail", "Claws"],
    correctIndex: 2,
    explanation: "Cats use their tails for balance when running or walking on narrow surfaces.",
    category: "Cat Behavior"
  },
  {
    question: "What is the name of the sound cats make when they're happy?",
    options: ["Purr", "Meow", "Hiss", "Chirp"],
    correctIndex: 0,
    explanation: "Cats purr when they're content, though they may also purr when nervous or injured as a self-soothing mechanism.",
    category: "Cat Behavior"
  },
  {
    question: "What was the name of the ancient Egyptian goddess with a cat's head?",
    options: ["Isis", "Bastet", "Hathor", "Sekhmet"],
    correctIndex: 1,
    explanation: "Bastet was a goddess of protection and cats, often depicted with a cat's head on a woman's body.",
    category: "Cats in History"
  },
  {
    question: "What color eyes do all kittens have when they're born?",
    options: ["Yellow", "Green", "Brown", "Blue"],
    correctIndex: 3,
    explanation: "All kittens are born with blue eyes. Their adult eye color develops around 6-7 weeks of age.",
    category: "Cat Facts"
  },
  {
    question: "Which of these is NOT a big cat species?",
    options: ["Lion", "Cheetah", "Jaguar", "Leopard"],
    correctIndex: 1,
    explanation: "Cheetahs are not considered true 'big cats' because they cannot roar. They belong to a different genus.",
    category: "Wild Cats"
  },
  {
    question: "How high can the average house cat jump?",
    options: ["3 feet", "5 feet", "7 feet", "9 feet"],
    correctIndex: 1,
    explanation: "The average cat can jump about 5 times its own height, which is around 5 feet vertically.",
    category: "Cat Abilities"
  }
];

const mixedAnimalTriviaQuestions = [
  {
    question: "Which animal has the longest lifespan?",
    options: ["Elephant", "Tortoise", "Parrot", "Whale"],
    correctIndex: 1,
    explanation: "Some tortoise species can live over 150 years, with the oldest confirmed tortoise living to 188 years.",
    category: "Animal Lifespans"
  },
  {
    question: "Which cat has the loudest roar?",
    options: ["Lion", "Tiger", "Jaguar", "Leopard"],
    correctIndex: 1,
    explanation: "Tigers have the loudest roar among big cats, which can be heard up to 2 miles away.",
    category: "Wild Cats"
  },
  {
    question: "What is a baby rabbit called?",
    options: ["Kit", "Pup", "Cub", "Joey"],
    correctIndex: 0,
    explanation: "A baby rabbit is called a kit or kitten. They're born hairless and with their eyes closed.",
    category: "Animal Babies"
  },
  {
    question: "Which animal has the best sense of smell?",
    options: ["Dog", "Bear", "Shark", "Elephant"],
    correctIndex: 0,
    explanation: "Dogs have up to 300 million olfactory receptors in their noses, compared to about 6 million in humans.",
    category: "Animal Senses"
  },
  {
    question: "Which bird can fly backwards?",
    options: ["Eagle", "Hummingbird", "Penguin", "Ostrich"],
    correctIndex: 1,
    explanation: "Hummingbirds are the only birds that can fly backwards, upside down, and hover in mid-air.",
    category: "Bird Facts"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Gazelle", "Ostrich"],
    correctIndex: 0,
    explanation: "Cheetahs can reach speeds of up to 70 mph (113 km/h) for short bursts.",
    category: "Animal Speed"
  },
  {
    question: "Which domestic cat breed is the largest?",
    options: ["Savannah", "Bengal", "Maine Coon", "Ragdoll"],
    correctIndex: 2,
    explanation: "Maine Coons are one of the largest domestic cat breeds, with males weighing up to 18 pounds or more.",
    category: "Cat Breeds"
  },
  {
    question: "How many hearts does an octopus have?",
    options: ["1", "2", "3", "8"],
    correctIndex: 2,
    explanation: "Octopuses have three hearts: one main heart that pumps blood through the body and two branchial hearts that pump blood through the gills.",
    category: "Marine Life"
  },
  {
    question: "Which animal never sleeps?",
    options: ["Giraffe", "Bullfrog", "Dolphin", "Ant"],
    correctIndex: 1,
    explanation: "Bullfrogs don't sleep. They remain alert at all times, though they do rest.",
    category: "Animal Sleep"
  },
  {
    question: "What is a group of lions called?",
    options: ["A pack", "A pride", "A herd", "A flock"],
    correctIndex: 1,
    explanation: "A group of lions is called a pride, which typically consists of related females, their cubs, and a small number of adult males.",
    category: "Animal Groups"
  }
];

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
      
      // Try to generate questions using OpenAI, fall back to hardcoded if there's an error
      let questions;
      try {
        // Try to get questions from the database first
        let dbQuestions = [];
        
        if (validatedBody.category === "cats") {
          // For cats category, get a truly varied set of questions
          // This ensures we get questions from different categories and styles
          const catQuestions = await db.select()
            .from(triviaQuestions)
            .where(
              and(
                eq(triviaQuestions.difficulty, validatedBody.difficulty),
                sql`lower(${triviaQuestions.category}) like '%cat%'`
              )
            )
            .orderBy(sql`RANDOM()`)
            .limit(validatedBody.questionsCount * 10);
            
          // Make sure we have a good variety by getting different types of questions
          const uniqueCategories = new Set();
          const variedQuestions = [];
          
          // First pass: add questions with unique categories
          for (const question of catQuestions) {
            if (!uniqueCategories.has(question.category) && variedQuestions.length < validatedBody.questionsCount) {
              uniqueCategories.add(question.category);
              variedQuestions.push(question);
            }
          }
          
          // Second pass: fill remaining slots with other questions
          for (const question of catQuestions) {
            if (variedQuestions.length < validatedBody.questionsCount && 
                !variedQuestions.includes(question)) {
              variedQuestions.push(question);
            }
          }
          
          // Final shuffle for maximum randomness
          dbQuestions = shuffleArray(variedQuestions)
            .slice(0, validatedBody.questionsCount);
        } else {
          // For mixed category, get a truly varied set of questions
          const allAnimalQuestions = await db.select()
            .from(triviaQuestions)
            .where(eq(triviaQuestions.difficulty, validatedBody.difficulty))
            .orderBy(sql`RANDOM()`)
            .limit(validatedBody.questionsCount * 10);
            
          // Ensure we get a variety of animal types
          const uniqueCategories = new Set();
          const variedQuestions = [];
          
          // First pass: add questions with unique categories
          for (const question of allAnimalQuestions) {
            if (!uniqueCategories.has(question.category) && variedQuestions.length < validatedBody.questionsCount) {
              uniqueCategories.add(question.category);
              variedQuestions.push(question);
            }
          }
          
          // Second pass: fill remaining slots with other questions
          for (const question of allAnimalQuestions) {
            if (variedQuestions.length < validatedBody.questionsCount && 
                !variedQuestions.includes(question)) {
              variedQuestions.push(question);
            }
          }
          
          // Final shuffle for maximum randomness
          dbQuestions = shuffleArray(variedQuestions)
            .slice(0, validatedBody.questionsCount);
        }
        
        // Get a few questions from external trivia API to mix in with our database questions
        let externalQuestions: TriviaQuestion[] = [];
        try {
          // Try to get 2-3 questions from external API
          const externalCount = Math.min(3, Math.floor(validatedBody.questionsCount * 0.3));
          externalQuestions = await fetchExternalTriviaQuestions(
            validatedBody.difficulty,
            externalCount
          );
          console.log(`Got ${externalQuestions.length} questions from external API`);
        } catch (apiError) {
          console.log("Could not fetch external questions:", apiError);
        }
        
        // If we have enough database + external questions, use them
        const combinedQuestionsNeeded = validatedBody.questionsCount - externalQuestions.length;
        
        if (dbQuestions.length >= combinedQuestionsNeeded) {
          // Convert database questions to our API format
          const formattedDbQuestions = dbQuestions.slice(0, combinedQuestionsNeeded).map((q: any) => ({
            question: q.question,
            options: q.options as string[],
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            category: q.category,
            image: q.image || undefined
          }));
          
          // Combine database questions with external questions
          questions = [...formattedDbQuestions, ...externalQuestions];
          
          // Final shuffle to mix database and external questions
          questions = shuffleArray(questions);
          
          console.log(`Using ${formattedDbQuestions.length} questions from database and ${externalQuestions.length} from external API`);
        } else {
          // Still not enough, fall back to OpenAI
          console.log("Not enough questions in database + external API, generating with OpenAI");
          try {
            const questionData = await generateTriviaQuestions(
              validatedBody.difficulty,
              validatedBody.category,
              combinedQuestionsNeeded
            );
            
            // Validate the generated questions
            const openaiQuestions = z.array(triviaQuestion).parse(questionData.questions);
            
            // Combine all question sources
            questions = [...dbQuestions, ...externalQuestions, ...openaiQuestions].slice(0, validatedBody.questionsCount);
            
            // Final shuffle
            questions = shuffleArray(questions);
            
            // Store the generated questions in the database for future use
            try {
              const questionsToInsert = openaiQuestions.map(q => ({
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                category: q.category,
                difficulty: validatedBody.difficulty,
                image: q.image
              }));
              
              await db.insert(triviaQuestions).values(questionsToInsert);
              console.log(`Stored ${questionsToInsert.length} new OpenAI questions in database`);
            } catch (dbError) {
              console.error("Error storing questions in database:", dbError);
            }
          } catch (openaiError) {
            // Last resort - use what we have plus hardcoded questions
            console.log("Falling back to hardcoded questions:", openaiError);
            const hardcodedQuestions = validatedBody.category === "cats" ? catTriviaQuestions : mixedAnimalTriviaQuestions;
            
            // Combine all available sources
            questions = [...dbQuestions, ...externalQuestions, ...hardcodedQuestions]
              .slice(0, validatedBody.questionsCount);
            
            // Final shuffle
            questions = shuffleArray(questions);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log("Falling back to hardcoded questions:", errorMessage);
        // Use hardcoded questions as fallback
        if (validatedBody.category === "cats") {
          questions = catTriviaQuestions;
        } else {
          questions = mixedAnimalTriviaQuestions;
        }
        // Validate the hardcoded questions
        questions = z.array(triviaQuestion).parse(questions);
      }
      
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
