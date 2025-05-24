/**
 * Enhanced script to detect and remove duplicate questions
 * This creates a clean, unique question set for the game
 */

import fs from 'fs';
import path from 'path';

// Helper function to normalize question text for comparison
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\d+/g, '') // Remove all numbers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .trim();
}

// Main function to remove duplicates
async function removeDuplicates() {
  try {
    console.log("Starting enhanced duplicate removal process...");
    
    // Load the existing questions
    const backupPath = path.join('./backups', 'default-trivia-backup.json');
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const questions = backup.questions || [];
    
    console.log(`Loaded ${questions.length} questions to process`);
    
    // Track questions by their normalized text
    const uniqueQuestions = new Map();
    const duplicates = [];
    
    // First pass: Identify duplicates
    for (const q of questions) {
      const normalizedQuestion = normalizeText(q.question);
      
      if (uniqueQuestions.has(normalizedQuestion)) {
        duplicates.push({
          id: q.id,
          originalQuestion: q.question,
          normalizedQuestion,
          duplicateOf: uniqueQuestions.get(normalizedQuestion).id
        });
      } else {
        uniqueQuestions.set(normalizedQuestion, q);
      }
    }
    
    console.log(`Found ${duplicates.length} duplicate questions`);
    
    if (duplicates.length > 0) {
      console.log("Duplicate examples:");
      duplicates.slice(0, 5).forEach(d => {
        console.log(`- ${d.originalQuestion} (duplicate of question ID ${d.duplicateOf})`);
      });
    }
    
    // Create a new array with only unique questions
    const cleanedQuestions = Array.from(uniqueQuestions.values());
    
    // Re-index the questions
    const reindexedQuestions = cleanedQuestions.map((q, index) => ({
      ...q,
      id: index + 1
    }));
    
    console.log(`Kept ${reindexedQuestions.length} unique questions`);
    
    // Count cat and animal questions
    const catCount = reindexedQuestions.filter(q => 
      q.category && q.category.toLowerCase().includes('cat')
    ).length;
    
    const animalCount = reindexedQuestions.length - catCount;
    
    // Create updated backup
    const cleanedBackup = {
      timestamp: new Date().toISOString(),
      questionCount: reindexedQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: reindexedQuestions
    };
    
    // Calculate difficulty distribution
    const easyCount = reindexedQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = reindexedQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = reindexedQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nCleaned question set statistics:");
    console.log(`Total questions: ${reindexedQuestions.length}`);
    console.log(`Cat questions: ${catCount}`);
    console.log(`Animal questions: ${animalCount}`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/reindexedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/reindexedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/reindexedQuestions.length*100).toFixed(1)}%)`);
    
    // Save the cleaned backup
    const cleanedBackupPath = path.join('./backups', 'cleaned-trivia-backup.json');
    fs.writeFileSync(cleanedBackupPath, JSON.stringify(cleanedBackup, null, 2));
    console.log(`Saved cleaned backup to ${cleanedBackupPath}`);
    
    // Update the default backup
    fs.writeFileSync(backupPath, JSON.stringify(cleanedBackup, null, 2));
    console.log(`Updated default backup with cleaned questions`);
    
    return cleanedBackup;
    
  } catch (error) {
    console.error("Error removing duplicates:", error);
  }
}

// Run the script
removeDuplicates().catch(error => {
  console.error("Error in main script execution:", error);
});