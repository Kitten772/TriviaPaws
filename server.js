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

// Initial database check and setup
async function setupInitialDatabase() {
  try {
    // Check if we have questions in the database
    const countResult = await pool.query('SELECT COUNT(*) FROM trivia_questions');
    const questionCount = parseInt(countResult.rows[0].count);
    
    console.log(`Database contains ${questionCount} trivia questions`);
    
    // If we have too few questions, populate with more questions
    if (questionCount < 1000) {
      console.log("Database has fewer than 1000 questions, attempting to restore from backup");
      
      try {
        // Try to load the backup file
        const backupPath = path.join(__dirname, 'backups/default-trivia-backup.json');
        
        if (fs.existsSync(backupPath)) {
          console.log("Found backup file, restoring questions");
          const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
          
          if (backupData.questions && backupData.questions.length > 0) {
            console.log(`Found ${backupData.questions.length} questions in backup file`);
            
            // Import batch by batch to avoid memory issues
            const batchSize = 100;
            let imported = 0;
            
            for (let i = 0; i < backupData.questions.length; i += batchSize) {
              const batch = backupData.questions.slice(i, i + batchSize);
              
              // Create a batch insert query
              const valueStrings = batch.map((_, index) => 
                `($${index * 6 + 1}, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5}, $${index * 6 + 6})`
              );
              
              const query = `
                INSERT INTO trivia_questions 
                (question, options, correct_index, explanation, category, difficulty)
                VALUES ${valueStrings.join(', ')}
                ON CONFLICT (question) DO NOTHING
              `;
              
              const values = batch.flatMap(q => [
                q.question, 
                Array.isArray(q.options) ? JSON.stringify(q.options) : JSON.stringify(q.options || []),
                q.correct_index || q.correctIndex,
                q.explanation,
                q.category,
                q.difficulty
              ]);
              
              try {
                await pool.query(query, values);
                imported += batch.length;
                console.log(`Imported ${imported}/${backupData.questions.length} questions`);
              } catch (batchError) {
                console.error(`Error importing batch ${i}-${i+batchSize}:`, batchError.message);
              }
            }
            
            console.log(`Imported ${imported} questions from backup file`);
            return;
          }
        } else {
          console.log("No backup file found at", backupPath);
        }
      } catch (backupError) {
        console.error("Error restoring from backup:", backupError.message);
      }
      
      // If we reach here, we need to add at least some basic questions
      console.log("Adding initial set of questions");
      
      // If we have no questions, populate with initial questions
      if (questionCount < 10) {
      console.log("Database is empty, adding initial questions");
      
      // Initial questions to add to database
      const initialQuestions = [
        // Cat questions - easy
        {
          question: "What is the most common eye color for cats?",
          options: ["Blue", "Green", "Yellow", "Brown"],
          correctIndex: 2,
          explanation: "Yellow (or gold) is the most common eye color in cats, followed by green and copper.",
          category: "Cat Facts",
          difficulty: "easy"
        },
        {
          question: "How many whiskers does the average cat have?",
          options: ["8-12", "16-20", "24-28", "30-36"],
          correctIndex: 2,
          explanation: "Most cats have 24 whiskers, arranged in 4 rows on each cheek.",
          category: "Cat Anatomy",
          difficulty: "easy"
        },
        {
          question: "On average, how many hours a day do cats sleep?",
          options: ["6-8", "10-12", "14-16", "18-20"],
          correctIndex: 2,
          explanation: "Cats sleep 14-16 hours per day on average, which is why they're often found napping.",
          category: "Cat Behavior",
          difficulty: "easy"
        },
        // Cat questions - medium
        {
          question: "What is the name of the first cloned cat?",
          options: ["Dolly", "Copy Cat", "CC", "Garfield"],
          correctIndex: 2,
          explanation: "The first cloned cat was named 'CC' which stood for 'Carbon Copy'. She was created at Texas A&M University in 2001.",
          category: "Famous Cats",
          difficulty: "medium"
        },
        {
          question: "Which breed of cat is known for having no tail?",
          options: ["Manx", "Scottish Fold", "Sphynx", "Persian"],
          correctIndex: 0,
          explanation: "The Manx cat is known for its naturally occurring mutation that results in a shortened tail or no tail at all.",
          category: "Cat Breeds",
          difficulty: "medium"
        },
        // Cat questions - hard
        {
          question: "What is the scientific name for the domestic cat?",
          options: ["Felis catus", "Canis familiaris", "Panthera leo", "Felis silvestris"],
          correctIndex: 0,
          explanation: "The scientific name for the domestic cat is Felis catus, from the family Felidae.",
          category: "Cat Science",
          difficulty: "hard"
        },
        // Mixed animal questions - easy
        {
          question: "What color are zebras born as?",
          options: ["Black with white stripes", "White with black stripes", "Brown", "Gray"],
          correctIndex: 1,
          explanation: "Zebras are born with white coats and black stripes that darken as they age.",
          category: "Wild Animals",
          difficulty: "easy"
        },
        // Mixed animal questions - medium
        {
          question: "What is the only bird that can fly backwards?",
          options: ["Eagle", "Hummingbird", "Owl", "Parrot"],
          correctIndex: 1,
          explanation: "Hummingbirds are the only birds capable of flying backwards, thanks to their unique wing structure.",
          category: "Bird Facts",
          difficulty: "medium"
        },
        // Mixed animal questions - hard
        {
          question: "Which animal has the longest gestation period?",
          options: ["Elephant", "Blue Whale", "Giraffe", "Rhinoceros"],
          correctIndex: 0,
          explanation: "African elephants have the longest gestation period at about 22 months.",
          category: "Animal Reproduction",
          difficulty: "hard"
        },
        {
          question: "How many hearts does an octopus have?",
          options: ["1", "2", "3", "8"],
          correctIndex: 2,
          explanation: "An octopus has three hearts: one main heart that pumps blood through the body, and two branchial hearts that pump blood through the gills.",
          category: "Marine Life",
          difficulty: "hard"
        }
      ];
      
      // Add questions to database
      for (const q of initialQuestions) {
        await pool.query(
          `INSERT INTO trivia_questions 
          (question, options, correct_index, explanation, category, difficulty) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [q.question, JSON.stringify(q.options), q.correctIndex, q.explanation, q.category, q.difficulty]
        );
      }
      
      console.log(`Added ${initialQuestions.length} initial questions to database`);
    }
  } catch (error) {
    console.error("Error setting up initial database:", error.message);
    
    // Check if the error is because the table doesn't exist
    if (error.message.includes("does not exist")) {
      console.log("Creating trivia_questions table");
      
      try {
        // Create the table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS trivia_questions (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            options JSONB NOT NULL,
            correct_index INTEGER NOT NULL,
            explanation TEXT NOT NULL,
            category VARCHAR(100) NOT NULL,
            difficulty VARCHAR(20) NOT NULL,
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            random_bucket INTEGER
          )
        `);
        
        console.log("Successfully created trivia_questions table");
        
        // Try again to add initial questions
        setTimeout(setupInitialDatabase, 1000);
      } catch (createError) {
        console.error("Failed to create table:", createError.message);
      }
    }
  }
}

// Run database setup when the server starts
setupInitialDatabase();

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

// Trivia game API endpoints
app.post("/api/trivia/start", async (req, res) => {
  try {
    console.log("Received start request:", req.body);
    
    const difficulty = req.body.difficulty || "medium";
    const category = req.body.category || "mixed";
    const totalQuestions = req.body.questionCount || req.body.questionsCount || 5;
    
    console.log(`Starting game: difficulty=${difficulty}, category=${category}, questions=${totalQuestions}`);
    
    // Try to get questions from the database first
    let dbQuestions = [];
    try {
      // Query based on category and difficulty
      let query;
      if (category === "cats") {
        query = `
          SELECT * FROM trivia_questions 
          WHERE difficulty = $1 
          AND LOWER(category) LIKE '%cat%'
          ORDER BY RANDOM() 
          LIMIT $2
        `;
      } else {
        query = `
          SELECT * FROM trivia_questions 
          WHERE difficulty = $1 
          ORDER BY RANDOM() 
          LIMIT $2
        `;
      }
      
      // Execute query
      const result = await pool.query(query, [difficulty, totalQuestions * 2]);
      console.log(`Found ${result.rows.length} questions in database for ${category}/${difficulty}`);
      
      // Format results
      if (result.rows.length > 0) {
        dbQuestions = result.rows.map(q => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options),
          correctIndex: q.correct_index || q.correctIndex,
          explanation: q.explanation,
          category: q.category,
          image: q.image
        }));
      }
    } catch (dbError) {
      console.error("Database error, using fallback questions:", dbError.message);
    }
    
    // Fallback questions if database doesn't have enough
    const fallbackCatQuestions = [
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
    ];
    
    const fallbackMixedQuestions = [
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
    
    // Combine database questions with fallback if needed
    let questions = dbQuestions;
    
    // If we don't have enough questions from the database, add some fallbacks
    if (questions.length < totalQuestions) {
      const fallbacks = category === "cats" ? fallbackCatQuestions : fallbackMixedQuestions;
      const needed = totalQuestions - questions.length;
      questions = [...questions, ...fallbacks.slice(0, needed)];
    }
    
    // Shuffle and limit to requested number
    questions = questions.sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    
    // Generate a unique game ID
    const gameId = `game-${Date.now()}`;
    
    // Response with the game details and questions
    res.json({
      gameId,
      difficulty,
      category,
      totalQuestions,
      questions
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