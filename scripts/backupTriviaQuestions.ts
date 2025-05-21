import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import fs from 'fs';
import path from 'path';

// Function to backup all trivia questions to a JSON file
async function backupQuestions() {
  try {
    console.log("Starting database backup...");
    
    // Get all questions from the database
    const allQuestions = await db.select().from(triviaQuestions);
    
    console.log(`Found ${allQuestions.length} questions to backup`);
    
    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // Create a timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `trivia-backup-${timestamp}.json`);
    
    // Write questions to the backup file
    fs.writeFileSync(backupFile, JSON.stringify(allQuestions, null, 2));
    
    console.log(`Backup completed successfully! File saved to: ${backupFile}`);
  } catch (error) {
    console.error("Error backing up trivia questions:", error);
  } finally {
    process.exit(0);
  }
}

// Run the backup
backupQuestions();