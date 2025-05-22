/**
 * Script to identify and remove duplicate questions from the database
 * This uses direct SQL for better performance on large datasets
 */
import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Clean up question text by removing numbering patterns
function cleanQuestionText(question) {
  // Remove patterns like "Quiz #123:", "Question 456:", "Cat Trivia #7:" etc.
  return question.replace(/^.*?(?:Quiz|Question|Q|Trivia)\s*#?\d+\s*:?\s*/i, '');
}

async function findAndRemoveDuplicates() {
  console.log("Starting duplicate question analysis...");
  
  try {
    // Get all questions
    const { rows: allQuestions } = await pool.query('SELECT * FROM trivia_questions');
    console.log(`Found ${allQuestions.length} total questions in database`);
    
    // Step 1: Clean all question text
    console.log("Cleaning question text...");
    for (const q of allQuestions) {
      const originalText = q.question;
      const cleanedText = cleanQuestionText(originalText);
      
      if (cleanedText !== originalText) {
        await pool.query(
          'UPDATE trivia_questions SET question = $1 WHERE id = $2',
          [cleanedText, q.id]
        );
      }
    }
    console.log("Finished cleaning question text");
    
    // Step 2: Find duplicates using SQL
    console.log("Finding duplicate questions...");
    const { rows: duplicates } = await pool.query(`
      SELECT LOWER(question) as normalized_question, 
             COUNT(*) as count, 
             ARRAY_AGG(id) as question_ids
      FROM trivia_questions
      GROUP BY LOWER(question)
      HAVING COUNT(*) > 1
    `);
    
    console.log(`Found ${duplicates.length} sets of duplicate questions`);
    
    // Step 3: Keep only one question from each duplicate set
    let removedCount = 0;
    
    for (const dupSet of duplicates) {
      const questionIds = dupSet.question_ids;
      // Keep the first one, remove the rest
      const idsToRemove = questionIds.slice(1);
      
      await pool.query(
        'DELETE FROM trivia_questions WHERE id = ANY($1)',
        [idsToRemove]
      );
      
      removedCount += idsToRemove.length;
    }
    
    console.log(`Removed ${removedCount} duplicate questions`);
    
    // Step 4: Verify results
    const { rows: finalCheck } = await pool.query('SELECT COUNT(*) FROM trivia_questions');
    console.log(`Final question count: ${finalCheck[0].count}`);
    
    // Save a report of what we did
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const reportPath = path.join(dirname, '..', 'backups', 'duplicate-cleanup-report.json');
    
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      initialCount: allQuestions.length,
      duplicateSets: duplicates.length,
      questionsRemoved: removedCount,
      finalCount: parseInt(finalCheck[0].count)
    }, null, 2));
    
    console.log(`Saved report to ${reportPath}`);
    
  } catch (error) {
    console.error("Error processing duplicates:", error);
  } finally {
    await pool.end();
  }
}

// Run the script
findAndRemoveDuplicates();