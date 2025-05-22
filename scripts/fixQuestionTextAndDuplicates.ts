/**
 * Script to process questions, removing numbering and prevent duplicates
 */
import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import { eq, sql } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

// Clean up question text by removing numbering patterns
function cleanQuestionText(question: string): string {
  // Remove patterns like "Quiz #123:", "Question 456:", "Cat Trivia #7:" etc.
  return question.replace(/^.*?(?:Quiz|Question|Q|Trivia)\s*#?\d+\s*:?\s*/i, '');
}

async function processQuestions() {
  console.log("Starting question processing...");
  
  try {
    // Get all questions
    const allQuestions = await db.select().from(triviaQuestions);
    console.log(`Found ${allQuestions.length} total questions`);
    
    // Track questions we've processed
    const processedQuestions = new Map();
    const duplicates = [];
    const updated = [];
    
    // First pass - identify duplicates and questions needing cleanup
    for (const question of allQuestions) {
      // Clean up the question text
      const cleanedText = cleanQuestionText(question.question);
      const hasChanged = cleanedText !== question.question;
      
      // Check for duplicates (using cleaned text)
      const key = cleanedText.toLowerCase();
      
      if (processedQuestions.has(key)) {
        // This is a duplicate
        duplicates.push({
          id: question.id,
          originalQuestion: question.question, 
          cleanedQuestion: cleanedText,
          duplicate_of: processedQuestions.get(key)
        });
      } else {
        // First time seeing this question
        processedQuestions.set(key, question.id);
        
        // If question text needed cleaning, add to update list
        if (hasChanged) {
          updated.push({
            id: question.id,
            originalQuestion: question.question,
            cleanedQuestion: cleanedText
          });
        }
      }
    }
    
    console.log(`Found ${duplicates.length} duplicate questions`);
    console.log(`Found ${updated.length} questions needing text cleanup`);
    
    // Process updates in batches
    const BATCH_SIZE = 100;
    let processedCount = 0;
    
    // Update questions needing text cleanup
    for (let i = 0; i < updated.length; i += BATCH_SIZE) {
      const batch = updated.slice(i, i + BATCH_SIZE);
      
      for (const item of batch) {
        await db.update(triviaQuestions)
          .set({ question: item.cleanedQuestion })
          .where(eq(triviaQuestions.id, item.id));
      }
      
      processedCount += batch.length;
      console.log(`Updated ${processedCount}/${updated.length} questions`);
    }
    
    // Save report of duplicates
    const reportPath = path.join(process.cwd(), 'backups/duplicate-questions.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalQuestions: allQuestions.length,
      duplicatesFound: duplicates.length,
      questionsUpdated: updated.length,
      duplicates: duplicates
    }, null, 2));
    
    console.log(`Question processing complete! Report saved to ${reportPath}`);
  } catch (error) {
    console.error("Error processing questions:", error);
  }
}

// Run the script
processQuestions();