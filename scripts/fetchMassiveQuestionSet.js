/**
 * Script to fetch a massive number of trivia questions using OpenAI's API
 * The goal is to reach 50,000 unique questions without any numbering
 */

import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Load the existing questions
const existingBackupPath = path.join('./backups', 'default-trivia-backup.json');
const existingBackup = JSON.parse(fs.readFileSync(existingBackupPath, 'utf8'));
const existingQuestions = existingBackup.questions || [];

console.log(`Starting with ${existingQuestions.length} existing questions`);

// Track existing questions to avoid duplicates
const existingQuestionTexts = new Set();
for (const q of existingQuestions) {
  existingQuestionTexts.add(q.question.toLowerCase().trim());
}

// Define how many more questions we need
const targetTotal = 50000;
const currentTotal = existingQuestions.length;
const needToGenerate = targetTotal - currentTotal;

console.log(`Need to generate ${needToGenerate} more questions to reach ${targetTotal}`);

// Configuration for generation
const batchSize = 10; // Generate 10 questions per API call
const catBatchesNeeded = Math.ceil(needToGenerate / 2 / batchSize);
const animalBatchesNeeded = Math.ceil(needToGenerate / 2 / batchSize);

console.log(`Will run ${catBatchesNeeded} cat batches and ${animalBatchesNeeded} animal batches`);

// Helper function to create consistent prompts
function createPrompt(category, difficulty, batchSize) {
  const instructions = [
    "Create unique trivia questions about " + (category === 'cat' ? 'cats' : 'animals (excluding cats)'),
    "Do NOT include any numbers in the questions or answers",
    "Do NOT include any numbering in the questions (like 'Question 1:')",
    "Each question must be completely unique",
    "The questions should be interesting and educational",
    `Difficulty level: ${difficulty}`,
    "Format the response as a JSON array of objects with the following structure:",
    `[
      {
        "question": "Interesting question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Detailed explanation of the correct answer",
        "category": "${category === 'cat' ? 'Cat ' : 'Animal '}Facts",
        "difficulty": "${difficulty}"
      }
    ]`
  ];

  return instructions.join("\n\n");
}

// Function to call OpenAI and get questions
async function generateQuestions(category, difficulty, batchSize) {
  const prompt = createPrompt(category, difficulty, batchSize);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a trivia question creator specializing in creating unique, interesting, and educational questions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Extract the content from the response
    const responseContent = completion.choices[0].message.content;
    
    // Parse the JSON
    try {
      const parsedContent = JSON.parse(responseContent);
      
      if (Array.isArray(parsedContent)) {
        return parsedContent;
      } else if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
        return parsedContent.questions;
      } else {
        console.error("Unexpected response format:", parsedContent);
        return [];
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response:", responseContent);
      return [];
    }
  } catch (error) {
    console.error(`Error calling OpenAI API: ${error.message}`);
    return [];
  }
}

// Function to save questions to backup file
function saveQuestionsToBackup(questions) {
  // Combine with existing questions
  const allQuestions = [...existingQuestions, ...questions];
  
  // Update IDs to ensure they're sequential
  const updatedQuestions = allQuestions.map((q, i) => ({
    ...q,
    id: i + 1
  }));
  
  // Count cat and animal questions
  const catCount = updatedQuestions.filter(q => 
    q.category && q.category.toLowerCase().includes('cat')
  ).length;
  
  const animalCount = updatedQuestions.length - catCount;
  
  // Create updated backup object
  const updatedBackup = {
    timestamp: new Date().toISOString(),
    questionCount: updatedQuestions.length,
    catQuestionCount: catCount,
    animalQuestionCount: animalCount,
    questions: updatedQuestions
  };
  
  // Save to backup files
  fs.writeFileSync(existingBackupPath, JSON.stringify(updatedBackup, null, 2));
  console.log(`Updated backup with ${updatedQuestions.length} total questions`);
  
  // Calculate difficulty distribution
  const easyCount = updatedQuestions.filter(q => q.difficulty === "easy").length;
  const mediumCount = updatedQuestions.filter(q => q.difficulty === "medium").length;
  const hardCount = updatedQuestions.filter(q => q.difficulty === "hard").length;
  
  console.log("\nCurrent question set statistics:");
  console.log(`Total questions: ${updatedQuestions.length}`);
  console.log(`Cat questions: ${catCount}`);
  console.log(`Animal questions: ${animalCount}`);
  console.log(`\nDifficulty distribution:`);
  console.log(`Easy: ${easyCount} (${(easyCount/updatedQuestions.length*100).toFixed(1)}%)`);
  console.log(`Medium: ${mediumCount} (${(mediumCount/updatedQuestions.length*100).toFixed(1)}%)`);
  console.log(`Hard: ${hardCount} (${(hardCount/updatedQuestions.length*100).toFixed(1)}%)`);
  
  console.log(`\nProgress: ${(updatedQuestions.length/targetTotal*100).toFixed(2)}%`);
  console.log(`Remaining: ${targetTotal - updatedQuestions.length} questions`);
  
  return updatedQuestions;
}

// Main function to generate questions in batches
async function generateMassiveQuestionSet() {
  let newQuestions = [];
  let nextId = existingQuestions.length + 1;
  
  // Split work evenly between difficulties
  const difficultyLevels = ['easy', 'medium', 'hard'];
  const catBatchesPerDifficulty = Math.ceil(catBatchesNeeded / difficultyLevels.length);
  const animalBatchesPerDifficulty = Math.ceil(animalBatchesNeeded / difficultyLevels.length);
  
  console.log(`Generating ${catBatchesPerDifficulty} cat batches per difficulty level`);
  console.log(`Generating ${animalBatchesPerDifficulty} animal batches per difficulty level`);
  
  // Generate cat questions
  for (const difficulty of difficultyLevels) {
    console.log(`\nGenerating ${difficulty} cat questions...`);
    
    for (let i = 0; i < catBatchesPerDifficulty; i++) {
      console.log(`Batch ${i+1}/${catBatchesPerDifficulty} for ${difficulty} cat questions`);
      
      const questions = await generateQuestions('cat', difficulty, batchSize);
      
      // Add unique questions only
      let addedCount = 0;
      for (const q of questions) {
        if (q.question && !existingQuestionTexts.has(q.question.toLowerCase().trim())) {
          existingQuestionTexts.add(q.question.toLowerCase().trim());
          newQuestions.push({
            id: nextId++,
            ...q
          });
          addedCount++;
        }
      }
      
      console.log(`Added ${addedCount} new unique cat questions (batch ${i+1})`);
      
      // Every 5 batches, save progress
      if (i % 5 === 0 && newQuestions.length > 0) {
        existingQuestions = saveQuestionsToBackup(newQuestions);
        newQuestions = [];
        nextId = existingQuestions.length + 1;
      }
      
      // Sleep to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Generate animal questions
  for (const difficulty of difficultyLevels) {
    console.log(`\nGenerating ${difficulty} animal questions...`);
    
    for (let i = 0; i < animalBatchesPerDifficulty; i++) {
      console.log(`Batch ${i+1}/${animalBatchesPerDifficulty} for ${difficulty} animal questions`);
      
      const questions = await generateQuestions('animal', difficulty, batchSize);
      
      // Add unique questions only
      let addedCount = 0;
      for (const q of questions) {
        if (q.question && !existingQuestionTexts.has(q.question.toLowerCase().trim())) {
          existingQuestionTexts.add(q.question.toLowerCase().trim());
          newQuestions.push({
            id: nextId++,
            ...q
          });
          addedCount++;
        }
      }
      
      console.log(`Added ${addedCount} new unique animal questions (batch ${i+1})`);
      
      // Every 5 batches, save progress
      if (i % 5 === 0 && newQuestions.length > 0) {
        existingQuestions = saveQuestionsToBackup(newQuestions);
        newQuestions = [];
        nextId = existingQuestions.length + 1;
      }
      
      // Sleep to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save any remaining new questions
  if (newQuestions.length > 0) {
    saveQuestionsToBackup(newQuestions);
  }
  
  console.log("\nCompleted generating massive question set!");
}

// Run the script
generateMassiveQuestionSet().catch(error => {
  console.error("Error in main script execution:", error);
});