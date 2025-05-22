/**
 * Script to clean up question labels and numbering in the database
 * This will process all questions and remove any numbering prefixes
 */
import { createClient } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Pattern to remove from questions
const QUESTION_PREFIX_PATTERN = /^.*?(?:Quiz|Question|Q|Trivia)\s*#?\d+\s*:?\s*/i;

async function cleanQuestionLabels() {
  console.log('Starting question cleanup process...');
  
  try {
    // Connect to database
    const sql = createClient(process.env.DATABASE_URL);
    
    // Get all questions from the database
    console.log('Retrieving all questions from database...');
    const result = await sql`SELECT * FROM trivia_questions`;
    console.log(`Found ${result.length} questions in the database`);
    
    // Process questions to remove numbering
    let updatedCount = 0;
    
    for (const question of result) {
      const originalText = question.question;
      const cleanedText = originalText.replace(QUESTION_PREFIX_PATTERN, '');
      
      // Only update if the text has changed
      if (cleanedText !== originalText) {
        await sql`
          UPDATE trivia_questions 
          SET question = ${cleanedText} 
          WHERE id = ${question.id}
        `;
        updatedCount++;
        
        // Log progress every 100 questions
        if (updatedCount % 100 === 0) {
          console.log(`Processed ${updatedCount} questions so far`);
        }
      }
    }
    
    console.log(`Completed! Updated ${updatedCount} questions in the database`);
    
    // Create a backup of the cleaned data
    console.log('Creating backup of cleaned questions...');
    const cleanedQuestions = await sql`SELECT * FROM trivia_questions`;
    
    const backupData = {
      timestamp: new Date().toISOString(),
      questionCount: cleanedQuestions.length,
      questions: cleanedQuestions
    };
    
    const backupPath = path.join(process.cwd(), 'backups/processed/cleaned-questions.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    
    console.log(`Backup created at ${backupPath}`);
    
  } catch (error) {
    console.error('Error cleaning questions:', error);
  }
}

// Run the cleanup
cleanQuestionLabels();