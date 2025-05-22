/**
 * Custom startup script for Render deployment
 * 
 * This file is specifically designed to help deploy the Purrfect Trivia app to Render's platform.
 * It sets up a minimal Express server that serves the built front-end and connects to our database.
 */
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/public')));

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
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

// Database backup endpoint - use direct database query
app.get("/api/backup/trivia-questions", async (_req, res) => {
  try {
    // Basic query to retrieve questions
    const result = await pool.query('SELECT * FROM trivia_questions LIMIT 1000');
    const allQuestions = result.rows;
    
    // Format for download
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `trivia-backup-${timestamp}.json`;
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/json');
    
    // Send the data
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

// Start the real API routes - import trivia game API
import './server/routes.js';

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Purrfect Trivia server running on port ${PORT}`);
});