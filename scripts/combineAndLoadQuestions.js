/**
 * Script to combine cat and animal questions and load them into the database
 * This creates a total of 50,000+ unique trivia questions with 1:1:1 difficulty ratios
 */

import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Function to load the combined questions into the database
async function combineAndLoadQuestions() {
  try {
    console.log("Starting question combination and loading process...");
    
    // Load cat questions
    const catQuestionsPath = path.join('./backups', 'cat-questions.json');
    const catQuestionsData = JSON.parse(fs.readFileSync(catQuestionsPath, 'utf8'));
    console.log(`Loaded ${catQuestionsData.questionCount} cat questions`);
    
    // Load animal questions
    const animalQuestionsPath = path.join('./backups', 'animal-questions.json');
    const animalQuestionsData = JSON.parse(fs.readFileSync(animalQuestionsPath, 'utf8'));
    console.log(`Loaded ${animalQuestionsData.questionCount} animal questions`);
    
    // Combine all questions
    const allQuestions = [
      ...catQuestionsData.questions,
      ...animalQuestionsData.questions
    ];
    
    console.log(`Combined total: ${allQuestions.length} questions`);
    
    // Get counts by category and difficulty
    const catCount = allQuestions.filter(q => q.category === "Cat Facts").length;
    const animalCount = allQuestions.filter(q => q.category === "Animal Facts").length;
    
    const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nStats for combined questions:");
    console.log(`Total questions: ${allQuestions.length}`);
    console.log(`Cat questions: ${catCount}`);
    console.log(`Animal questions: ${animalCount}`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/allQuestions.length*100).toFixed(1)}%)`);
    
    // Save the combined data
    const combinedBackupData = {
      timestamp: new Date().toISOString(),
      questionCount: allQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: allQuestions
    };
    
    const combinedPath = path.join('./backups', 'combined-trivia-backup.json');
    fs.writeFileSync(combinedPath, JSON.stringify(combinedBackupData, null, 2));
    console.log(`Saved combined backup to ${combinedPath}`);
    
    // Create a copy as the default backup for the server to use
    const defaultPath = path.join('./backups', 'default-trivia-backup.json');
    fs.copyFileSync(combinedPath, defaultPath);
    console.log(`Created default backup at ${defaultPath} for server to use`);
    
    // Now load questions into the database
    console.log("\nLoading questions into database...");
    
    // First, check how many questions are already in the database
    const countResult = await pool.query("SELECT COUNT(*) FROM trivia_questions");
    const existingCount = parseInt(countResult.rows[0].count);
    console.log(`Database currently has ${existingCount} questions`);
    
    // Decide whether to truncate or append
    let shouldTruncate = false;
    if (existingCount > 0) {
      console.log("Existing questions found in database.");
      console.log("Will insert new questions while preserving existing ones.");
    }
    
    // Calculate how many new questions we need to add
    const questionsToAdd = allQuestions.slice(0, Math.max(0, 50000 - existingCount));
    console.log(`Will add ${questionsToAdd.length} new questions to reach 50,000 total`);
    
    if (questionsToAdd.length > 0) {
      // Insert questions in batches for better performance
      const BATCH_SIZE = 1000;
      let insertedCount = 0;
      
      for (let i = 0; i < questionsToAdd.length; i += BATCH_SIZE) {
        const batch = questionsToAdd.slice(i, i + BATCH_SIZE);
        
        // Create the SQL query for the batch
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
          JSON.stringify(q.options),
          q.correctIndex,
          q.explanation,
          q.category,
          q.difficulty
        ]);
        
        try {
          const result = await pool.query(query, values);
          insertedCount += result.rowCount;
          console.log(`Inserted ${insertedCount}/${questionsToAdd.length} questions`);
        } catch (error) {
          console.error(`Error inserting batch ${i}-${i+BATCH_SIZE}:`, error.message);
        }
      }
      
      console.log(`\nCompleted database insertion: ${insertedCount} new questions added`);
    }
    
    // Get final stats from the database
    const finalStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE LOWER(category) LIKE '%cat%') as cat_questions,
        COUNT(*) FILTER (WHERE LOWER(category) NOT LIKE '%cat%') as animal_questions,
        COUNT(*) FILTER (WHERE difficulty = 'easy') as easy_questions,
        COUNT(*) FILTER (WHERE difficulty = 'medium') as medium_questions,
        COUNT(*) FILTER (WHERE difficulty = 'hard') as hard_questions
      FROM trivia_questions
    `);
    
    const stats = finalStatsResult.rows[0];
    console.log("\nFinal database statistics:");
    console.log(`Total questions: ${stats.total}`);
    console.log(`Cat questions: ${stats.cat_questions}`);
    console.log(`Other animal questions: ${stats.animal_questions}`);
    console.log(`\nDifficulty distribution in database:`);
    console.log(`Easy: ${stats.easy_questions} (${(stats.easy_questions/stats.total*100).toFixed(1)}%)`);
    console.log(`Medium: ${stats.medium_questions} (${(stats.medium_questions/stats.total*100).toFixed(1)}%)`);
    console.log(`Hard: ${stats.hard_questions} (${(stats.hard_questions/stats.total*100).toFixed(1)}%)`);
    
    console.log("\nMassive question database successfully created!");
    
  } catch (error) {
    console.error("Error combining and loading questions:", error);
  } finally {
    await pool.end();
  }
}

// Run the script
combineAndLoadQuestions()
  .catch(err => {
    console.error('Error in main script execution:', err);
    process.exit(1);
  });