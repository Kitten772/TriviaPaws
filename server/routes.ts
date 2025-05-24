import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTriviaQuestions } from "./openai";
import { randomUUID } from "crypto";
import { triviaQuestion, triviaGameState, triviaQuestions, type TriviaQuestion } from "@shared/schema";
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

// Function to clean up question text by removing all numbers from entire question
function cleanQuestionText(question: string): string {
  // Remove ALL numbers from the entire question
  let cleanedQuestion = question;
  
  // Remove all digits from the entire question
  cleanedQuestion = cleanedQuestion.replace(/\d+/g, '');
  
  // Remove extra spaces and punctuation that might be left
  cleanedQuestion = cleanedQuestion.replace(/\s+/g, ' ');
  cleanedQuestion = cleanedQuestion.replace(/\s*([,.?!:;])\s*/g, '$1 ');
  cleanedQuestion = cleanedQuestion.replace(/\s+/g, ' ');
  
  // Remove any remaining leading or trailing whitespace
  cleanedQuestion = cleanedQuestion.trim();
  
  return cleanedQuestion;
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
        questionCount: z.number().min(1).max(20).default(10),
        questionsCount: z.number().min(1).max(20).optional(),
      });
      
      const validatedBody = schema.parse(req.body);
      
      // Use questionCount parameter (new) or fallback to questionsCount (old) for compatibility
      const questionCount: number = validatedBody.questionCount || validatedBody.questionsCount || 10;
      
      // Try to generate questions using OpenAI, fall back to hardcoded if there's an error
      let questions;
      try {
        // Try to get questions from the database first
        let dbQuestions = [];
        
        console.log(`Looking for ${questionCount} ${validatedBody.category} questions with ${validatedBody.difficulty} difficulty`);
        
        if (validatedBody.category === "cats") {
          // For cats category, get a truly varied set of questions
          // This ensures we get questions from different categories and styles
          const catQuestions = await db.select()
            .from(triviaQuestions)
            .where(
              and(
                eq(triviaQuestions.difficulty, validatedBody.difficulty)
                // Don't restrict by category - we want all cat questions
              )
            )
            .orderBy(sql`RANDOM()`)
            .limit(questionCount * 10);
            
          // Make sure we have a good variety by getting different types of questions
          const uniqueCategories = new Set();
          const variedQuestions = [];
          const questionTexts = new Set(); // Track question text to avoid duplicates
          
          // First pass: add questions with unique categories
          for (const question of catQuestions) {
            // Clean up any question numbering (like "Quiz #123: What is...")
            const cleanedQuestion = question.question.replace(/^.*?(?:Quiz|Question|Q)\s*#?\d+\s*:?\s*/i, '');
            
            if (!uniqueCategories.has(question.category) && 
                variedQuestions.length < questionCount && 
                !questionTexts.has(cleanedQuestion.toLowerCase())) {
              uniqueCategories.add(question.category);
              questionTexts.add(cleanedQuestion.toLowerCase());
              
              // Create a cleaned version of the question
              variedQuestions.push({
                ...question,
                question: cleanedQuestion
              });
            }
          }
          
          // Second pass: fill remaining slots with other questions
          for (const question of catQuestions) {
            // Clean up any question numbering
            const cleanedQuestion = question.question.replace(/^.*?(?:Quiz|Question|Q)\s*#?\d+\s*:?\s*/i, '');
            
            if (variedQuestions.length < questionCount && 
                !questionTexts.has(cleanedQuestion.toLowerCase())) {
              questionTexts.add(cleanedQuestion.toLowerCase());
              
              // Create a cleaned version of the question
              variedQuestions.push({
                ...question,
                question: cleanedQuestion
              });
            }
          }
          
          // Final shuffle for maximum randomness
          dbQuestions = shuffleArray(variedQuestions)
            .slice(0, questionCount);
        } else {
          // For mixed category, get a truly varied set of questions
          const allAnimalQuestions = await db.select()
            .from(triviaQuestions)
            .where(eq(triviaQuestions.difficulty, validatedBody.difficulty))
            .orderBy(sql`RANDOM()`)
            .limit(questionCount * 10);
            
          // Ensure we get a variety of animal types
          const uniqueCategories = new Set();
          const variedQuestions = [];
          const questionTexts = new Set(); // Track question text to avoid duplicates
          
          // First pass: add questions with unique categories
          for (const question of allAnimalQuestions) {
            // Clean up any question numbering (like "Quiz #123: What is...")
            const cleanedQuestion = question.question.replace(/^.*?(?:Quiz|Question|Q)\s*#?\d+\s*:?\s*/i, '');
            
            if (!uniqueCategories.has(question.category) && 
                variedQuestions.length < questionCount && 
                !questionTexts.has(cleanedQuestion.toLowerCase())) {
              uniqueCategories.add(question.category);
              questionTexts.add(cleanedQuestion.toLowerCase());
              
              // Create a cleaned version of the question
              variedQuestions.push({
                ...question,
                question: cleanedQuestion
              });
            }
          }
          
          // Second pass: fill remaining slots with other questions
          for (const question of allAnimalQuestions) {
            // Clean up any question numbering
            const cleanedQuestion = question.question.replace(/^.*?(?:Quiz|Question|Q)\s*#?\d+\s*:?\s*/i, '');
            
            if (variedQuestions.length < questionCount && 
                !questionTexts.has(cleanedQuestion.toLowerCase())) {
              questionTexts.add(cleanedQuestion.toLowerCase());
              
              // Create a cleaned version of the question
              variedQuestions.push({
                ...question,
                question: cleanedQuestion
              });
            }
          }
          
          // Final shuffle for maximum randomness
          dbQuestions = shuffleArray(variedQuestions)
            .slice(0, questionCount);
        }
        
        // Get a few questions from external trivia API to mix in with our database questions
        let externalQuestions: TriviaQuestion[] = [];
        try {
          // Try to get 2-3 questions from external API
          const externalCount = Math.min(3, Math.floor(questionCount * 0.3));
          externalQuestions = await fetchExternalTriviaQuestions(
            validatedBody.difficulty,
            externalCount
          );
          console.log(`Got ${externalQuestions.length} questions from external API`);
        } catch (apiError) {
          console.log("Could not fetch external questions:", apiError);
        }
        
        // If we have enough database + external questions, use them
        const combinedQuestionsNeeded = questionCount - externalQuestions.length;
        
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
            const openaiQuestions = [];
            for (const q of questionData) {
              try {
                const validated = triviaQuestion.parse(q);
                openaiQuestions.push(validated);
              } catch (e) {
                console.error("Invalid question from OpenAI:", q, e);
              }
            }
            
            console.log(`Generated ${openaiQuestions.length} questions with OpenAI`);
            
            // Combine all sources of questions and ensure we have the right amount
            questions = [...dbQuestions, ...externalQuestions, ...openaiQuestions].slice(0, questionCount);
          } catch (openaiError) {
            console.log("Falling back to hardcoded questions:", openaiError);
            // Fall back to hardcoded questions as a last resort
            questions = validatedBody.category === 'cats' 
              ? catTriviaQuestions 
              : [...catTriviaQuestions, ...mixedAnimalTriviaQuestions];
            
            // Randomize and take just what we need
            questions = shuffleArray(questions).slice(0, questionCount);
          }
        }
      } catch (error) {
        // In case of database errors, fall back to hardcoded questions
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log("Falling back to hardcoded questions:", errorMessage);
        
        questions = validatedBody.category === 'cats' 
          ? catTriviaQuestions 
          : [...catTriviaQuestions, ...mixedAnimalTriviaQuestions];
        
        // Randomize and take just what we need
        questions = shuffleArray(questions).slice(0, questionCount);
      }
      
      // Make sure we handle any unexpected issues with the questions
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        console.log("No questions available, using hardcoded questions");
        questions = validatedBody.category === 'cats' 
          ? catTriviaQuestions 
          : [...catTriviaQuestions, ...mixedAnimalTriviaQuestions];
        
        // Randomize and take just what we need
        questions = shuffleArray(questions).slice(0, questionCount);
      }
      
      // Ensure we have the requested number of questions
      const dedupedQuestions = [];
      const seenQuestions = new Set();
      
      // Filter out any duplicate questions
      for (const q of questions) {
        if (q && q.question) {
          const cleanedText = cleanQuestionText(q.question).toLowerCase();
          if (!seenQuestions.has(cleanedText)) {
            seenQuestions.add(cleanedText);
            dedupedQuestions.push(q);
            
            if (dedupedQuestions.length >= questionCount) {
              break;
            }
          }
        }
      }
      
      // If we still don't have enough, fill with hardcoded questions
      if (dedupedQuestions.length < questionCount) {
        const hardcodedQuestions = validatedBody.category === 'cats' 
          ? catTriviaQuestions 
          : [...catTriviaQuestions, ...mixedAnimalTriviaQuestions];
        
        for (const q of shuffleArray(hardcodedQuestions)) {
          const cleanedText = cleanQuestionText(q.question).toLowerCase();
          if (!seenQuestions.has(cleanedText)) {
            seenQuestions.add(cleanedText);
            dedupedQuestions.push(q);
            
            if (dedupedQuestions.length >= questionCount) {
              break;
            }
          }
        }
      }
      
      console.log(`Filtered ${questions.length} questions down to ${dedupedQuestions.length} unique questions`);
      
      // Create a game ID and store the game state
      const gameId = randomUUID();
      const gameState: TriviaGameState = {
        id: gameId,
        currentQuestionIndex: 0,
        score: 0,
        questions: dedupedQuestions,
        category: validatedBody.category,
        difficulty: validatedBody.difficulty,
        answeredQuestions: [],
        completed: false
      };
      
      activeGames.set(gameId, gameState);
      
      // Randomize option order for each question
      const randomizedQuestions = dedupedQuestions.map(question => {
        // Ensure we have valid options array
        const options = Array.isArray(question.options) 
          ? question.options 
          : typeof question.options === 'string' 
            ? JSON.parse(question.options) 
            : ["Option A", "Option B", "Option C", "Option D"];
        
        // Determine correct answer
        const correctIndex = typeof question.correctIndex === 'number' 
          ? question.correctIndex 
          : typeof question.correctIndex === 'number'
            ? question.correctIndex
            : 0;
        
        // Get the correct answer and create a completely new shuffled array of options
        const correctAnswer = options[correctIndex];
        const shuffledOptions = [...options];
        
        // Shuffle the options array completely
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Find where the correct answer ended up after shuffling
        let newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswer);
        
        // If for some reason findIndex returns -1, use a random position
        if (newCorrectIndex === -1) {
          const fallbackIndex = Math.floor(Math.random() * 4);
          shuffledOptions[fallbackIndex] = correctAnswer;
          newCorrectIndex = fallbackIndex;
        }
        
        // No debugging logs in production
        
        // Return question with shuffled options
        return {
          ...question,
          options: shuffledOptions,
          correctIndex: newCorrectIndex
        };
      });
      
      // Store the randomized questions in the game state
      gameState.questions = randomizedQuestions;
      
      // Return both the gameId AND the questions to the client
      res.json({ 
        gameId, 
        questions: randomizedQuestions.map(q => ({
          ...q,
          // Don't send the explanation yet - will reveal after answering
          explanation: ""
        }))
      });
    } catch (error) {
      console.error("Error starting trivia game:", error);
      res.status(500).json({ error: "Failed to start trivia game" });
    }
  });

  // Get questions for a specific game
  app.get("/api/trivia/questions/:gameId", (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const gameState = activeGames.get(gameId);
      
      if (!gameState) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      // Get the current question
      const question = gameState.questions[gameState.currentQuestionIndex];
      
      if (!question) {
        return res.status(404).json({ error: "No more questions" });
      }
      
      // Get question details without the correct answer (client shouldn't know this)
      const { question: questionText, options, category, explanation, image } = question;
      
      const questionResponse = {
        question: questionText,
        options: options,
        category: category,
        explanation: explanation,
        image: image
      };
      
      // Return the current question, game progress, and score
      res.json({
        question: questionResponse,
        currentQuestionIndex: gameState.currentQuestionIndex,
        totalQuestions: gameState.questions.length,
        score: gameState.score,
        category: gameState.category,
        difficulty: gameState.difficulty,
        completed: gameState.completed,
        answeredQuestions: gameState.answeredQuestions
      });
    } catch (error) {
      console.error("Error getting trivia question:", error);
      res.status(500).json({ error: "Failed to get trivia question" });
    }
  });

  // Submit an answer for the current question
  app.post("/api/trivia/answer", (req: Request, res: Response) => {
    try {
      const { gameId, selectedAnswerIndex } = req.body;
      
      if (typeof selectedAnswerIndex !== 'number') {
        return res.status(400).json({ error: "Invalid answer index" });
      }
      
      const gameState = activeGames.get(gameId);
      
      if (!gameState) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      // Get the current question
      const question = gameState.questions[gameState.currentQuestionIndex];
      
      if (!question) {
        return res.status(404).json({ error: "No more questions" });
      }
      
      // Check if the answer is correct
      const isCorrect = selectedAnswerIndex === question.correctIndex;
      
      // Add to score if correct
      if (isCorrect) {
        gameState.score += 1;
      }
      
      // Add to answered questions
      gameState.answeredQuestions.push({
        questionIndex: gameState.currentQuestionIndex,
        selectedAnswerIndex,
        correctAnswerIndex: question.correctIndex,
        isCorrect
      });
      
      // Return whether the answer was correct and the updated score
      res.json({
        isCorrect,
        correctAnswerIndex: question.correctIndex,
        explanation: question.explanation,
        score: gameState.score
      });
    } catch (error) {
      console.error("Error answering trivia question:", error);
      res.status(500).json({ error: "Failed to process answer" });
    }
  });

  // Move to the next question
  app.post("/api/trivia/next", (req: Request, res: Response) => {
    try {
      const { gameId } = req.body;
      
      const gameState = activeGames.get(gameId);
      
      if (!gameState) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      // Increment the question index
      gameState.currentQuestionIndex += 1;
      
      // Check if we've reached the end of the questions
      if (gameState.currentQuestionIndex >= gameState.questions.length) {
        gameState.completed = true;
      }
      
      // Return the updated game state
      res.json({
        currentQuestionIndex: gameState.currentQuestionIndex,
        totalQuestions: gameState.questions.length,
        score: gameState.score,
        completed: gameState.completed
      });
    } catch (error) {
      console.error("Error moving to next question:", error);
      res.status(500).json({ error: "Failed to move to next question" });
    }
  });

  // End the game early
  app.post("/api/trivia/stop", (req: Request, res: Response) => {
    try {
      const { gameId } = req.body;
      
      const gameState = activeGames.get(gameId);
      
      if (!gameState) {
        return res.status(404).json({ error: "Game not found" });
      }
      
      // Mark the game as completed
      gameState.completed = true;
      
      // Return the final score and game stats
      res.json({
        finalScore: gameState.score,
        totalQuestions: gameState.questions.length,
        answeredQuestions: gameState.answeredQuestions
      });
      
      // Clean up the game state to free memory
      setTimeout(() => {
        activeGames.delete(gameId);
      }, 60 * 1000); // Keep for 1 minute for potential follow-up requests
    } catch (error) {
      console.error("Error stopping game:", error);
      res.status(500).json({ error: "Failed to stop game" });
    }
  });

  // Create a server for the Express app
  const server = createServer(app);
  
  // Add additional routes for admin/dev
  app.get("/api/backup/trivia-questions", async (_req: Request, res: Response) => {
    try {
      // Get all questions from the database
      const allQuestions = await db.select().from(triviaQuestions);
      
      // Calculate some stats
      const questionCount = allQuestions.length;
      const catCount = allQuestions.filter(q => q.category && q.category.toLowerCase().includes('cat')).length;
      const animalCount = questionCount - catCount;
      
      const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
      const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
      const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;
      
      // Create backup object
      const backup = {
        timestamp: new Date().toISOString(),
        questionCount: questionCount,
        catQuestionCount: catCount,
        animalQuestionCount: animalCount,
        difficultyStats: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount
        },
        questions: allQuestions
      };
      
      res.json(backup);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ error: "Failed to create backup" });
    }
  });
  
  // Admin endpoint to trigger backup
  app.get("/admin/backup", (_req: Request, res: Response) => {
    try {
      // Redirect to the backup API
      res.redirect("/api/backup/trivia-questions");
    } catch (error) {
      console.error("Error in admin backup:", error);
      res.status(500).json({ error: "Failed to process admin request" });
    }
  });

  return server;
}