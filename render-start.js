/**
 * Custom startup script for Render deployment
 * 
 * This file is specifically designed to help deploy the Purrfect Trivia app to Render's platform.
 * It sets up a minimal Express server that serves the built front-end and connects to our database.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/pg-pool';
import bodyParser from 'body-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

// Import shared schema
import * as schema from './shared/schema.js';

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database setup
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.warn("WARNING: No DATABASE_URL environment variable found. Some features may not work.");
}

// Configure session storage
const PgSessionStore = pgSession(session);

// Database pool
let pool = null;
let db = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false } // Required for Render PostgreSQL
    });
    
    db = drizzle(pool, { schema });
    
    // Test connection
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error("Database connection error:", err.message);
      } else {
        console.log("Database connected successfully!");
      }
    });
  } catch (error) {
    console.error("Failed to set up database connection:", error);
  }
}

// Configure Express middleware
app.use(bodyParser.json());

// Set up session middleware
app.use(session({
  store: pool ? new PgSessionStore({
    pool,
    tableName: 'session' // Table name for storing sessions
  }) : undefined,
  secret: process.env.SESSION_SECRET || 'purrfect-trivia-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

// Store active games in memory
const activeGames = new Map();

// Function to shuffle an array randomly (Fisher-Yates algorithm)
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to clean up question text by removing all numbers from entire question
function cleanQuestionText(question) {
  if (!question) return '';
  
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

// Hardcoded questions in case the DB fails
const hardcodedQuestions = [
  {
    question: "Which famous internet cat was known for its grumpy facial expression?",
    options: ["Lil Bub", "Grumpy Cat", "Maru", "Keyboard Cat"],
    correctIndex: 1,
    explanation: "Grumpy Cat (real name Tardar Sauce) became famous for her permanently grumpy facial expression caused by feline dwarfism.",
    category: "Famous Cats",
    difficulty: "medium"
  },
  {
    question: "What is the average lifespan of an indoor cat?",
    options: ["5-8 years", "10-15 years", "15-20 years", "20-25 years"],
    correctIndex: 1,
    explanation: "Indoor cats typically live between 10-15 years, though some may live up to 20 years.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "Which of these cat breeds is known for having no fur?",
    options: ["Persian", "Maine Coon", "Sphynx", "Siamese"],
    correctIndex: 2,
    explanation: "The Sphynx cat is known for being hairless, although they may have a fine layer of fuzz.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "How many toes does a normal cat have on its front paws?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "Most cats have 5 toes on their front paws and 4 on their back paws, for a total of 18.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What is a group of cats called?",
    options: ["A clowder", "A murder", "A pride", "A pack"],
    correctIndex: 0,
    explanation: "A group of cats is called a clowder, while a group of kittens is called a kindle.",
    category: "Cat Terminology",
    difficulty: "medium"
  },
  {
    question: "Which part of their body do cats use to help maintain balance?",
    options: ["Whiskers", "Ears", "Tail", "Claws"],
    correctIndex: 2,
    explanation: "Cats use their tails for balance when running or walking on narrow surfaces.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What is the name of the sound cats make when they're happy?",
    options: ["Purr", "Meow", "Hiss", "Chirp"],
    correctIndex: 0,
    explanation: "Cats purr when they're content, though they may also purr when nervous or injured as a self-soothing mechanism.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "Which animal has the longest lifespan?",
    options: ["Elephant", "Tortoise", "Parrot", "Whale"],
    correctIndex: 1,
    explanation: "Some tortoise species can live over 150 years, with the oldest confirmed tortoise living to 188 years.",
    category: "Animal Lifespans",
    difficulty: "medium"
  },
  {
    question: "Which cat has the loudest roar?",
    options: ["Lion", "Tiger", "Jaguar", "Leopard"],
    correctIndex: 1,
    explanation: "Tigers have the loudest roar among big cats, which can be heard up to 2 miles away.",
    category: "Wild Cats",
    difficulty: "hard"
  },
  {
    question: "What is a baby rabbit called?",
    options: ["Kit", "Pup", "Cub", "Joey"],
    correctIndex: 0,
    explanation: "A baby rabbit is called a kit or kitten. They're born hairless and with their eyes closed.",
    category: "Animal Babies",
    difficulty: "easy"
  }
];

// Load backup questions if available
function loadBackupQuestions() {
  try {
    const backupPath = path.join(__dirname, 'backups', 'default-trivia-backup.json');
    if (fs.existsSync(backupPath)) {
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      console.log(`Loaded ${backup.questionCount} questions from backup file`);
      return backup.questions;
    }
  } catch (error) {
    console.error("Error loading backup questions:", error);
  }
  
  console.log("Using hardcoded questions as fallback");
  return hardcodedQuestions;
}

// Trivia question backup
const backupQuestions = loadBackupQuestions();

// API routes
app.post("/api/trivia/start", async (req, res) => {
  try {
    const { difficulty = "medium", category = "cats", questionCount = 10 } = req.body;
    
    // Generate a game ID
    const gameId = Math.random().toString(36).substring(2, 15);
    
    // Try to get questions from the database first
    let questions = [];
    
    if (db && pool) {
      try {
        // Query the database for questions matching criteria
        const result = await pool.query(
          `SELECT * FROM trivia_questions 
           WHERE difficulty = $1 
           ORDER BY RANDOM() 
           LIMIT $2`,
          [difficulty, questionCount * 2] // Get extra for deduplication
        );
        
        if (result.rows && result.rows.length > 0) {
          questions = result.rows;
          console.log(`Found ${questions.length} questions in database`);
          
          // Deduplicate questions
          const uniqueQuestions = [];
          const seenQuestions = new Set();
          
          for (const q of questions) {
            const cleanText = cleanQuestionText(q.question).toLowerCase();
            if (!seenQuestions.has(cleanText)) {
              seenQuestions.add(cleanText);
              uniqueQuestions.push(q);
              
              if (uniqueQuestions.length >= questionCount) {
                break;
              }
            }
          }
          
          questions = uniqueQuestions;
          console.log(`Using ${questions.length} unique questions from database`);
        }
      } catch (dbError) {
        console.error("Database error, falling back to backup:", dbError);
        questions = []; // Will use backup questions below
      }
    }
    
    // If we don't have enough database questions, use backup
    if (questions.length < questionCount) {
      console.log(`Not enough database questions, using backup (need ${questionCount}, have ${questions.length})`);
      
      // Filter backup questions by difficulty
      const filteredBackup = backupQuestions.filter(q => q.difficulty === difficulty);
      
      // Shuffle and take what we need
      const shuffledBackup = shuffleArray(filteredBackup);
      
      // Deduplicate and combine
      const uniqueQuestions = [...questions]; // Start with DB questions
      const seenQuestions = new Set(uniqueQuestions.map(q => cleanQuestionText(q.question).toLowerCase()));
      
      for (const q of shuffledBackup) {
        const cleanText = cleanQuestionText(q.question).toLowerCase();
        if (!seenQuestions.has(cleanText)) {
          seenQuestions.add(cleanText);
          uniqueQuestions.push(q);
          
          if (uniqueQuestions.length >= questionCount) {
            break;
          }
        }
      }
      
      questions = uniqueQuestions.slice(0, questionCount);
      console.log(`Using ${questions.length} combined questions (DB + backup)`);
    }
    
    // If we still don't have enough, use hardcoded
    if (questions.length < questionCount) {
      console.log("Still not enough questions, using hardcoded");
      questions = hardcodedQuestions.slice(0, questionCount);
    }
    
    // Shuffle question order
    questions = shuffleArray(questions);
    
    // Randomize option order for each question
    const randomizedQuestions = questions.map(question => {
      // Ensure we have valid options array
      const options = Array.isArray(question.options) 
        ? question.options 
        : typeof question.options === 'string' 
          ? JSON.parse(question.options) 
          : ["Option A", "Option B", "Option C", "Option D"];
      
      // Determine correct answer
      const correctIndex = typeof question.correctIndex === 'number' 
        ? question.correctIndex 
        : 0;
      
      // Get the correct answer and create a completely new shuffled array of options
      const correctAnswer = options[correctIndex];
      const shuffledOptions = [...options];
      
      // Shuffle options properly
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      
      // Find where the correct answer ended up
      const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswer);
      
      // Return question with shuffled options
      return {
        ...question,
        options: shuffledOptions,
        correctIndex: newCorrectIndex
      };
    });
    
    // Create game state
    const gameState = {
      id: gameId,
      currentQuestionIndex: 0,
      score: 0,
      questions: randomizedQuestions,
      category,
      difficulty,
      answeredQuestions: [],
      completed: false
    };
    
    // Store game state
    activeGames.set(gameId, gameState);
    
    // Return just the game ID (not the answers!)
    res.json({ gameId });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ error: "Failed to start game" });
  }
});

// Get the current question
app.get("/api/trivia/questions/:gameId", (req, res) => {
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
    
    // Get question details without the correct answer
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
    console.error("Error getting question:", error);
    res.status(500).json({ error: "Failed to get question" });
  }
});

// Submit an answer
app.post("/api/trivia/answer", (req, res) => {
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
    console.error("Error answering question:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

// Move to the next question
app.post("/api/trivia/next", (req, res) => {
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
app.post("/api/trivia/stop", (req, res) => {
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
    
    // Clean up the game state after a while
    setTimeout(() => {
      activeGames.delete(gameId);
    }, 60 * 1000); // Keep for 1 minute
  } catch (error) {
    console.error("Error stopping game:", error);
    res.status(500).json({ error: "Failed to stop game" });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});