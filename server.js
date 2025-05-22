/**
 * Production server for Purrfect Trivia
 * Specifically designed for Render deployment
 */
import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from '@neondatabase/serverless';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting Purrfect Trivia production server");
console.log("Current directory:", __dirname);
console.log("Files in directory:", fs.readdirSync(__dirname));

// Configure database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Check for dist directory
const distPath = path.join(__dirname, 'dist/public');
if (fs.existsSync(distPath)) {
  console.log("Found dist/public directory");
  console.log("Files in dist/public:", fs.readdirSync(distPath));
  
  // Serve static files from the dist/public directory
  app.use(express.static(distPath));
} else {
  console.log("dist/public directory not found");
  console.log("Files in dist:", fs.existsSync(path.join(__dirname, 'dist')) ? 
    fs.readdirSync(path.join(__dirname, 'dist')) : 
    "dist directory not found");
}

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    env: process.env.NODE_ENV,
    distPathExists: fs.existsSync(distPath),
    directory: __dirname
  });
});

// Basic trivia questions endpoint
app.get('/api/trivia/sample', (_req, res) => {
  const sampleQuestions = [
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
    }
  ];
  
  res.json({ questions: sampleQuestions });
});

// Database backup endpoint
app.get("/api/backup/trivia-questions", async (_req, res) => {
  try {
    // Simple query to get questions from the database
    const result = await pool.query('SELECT * FROM trivia_questions LIMIT 1000');
    const allQuestions = result.rows;
    
    // Format for download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `trivia-backup-${timestamp}.json`;
    
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/json');
    
    res.json({
      timestamp: new Date().toISOString(),
      questionCount: allQuestions.length,
      questions: allQuestions
    });
  } catch (error) {
    console.error("Error creating backup:", error);
    res.status(500).json({ 
      message: "Failed to create backup",
      error: error.message
    });
  }
});

// Trivia game API endpoints with more debugging
app.post("/api/trivia/start", async (req, res) => {
  try {
    console.log("Received start request:", req.body);
    
    const difficulty = req.body.difficulty || "medium";
    const category = req.body.category || "mixed";
    const totalQuestions = req.body.questionCount || 5;
    
    console.log(`Starting game: difficulty=${difficulty}, category=${category}, questions=${totalQuestions}`);
    
    // Create a basic set of questions based on the selected category
    const questions = category === "cats" ? 
      [
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
        }
      ] :
      [
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
        }
      ];
      
    // Response with the game details and questions
    res.json({
      gameId: `game-${Date.now()}`,
      difficulty,
      category,
      totalQuestions,
      questions: questions.slice(0, totalQuestions)
    });
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ message: "Failed to start game", error: error.message });
  }
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.send(`
      <html>
        <head>
          <title>Purrfect Trivia</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            h1 { color: #4a56a6; }
            .container { background-color: #f5f5f5; padding: 20px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Purrfect Trivia</h1>
          <div class="container">
            <h2>Server is running</h2>
            <p>The API is available at:</p>
            <ul>
              <li><a href="/api/health">/api/health</a> - Server health check</li>
              <li><a href="/api/trivia/sample">/api/trivia/sample</a> - Sample trivia questions</li>
            </ul>
          </div>
        </body>
      </html>
    `);
  }
});

// Start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Purrfect Trivia server running on port ${PORT}`);
});