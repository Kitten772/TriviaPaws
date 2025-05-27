/**
 * Export all 10,000 trivia questions from local database to SQL file for Render import
 */

import { db } from './server/db.js';
import { triviaQuestions } from './shared/schema.js';
import fs from 'fs';

async function exportQuestionsForRender() {
  try {
    console.log('Exporting all questions from local database...');
    
    // Get all questions from your working local database
    const allQuestions = await db.select().from(triviaQuestions);
    
    console.log(`Found ${allQuestions.length} questions to export`);
    
    if (allQuestions.length === 0) {
      console.error('No questions found in local database!');
      return;
    }

    // Create SQL insert statements for Render
    let sqlContent = `-- Trivia Questions Export for Render Deployment
-- Generated from working local database with ${allQuestions.length} questions

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  "correctIndex" INTEGER NOT NULL,
  explanation TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  image TEXT
);

-- Clear existing data (optional - remove this line if you want to keep existing questions)
-- TRUNCATE TABLE trivia_questions RESTART IDENTITY;

-- Insert all questions
`;

    // Generate insert statements in batches for better performance
    const batchSize = 100;
    for (let i = 0; i < allQuestions.length; i += batchSize) {
      const batch = allQuestions.slice(i, i + batchSize);
      
      sqlContent += '\nINSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty, image) VALUES\n';
      
      const values = batch.map(q => {
        const question = q.question.replace(/'/g, "''"); // Escape single quotes
        const explanation = (q.explanation || '').replace(/'/g, "''");
        const category = q.category.replace(/'/g, "''");
        const difficulty = q.difficulty.replace(/'/g, "''");
        const optionsStr = `{${q.options.map(opt => `"${opt.replace(/"/g, '\\"')}"`).join(',')}}`;
        
        return `  ('${question}', '${optionsStr}', ${q.correctIndex}, '${explanation}', '${category}', '${difficulty}', NULL)`;
      });
      
      sqlContent += values.join(',\n') + ';\n';
    }

    // Add final verification query
    sqlContent += `\n-- Verify the import
SELECT 
  difficulty,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trivia_questions), 1) as percentage
FROM trivia_questions 
GROUP BY difficulty 
ORDER BY difficulty;

SELECT COUNT(*) as total_questions FROM trivia_questions;
`;

    // Write to file
    const filename = 'render-trivia-questions.sql';
    fs.writeFileSync(filename, sqlContent);
    
    console.log(`✅ Successfully exported ${allQuestions.length} questions to ${filename}`);
    console.log('\nNext steps:');
    console.log('1. Copy the contents of render-trivia-questions.sql');
    console.log('2. Go to your Render database console');
    console.log('3. Paste and run the SQL to import all questions');
    console.log('4. Redeploy your application');
    console.log('\nYour triviapaws.onrender.com will then have all 10,000 questions!');

    // Show distribution summary
    const easy = allQuestions.filter(q => q.difficulty === 'easy').length;
    const medium = allQuestions.filter(q => q.difficulty === 'medium').length;
    const hard = allQuestions.filter(q => q.difficulty === 'hard').length;
    
    console.log(`\nQuestion distribution:`);
    console.log(`Easy: ${easy} (${(easy/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${medium} (${(medium/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hard} (${(hard/allQuestions.length*100).toFixed(1)}%)`);

  } catch (error) {
    console.error('Error exporting questions:', error);
  }
}

exportQuestionsForRender();