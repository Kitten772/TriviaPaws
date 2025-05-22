/**
 * Production server for Purrfect Trivia
 * This standalone file is designed to work with Render's deployment system
 */
import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import pg from 'pg';

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

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, 'client/dist')));

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
    },
    {
      question: "Which of these cat breeds is known for having no fur?",
      options: ["Persian", "Maine Coon", "Sphynx", "Siamese"],
      correctIndex: 2,
      explanation: "The Sphynx cat is known for being hairless, although they may have a fine layer of fuzz.",
      category: "Cat Breeds"
    }
  ];
  
  res.json({ questions: sampleQuestions });
});

// Database backup endpoints - these use the direct database connection
app.get("/api/backup/trivia-questions", async (_req, res) => {
  try {
    // Use basic pg query to avoid schema dependency
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

// Admin page to access backup functionality
app.get("/admin/backup", (_req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Purrfect Trivia - Backup</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .container {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #4a56a6;
          border-bottom: 2px solid #4a56a6;
          padding-bottom: 10px;
        }
        .button {
          display: inline-block;
          background-color: #4a56a6;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 15px;
        }
        .stats {
          margin-top: 20px;
          font-size: 0.9em;
        }
        .info {
          background-color: #e0f7fa;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <h1>Purrfect Trivia - Database Backup</h1>
      
      <div class="container">
        <h2>Backup Trivia Questions</h2>
        <p>Click the button below to download a backup of all trivia questions in the database.</p>
        
        <div class="info">
          <p><strong>Note:</strong> Keep your backup files safe! You may need them if your database is reset or if you want to transfer questions to another instance.</p>
        </div>
        
        <a href="/api/backup/trivia-questions" class="button">Download Database Backup</a>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start the server
const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Purrfect Trivia server running on port ${PORT}`);
});