import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import { sql } from "drizzle-orm";

// This script cleans up question titles by removing the Quiz numbering format
// to make questions look more natural and less repetitive

async function cleanupQuestionTitles() {
  try {
    console.log("Starting question titles cleanup...");
    
    // Get all questions from the database
    const allQuestions = await db.select().from(triviaQuestions);
    console.log(`Found ${allQuestions.length} questions to process`);
    
    // Process questions in batches to avoid overloading the database
    const BATCH_SIZE = 100;
    let updatedCount = 0;
    
    for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
      const batch = allQuestions.slice(i, i + BATCH_SIZE);
      let batchUpdateCount = 0;
      
      // Process each question in the batch
      for (const question of batch) {
        // Extract the question text without the Quiz numbering format
        const cleanedText = question.question.replace(/^(Cat|Animal|Bird|Marine Life|Insect|Amphibians|Big Cats|Arachnids|Reptiles|Venomous Animals|Animal Babies|Unusual Animals|Animal Migration|Animal Sleep|Animal Groups|Animal Sounds|Animal Speed|Animal Facts|Animal Anatomy|Animal Behavior|Animal Diet|Animal Abilities|Animal Adaptations|Animal Habitats|Animal Senses|Animal Strength|Cat Facts|Cat Anatomy|Cat Breeds|Cat Behavior|Cat Sounds|Cat Senses|Cat Health|Cat Genetics|Cat History|Cat Abilities|Cat Development|Cat Communication|Cat Terminology) [A-Za-z]+ #\d+: /, '');
        
        // Only update if the question text has changed
        if (cleanedText !== question.question) {
          await db.update(triviaQuestions)
            .set({ question: cleanedText })
            .where(eq(triviaQuestions.id, question.id));
          
          batchUpdateCount++;
          updatedCount++;
        }
      }
      
      console.log(`Processed batch ${i/BATCH_SIZE + 1}/${Math.ceil(allQuestions.length/BATCH_SIZE)}, updated ${batchUpdateCount} questions`);
    }
    
    console.log(`Finished cleanup! Updated ${updatedCount} questions out of ${allQuestions.length}`);
    
  } catch (error) {
    console.error("Error cleaning up question titles:", error);
  }
}

// Import required dependency
import { eq } from "drizzle-orm";

// Run the cleanup function
cleanupQuestionTitles();