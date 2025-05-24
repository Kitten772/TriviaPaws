/**
 * Create a smaller SQL dump file that can be easily copied/pasted
 * into the Render database console
 */

import fs from 'fs';
import path from 'path';

// Create a smaller sample of questions
async function createSmallDump() {
  console.log("Creating a smaller SQL dump file...");
  
  // Load questions from our backup file
  const backupPath = path.join('.', 'backups', 'massive-trivia-backup.json');
  
  if (!fs.existsSync(backupPath)) {
    console.error("Backup file not found at", backupPath);
    return;
  }
  
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  console.log(`Loaded ${backup.questionCount} questions from backup`);
  
  // Let's create a balanced sample of 100 questions
  // 50 cat questions (evenly distributed across difficulties)
  // 50 animal questions (evenly distributed across difficulties)
  const sampleSize = 100;
  const catQuestions = backup.questions.filter(q => 
    q.category && q.category.toLowerCase().includes('cat')
  );
  const animalQuestions = backup.questions.filter(q => 
    !q.category || !q.category.toLowerCase().includes('cat')
  );
  
  console.log(`Found ${catQuestions.length} cat questions and ${animalQuestions.length} animal questions`);
  
  // Helper function to get a balanced sample
  function getBalancedSample(questions, count) {
    const easyQuestions = questions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
    const hardQuestions = questions.filter(q => q.difficulty === 'hard');
    
    const easyCount = Math.floor(count / 3);
    const mediumCount = Math.floor(count / 3);
    const hardCount = count - easyCount - mediumCount;
    
    const sample = [
      ...easyQuestions.slice(0, easyCount),
      ...mediumQuestions.slice(0, mediumCount),
      ...hardQuestions.slice(0, hardCount)
    ];
    
    return sample;
  }
  
  // Get balanced samples
  const catSample = getBalancedSample(catQuestions, sampleSize / 2);
  const animalSample = getBalancedSample(animalQuestions, sampleSize / 2);
  
  const sample = [...catSample, ...animalSample];
  console.log(`Created sample with ${sample.length} questions`);
  
  // Create SQL table creation script
  let sql = `-- TriviaPaws Sample Questions (${sample.length} questions)
-- Run this in your Render PostgreSQL console

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  "correctIndex" INTEGER NOT NULL,
  explanation TEXT,
  category TEXT,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Begin transaction
BEGIN;

`;
  
  // Add sample questions
  for (const question of sample) {
    // Escape single quotes in strings
    const escapedQuestion = question.question.replace(/'/g, "''");
    const escapedExplanation = question.explanation ? question.explanation.replace(/'/g, "''") : '';
    const escapedCategory = question.category ? question.category.replace(/'/g, "''") : '';
    const escapedDifficulty = question.difficulty ? question.difficulty.replace(/'/g, "''") : '';
    
    // Convert options array to PostgreSQL JSONB format
    const optionsJSON = JSON.stringify(question.options).replace(/'/g, "''");
    
    sql += `INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('${escapedQuestion}', '${optionsJSON}', ${question.correctIndex}, '${escapedExplanation}', '${escapedCategory}', '${escapedDifficulty}')
ON CONFLICT DO NOTHING;\n`;
  }
  
  // Add transaction end
  sql += `
-- Commit transaction
COMMIT;

-- Verify count
SELECT COUNT(*) FROM trivia_questions;
`;
  
  // Write to file
  const outputPath = path.join('.', 'sample-questions.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`Created sample SQL file at ${outputPath}`);
  console.log(`This file contains ${sample.length} balanced questions that you can paste into the Render console`);
  
  return outputPath;
}

// Run the script
createSmallDump()
  .then(path => {
    console.log("\nTo use this file:");
    console.log("1. Go to your Render dashboard");
    console.log("2. Select your PostgreSQL database");
    console.log("3. Click on 'Shell' or 'Console'");
    console.log("4. Copy and paste the contents of the sample-questions.sql file");
    console.log("\nAfter testing with this sample, you can generate a larger file if needed");
  })
  .catch(error => {
    console.error("Error creating sample:", error);
  });