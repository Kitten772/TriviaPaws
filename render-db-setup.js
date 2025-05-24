/**
 * Database setup script for Render deployment
 * This script handles database initialization on Render
 */

import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script initializes the database with our 50,000 questions
async function initializeDatabase() {
  console.log("Initializing database on Render...");
  
  try {
    // Connect to the database (use DATABASE_URL environment variable)
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    console.log("Connecting to database...");
    
    // Use postgres.js client
    const queryClient = postgres(process.env.DATABASE_URL, { 
      max: 1,
      ssl: process.env.NODE_ENV === 'production'
    });
    
    // Initialize Drizzle
    const db = drizzle(queryClient);
    
    console.log("Database connection established");
    
    // Check if we need to run migrations
    // This will create tables if they don't exist
    try {
      console.log("Running migrations...");
      await migrate(db, { migrationsFolder: './drizzle' });
      console.log("Migrations completed successfully");
    } catch (migrateError) {
      console.log("Migration error (this might be normal on first run):", migrateError);
    }
    
    // Check if we need to load questions
    console.log("Checking if questions need to be loaded...");
    
    // Count existing questions
    const result = await queryClient`SELECT COUNT(*) FROM trivia_questions`;
    const questionCount = parseInt(result[0]?.count || '0');
    
    console.log(`Database has ${questionCount} questions`);
    
    if (questionCount < 1000) {
      console.log("Loading questions from backup file...");
      
      // Load questions from our backup file
      const backupPath = path.join(__dirname, 'backups', 'massive-trivia-backup.json');
      
      if (!fs.existsSync(backupPath)) {
        console.log("Backup file not found, looking for default backup...");
        const defaultBackupPath = path.join(__dirname, 'backups', 'default-trivia-backup.json');
        
        if (!fs.existsSync(defaultBackupPath)) {
          throw new Error("No backup file found to load questions from");
        }
        
        // Use default backup instead
        const defaultBackup = JSON.parse(fs.readFileSync(defaultBackupPath, 'utf8'));
        
        console.log(`Loading ${defaultBackup.questionCount} questions from default backup...`);
        
        // Insert questions in batches to avoid memory issues
        const batchSize = 100;
        const totalBatches = Math.ceil(defaultBackup.questions.length / batchSize);
        
        for (let i = 0; i < totalBatches; i++) {
          const batch = defaultBackup.questions.slice(i * batchSize, (i + 1) * batchSize);
          console.log(`Inserting batch ${i + 1}/${totalBatches} (${batch.length} questions)...`);
          
          // Insert this batch
          for (const question of batch) {
            await queryClient`
              INSERT INTO trivia_questions 
              (question, options, "correctIndex", explanation, category, difficulty)
              VALUES (
                ${question.question},
                ${JSON.stringify(question.options)},
                ${question.correctIndex},
                ${question.explanation},
                ${question.category},
                ${question.difficulty}
              )
              ON CONFLICT DO NOTHING
            `;
          }
          
          console.log(`Batch ${i + 1} inserted`);
        }
      } else {
        // Use massive backup
        const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        
        console.log(`Loading ${backup.questionCount} questions from massive backup...`);
        
        // Insert questions in batches to avoid memory issues
        const batchSize = 100;
        const totalBatches = Math.ceil(backup.questions.length / batchSize);
        
        for (let i = 0; i < totalBatches; i++) {
          const batch = backup.questions.slice(i * batchSize, (i + 1) * batchSize);
          console.log(`Inserting batch ${i + 1}/${totalBatches} (${batch.length} questions)...`);
          
          // Insert this batch
          for (const question of batch) {
            await queryClient`
              INSERT INTO trivia_questions 
              (question, options, "correctIndex", explanation, category, difficulty)
              VALUES (
                ${question.question},
                ${JSON.stringify(question.options)},
                ${question.correctIndex},
                ${question.explanation},
                ${question.category},
                ${question.difficulty}
              )
              ON CONFLICT DO NOTHING
            `;
          }
          
          console.log(`Batch ${i + 1} inserted`);
        }
      }
      
      // Count questions after loading
      const finalResult = await queryClient`SELECT COUNT(*) FROM trivia_questions`;
      const finalCount = parseInt(finalResult[0]?.count || '0');
      
      console.log(`Database now has ${finalCount} questions`);
    } else {
      console.log("Database already has sufficient questions, skipping import");
    }
    
    console.log("Database initialization complete!");
    
    // Close database connection
    await queryClient.end();
    
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("Database setup complete");
    process.exit(0);
  })
  .catch(error => {
    console.error("Database setup failed:", error);
    process.exit(1);
  });