import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import fs from 'fs';
import path from 'path';

// Function to restore trivia questions from a backup file
async function restoreQuestions(backupFile?: string) {
  try {
    console.log("Starting database restoration...");
    
    // If no specific backup file is provided, find the most recent one
    if (!backupFile) {
      const backupDir = path.join(process.cwd(), 'backups');
      
      if (!fs.existsSync(backupDir)) {
        console.error("No backups directory found!");
        return;
      }
      
      const backupFiles = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('trivia-backup-') && file.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first
      
      if (backupFiles.length === 0) {
        console.error("No backup files found!");
        return;
      }
      
      backupFile = path.join(backupDir, backupFiles[0]);
      console.log(`Using most recent backup file: ${backupFiles[0]}`);
    }
    
    // Read the backup file
    if (!fs.existsSync(backupFile)) {
      console.error(`Backup file not found: ${backupFile}`);
      return;
    }
    
    const backupData = fs.readFileSync(backupFile, 'utf8');
    const questions = JSON.parse(backupData);
    
    console.log(`Found ${questions.length} questions to restore`);
    
    // Check if we need to clear existing questions first
    const existingCount = await db.select({ count: sql`count(*)` }).from(triviaQuestions);
    if (existingCount[0].count > 0) {
      const shouldClear = process.argv.includes('--clear');
      
      if (shouldClear) {
        console.log("Clearing existing questions...");
        await db.delete(triviaQuestions);
      } else {
        console.log("Adding to existing questions (use --clear to replace instead)");
      }
    }
    
    // Insert in batches to avoid overloading the database
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      // Remove any database-specific fields that might cause issues
      const cleanBatch = batch.map(q => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        category: q.category,
        difficulty: q.difficulty,
        image: q.image
      }));
      
      await db.insert(triviaQuestions).values(cleanBatch);
      inserted += batch.length;
      console.log(`Restored ${inserted}/${questions.length} questions`);
    }
    
    console.log("Restoration completed successfully!");
  } catch (error) {
    console.error("Error restoring trivia questions:", error);
  } finally {
    process.exit(0);
  }
}

// Get backup file from command line argument or use the most recent
const backupFile = process.argv[2] && !process.argv[2].startsWith('--') 
  ? process.argv[2] 
  : undefined;

// Run the restoration
restoreQuestions(backupFile);