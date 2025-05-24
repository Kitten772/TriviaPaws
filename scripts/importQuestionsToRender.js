/**
 * Script to directly import questions to your Render PostgreSQL database
 * Run this script with your DATABASE_URL to load all questions
 */

import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

// The connection string should be passed as an environment variable
// You can run this script with:
// DATABASE_URL=your_connection_string node scripts/importQuestionsToRender.js
const DATABASE_URL = process.env.DATABASE_URL;

// Function to import questions to the specified database
async function importQuestionsToRender() {
  if (!DATABASE_URL) {
    console.error("ERROR: No DATABASE_URL provided");
    console.error("Run this script with:");
    console.error("DATABASE_URL=your_connection_string node scripts/importQuestionsToRender.js");
    process.exit(1);
  }
  
  console.log("Starting import of questions to Render database...");
  console.log(`Using connection: ${DATABASE_URL.replace(/:[^:]*@/, ":****@")}`); // Hide password in logs
  
  // Connect to the database
  const sql = postgres(DATABASE_URL, {
    max: 1, // Use only one connection to avoid overloading the database
    ssl: true // Enable SSL for Render connections
  });
  
  try {
    // Create table if not exists
    console.log("Ensuring trivia_questions table exists...");
    await sql`
      CREATE TABLE IF NOT EXISTS trivia_questions (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        options JSONB NOT NULL,
        "correctIndex" INTEGER NOT NULL,
        explanation TEXT,
        category TEXT,
        difficulty TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Check if we already have questions
    const countResult = await sql`SELECT COUNT(*) FROM trivia_questions`;
    const existingCount = parseInt(countResult[0]?.count || '0');
    
    console.log(`Database currently has ${existingCount} questions`);
    
    if (existingCount >= 50000) {
      console.log("Database already has 50,000+ questions, skipping import");
      await sql.end();
      return;
    }
    
    // Load questions from our backup file
    console.log("Loading questions from backup file...");
    const backupPath = path.join('.', 'backups', 'massive-trivia-backup.json');
    
    if (!fs.existsSync(backupPath)) {
      console.error("ERROR: Backup file not found at", backupPath);
      await sql.end();
      process.exit(1);
    }
    
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`Loaded ${backup.questionCount} questions from backup`);
    
    // Insert questions in batches to avoid memory issues
    const batchSize = 50; // Smaller batches for network reliability
    const totalBatches = Math.ceil(backup.questions.length / batchSize);
    
    console.log(`Will insert questions in ${totalBatches} batches of ${batchSize}`);
    
    let insertedCount = 0;
    
    for (let i = 0; i < totalBatches; i++) {
      const batch = backup.questions.slice(i * batchSize, (i + 1) * batchSize);
      console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} questions)...`);
      
      // Use a transaction for each batch
      await sql.begin(async sql => {
        for (const question of batch) {
          try {
            await sql`
              INSERT INTO trivia_questions 
              (question, options, "correctIndex", explanation, category, difficulty)
              VALUES (
                ${question.question},
                ${JSON.stringify(question.options)}::jsonb,
                ${question.correctIndex},
                ${question.explanation},
                ${question.category},
                ${question.difficulty}
              )
              ON CONFLICT DO NOTHING
            `;
            insertedCount++;
          } catch (insertError) {
            console.error("Error inserting question:", insertError);
            console.error("Question:", question);
            // Continue with next question
          }
        }
      });
      
      console.log(`Completed batch ${i + 1}/${totalBatches}`);
      
      // Log progress after every 10 batches
      if (i % 10 === 0 || i === totalBatches - 1) {
        const currentCount = await sql`SELECT COUNT(*) FROM trivia_questions`;
        console.log(`Current database count: ${currentCount[0]?.count || '0'} questions`);
      }
    }
    
    // Final count
    const finalCount = await sql`SELECT COUNT(*) FROM trivia_questions`;
    console.log(`Import complete! Database now has ${finalCount[0]?.count || '0'} questions`);
    
    // Check difficulty and category distribution
    const difficultyStats = await sql`
      SELECT difficulty, COUNT(*) 
      FROM trivia_questions 
      GROUP BY difficulty 
      ORDER BY difficulty
    `;
    
    const categoryStats = await sql`
      SELECT 
        CASE 
          WHEN category ILIKE '%cat%' THEN 'Cat Questions'
          ELSE 'Animal Questions'
        END as category_group,
        COUNT(*)
      FROM trivia_questions
      GROUP BY category_group
    `;
    
    console.log("\nDifficulty distribution:");
    difficultyStats.forEach(row => {
      console.log(`${row.difficulty}: ${row.count}`);
    });
    
    console.log("\nCategory distribution:");
    categoryStats.forEach(row => {
      console.log(`${row.category_group}: ${row.count}`);
    });
    
  } catch (error) {
    console.error("Error importing questions:", error);
  } finally {
    // Close database connection
    await sql.end();
  }
}

// Run the import
importQuestionsToRender()
  .then(() => {
    console.log("Import script completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("Import script failed:", error);
    process.exit(1);
  });