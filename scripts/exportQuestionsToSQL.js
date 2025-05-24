/**
 * Script to export all 50,000 trivia questions to a SQL file that can be imported into PostgreSQL
 * This creates a file you can run directly on your Render database
 */

import fs from 'fs';
import path from 'path';

// Load the questions from our backup file
async function exportQuestionsToSQL() {
  console.log("Starting export of questions to SQL format...");
  
  try {
    // Load questions from our backup file
    const backupPath = path.join('.', 'backups', 'massive-trivia-backup.json');
    
    if (!fs.existsSync(backupPath)) {
      console.log("Massive backup not found, using default backup...");
      const defaultBackupPath = path.join('.', 'backups', 'default-trivia-backup.json');
      
      if (!fs.existsSync(defaultBackupPath)) {
        throw new Error("No backup file found to export questions from");
      }
      
      // Use default backup
      const backup = JSON.parse(fs.readFileSync(defaultBackupPath, 'utf8'));
      console.log(`Loaded ${backup.questionCount} questions from default backup`);
      
      // Generate SQL file
      return generateSQLFile(backup.questions, 'default-trivia-questions.sql');
    }
    
    // Use massive backup
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`Loaded ${backup.questionCount} questions from massive backup`);
    
    // Generate SQL file
    return generateSQLFile(backup.questions, 'massive-trivia-questions.sql');
  } catch (error) {
    console.error("Error exporting questions:", error);
    throw error;
  }
}

// Function to generate SQL file from questions
function generateSQLFile(questions, filename) {
  console.log(`Generating SQL file with ${questions.length} questions...`);
  
  // Create SQL header with table creation if not exists
  let sql = `-- TriviaPaws Trivia Questions SQL Import File
-- Generated: ${new Date().toISOString()}
-- Questions: ${questions.length}

-- Ensure the table exists
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

-- Begin insert statements
`;

  // Add insert statements for each question
  // Process in batches to avoid memory issues with huge files
  const batchSize = 100;
  const totalBatches = Math.ceil(questions.length / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const batch = questions.slice(i * batchSize, (i + 1) * batchSize);
    console.log(`Processing batch ${i + 1}/${totalBatches} (${batch.length} questions)...`);
    
    // Add a transaction for each batch
    sql += `
-- Batch ${i + 1}/${totalBatches}
BEGIN;
`;
    
    // Add each question in the batch
    for (const question of batch) {
      // Escape single quotes in strings
      const escapedQuestion = question.question.replace(/'/g, "''");
      const escapedExplanation = question.explanation ? question.explanation.replace(/'/g, "''") : '';
      const escapedCategory = question.category ? question.category.replace(/'/g, "''") : '';
      const escapedDifficulty = question.difficulty ? question.difficulty.replace(/'/g, "''") : '';
      
      // Convert options array to PostgreSQL JSONB format
      const optionsJSON = JSON.stringify(question.options).replace(/'/g, "''");
      
      sql += `INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('${escapedQuestion}', '${optionsJSON}', ${question.correctIndex}, '${escapedExplanation}', '${escapedCategory}', '${escapedDifficulty}')
ON CONFLICT DO NOTHING;
`;
    }
    
    // End transaction for this batch
    sql += `COMMIT;

`;
  }
  
  // Add SQL footer with confirmation
  sql += `
-- End of import file
-- Verify count after import with: SELECT COUNT(*) FROM trivia_questions;
`;
  
  // Write SQL file
  const outputPath = path.join('.', filename);
  fs.writeFileSync(outputPath, sql);
  
  console.log(`SQL file generated successfully: ${outputPath}`);
  console.log(`File contains ${questions.length} question inserts in ${totalBatches} batches`);
  
  return outputPath;
}

// Run the export
exportQuestionsToSQL()
  .then(outputPath => {
    console.log(`\nExport complete!\n`);
    console.log(`To import these questions into your Render PostgreSQL database:`);
    console.log(`1. Download the SQL file: ${outputPath}`);
    console.log(`2. Go to your Render dashboard and select your PostgreSQL database`);
    console.log(`3. In the "Connections" tab, find the "External Connection" details`);
    console.log(`4. Use psql or another PostgreSQL client to connect using those details`);
    console.log(`5. Run: \\i path/to/${path.basename(outputPath)}`);
    console.log(`\nAlternatively, you can copy portions of the SQL file and run them`);
    console.log(`in the Render database's console interface if available.`);
  })
  .catch(error => {
    console.error("Export failed:", error);
  });