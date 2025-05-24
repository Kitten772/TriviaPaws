/**
 * Script to generate a massive backup file with 50,000 trivia questions
 * (25,000 cat questions and 25,000 animal questions)
 * This creates a backup file that can be loaded into the database with restoreTriviaQuestions.ts
 */

import fs from 'fs';
import path from 'path';

// Function to generate variations of questions using templates
function generateQuestionVariations(templates, count, difficulty, category) {
  const questions = [];
  const seenQuestions = new Set();
  
  // For cat questions
  const catSubjects = ["domestic cats", "wild cats", "cat behavior", "cat anatomy", "feline senses", 
    "different cat breeds", "cat health", "cat diet", "cat history", "cat intelligence"];
  
  const catVerbs = ["purr", "hunt", "groom themselves", "communicate", "play", "sleep",
    "mark territory", "show affection", "use their whiskers", "climb trees"];
  
  const catTraits = ["retractable claws", "night vision", "sensitive whiskers", "flexible spine",
    "rough tongue", "acute hearing", "silent movement", "independent nature", "territorial behavior"];
  
  // For animal questions
  const animalSubjects = ["mammals", "reptiles", "birds", "fish", "amphibians", "insects",
    "marine life", "desert animals", "forest dwellers", "endangered species"];
  
  const animalVerbs = ["communicate", "hunt", "defend themselves", "attract mates", "migrate",
    "hibernate", "camouflage", "build homes", "store food", "raise their young"];
  
  const animalTraits = ["incredible speed", "remarkable strength", "unique coloration", "specialized diet",
    "advanced senses", "unusual adaptations", "complex social structures", "exceptional intelligence"];
  
  const animalHabitats = ["desert", "rainforest", "arctic", "ocean", "mountains",
    "grasslands", "wetlands", "caves", "islands", "urban environments"];
  
  // Generate variations until we reach the count
  while (questions.length < count) {
    // Pick a random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders with appropriate values
    let questionText = template;
    
    // For cat questions
    if (category.includes("Cat")) {
      questionText = questionText
        .replace(/%subject%/g, () => catSubjects[Math.floor(Math.random() * catSubjects.length)])
        .replace(/%verb%/g, () => catVerbs[Math.floor(Math.random() * catVerbs.length)])
        .replace(/%trait%/g, () => catTraits[Math.floor(Math.random() * catTraits.length)]);
    } 
    // For animal questions
    else {
      questionText = questionText
        .replace(/%subject%/g, () => animalSubjects[Math.floor(Math.random() * animalSubjects.length)])
        .replace(/%verb%/g, () => animalVerbs[Math.floor(Math.random() * animalVerbs.length)])
        .replace(/%trait%/g, () => animalTraits[Math.floor(Math.random() * animalTraits.length)])
        .replace(/%habitat%/g, () => animalHabitats[Math.floor(Math.random() * animalHabitats.length)]);
    }
    
    // Check if this question is unique
    if (!seenQuestions.has(questionText.toLowerCase())) {
      seenQuestions.add(questionText.toLowerCase());
      
      // Generate options, correct answer, and explanation
      const question = generateGenericQuestion(questionText, category, difficulty);
      questions.push(question);
      
      // Log progress periodically
      if (questions.length % 1000 === 0) {
        console.log(`Generated ${questions.length} ${category} questions (${difficulty} difficulty)`);
      }
    }
  }
  
  return questions;
}

// Function to create a question with options and explanation
function generateGenericQuestion(questionText, category, difficulty) {
  // Generate appropriate options
  let options = [];
  let correctIndex = Math.floor(Math.random() * 4);
  let explanation = "";
  
  if (category.includes("Cat")) {
    if (questionText.includes("breed")) {
      options = ["Siamese", "Persian", "Maine Coon", "Scottish Fold"];
      explanation = `Different cat breeds have distinct characteristics, with the ${options[correctIndex]} being particularly known for this trait.`;
    } 
    else if (questionText.includes("behavior") || questionText.includes("purr")) {
      options = ["It's a form of communication", "It helps them heal injuries", "It calms nearby kittens", "It's a leftover hunting instinct"];
      explanation = `Cat purring serves multiple purposes, but primarily ${options[correctIndex].toLowerCase()}.`;
    }
    else {
      // Generic cat options
      options = [
        "To help with hunting prey",
        "For communication with other cats",
        "As a defense mechanism",
        "For temperature regulation"
      ];
      explanation = `This aspect of cat biology primarily serves ${options[correctIndex].toLowerCase()}, which has evolved over thousands of years.`;
    }
  } 
  else { // Animal questions
    if (questionText.includes("habitat")) {
      options = ["Specialized body structure", "Unique metabolic processes", "Behavioral adaptations", "Symbiotic relationships"];
      explanation = `Animals survive in challenging environments through ${options[correctIndex].toLowerCase()}, which gives them advantages in their natural habitat.`;
    }
    else if (questionText.includes("fastest") || questionText.includes("largest")) {
      options = ["Cheetah", "Blue whale", "Peregrine falcon", "Elephant"];
      explanation = `The ${options[correctIndex]} holds this distinction among animals, which is a result of evolutionary adaptations.`;
    }
    else {
      // Generic animal options
      options = [
        "Through evolutionary adaptation",
        "By specialized body systems",
        "Using instinctive behaviors",
        "With cooperative social structures"
      ];
      explanation = `This is achieved ${options[correctIndex].toLowerCase()}, which has developed over millions of years of natural selection.`;
    }
  }
  
  return {
    question: questionText,
    options: options,
    correctIndex: correctIndex,
    explanation: explanation,
    category: category,
    difficulty: difficulty
  };
}

// Main function to generate the massive backup
async function generateMassiveBackup() {
  try {
    console.log("Starting massive backup generation...");
    
    // Set up question templates
    const catTemplates = [
      "What is unique about %subject%?",
      "Why do cats %verb%?",
      "How do cats use their %trait%?",
      "Which cat breed is known for %trait%?",
      "What purpose does %verb% serve for cats?",
      "How can humans interpret when cats %verb%?",
      "What's the main reason cats %verb% in the wild?",
      "Which aspect of %subject% is most important for cat survival?",
      "How has %subject% evolved in domestic cats?",
      "What happens physiologically when cats %verb%?"
    ];
    
    const animalTemplates = [
      "How do %subject% %verb% differently than other animals?",
      "What advantage does %trait% give to animals in %habitat%?",
      "Which animal has the most remarkable %trait%?",
      "How do animals in %habitat% adapt to survive?",
      "What's the evolutionary purpose of %trait% in certain animals?",
      "How do scientists explain why some animals %verb%?",
      "Which species has the most unusual way to %verb%?",
      "What makes %subject% unique compared to other animal groups?",
      "How do animals use %trait% to their advantage?",
      "What's the main reason certain animals %verb% seasonally?"
    ];
    
    // Define counts and difficulty distribution
    const totalQuestions = 50000;
    const catQuestions = totalQuestions / 2;
    const animalQuestions = totalQuestions / 2;
    
    // Generate equal numbers for each difficulty level
    const difficultyLevels = ["easy", "medium", "hard"];
    const questionsPerCategoryPerDifficulty = catQuestions / difficultyLevels.length;
    
    console.log(`Generating ${totalQuestions} total questions (${catQuestions} cat, ${animalQuestions} animal)`);
    console.log(`Each category will have ${questionsPerCategoryPerDifficulty} questions per difficulty level`);
    
    let allQuestions = [];
    
    // Generate cat questions with equal distribution across difficulties
    for (const difficulty of difficultyLevels) {
      console.log(`Generating ${questionsPerCategoryPerDifficulty} cat questions with ${difficulty} difficulty...`);
      const catQuestionsForDifficulty = generateQuestionVariations(
        catTemplates, 
        questionsPerCategoryPerDifficulty, 
        difficulty,
        "Cat Facts"
      );
      allQuestions = allQuestions.concat(catQuestionsForDifficulty);
    }
    
    // Generate animal questions with equal distribution across difficulties
    for (const difficulty of difficultyLevels) {
      console.log(`Generating ${questionsPerCategoryPerDifficulty} animal questions with ${difficulty} difficulty...`);
      const animalQuestionsForDifficulty = generateQuestionVariations(
        animalTemplates, 
        questionsPerCategoryPerDifficulty, 
        difficulty,
        "Animal Facts"
      );
      allQuestions = allQuestions.concat(animalQuestionsForDifficulty);
    }
    
    // Assign IDs
    allQuestions = allQuestions.map((q, index) => ({
      id: index + 1,
      ...q
    }));
    
    console.log(`Total questions generated: ${allQuestions.length}`);
    
    // Calculate statistics
    const catCount = allQuestions.filter(q => q.category.includes("Cat")).length;
    const animalCount = allQuestions.filter(q => q.category.includes("Animal")).length;
    
    const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nFinal question set statistics:");
    console.log(`Total questions: ${allQuestions.length}`);
    console.log(`Cat questions: ${catCount} (${(catCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Animal questions: ${animalCount} (${(animalCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/allQuestions.length*100).toFixed(1)}%)`);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      questionCount: allQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: allQuestions
    };
    
    // Save the backup
    const backupsDir = path.join('.', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const backupPath = path.join(backupsDir, 'massive-trivia-backup.json');
    console.log(`Saving backup to ${backupPath}...`);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    // Also save as default backup
    const defaultBackupPath = path.join(backupsDir, 'default-trivia-backup.json');
    console.log(`Saving as default backup to ${defaultBackupPath}...`);
    fs.writeFileSync(defaultBackupPath, JSON.stringify(backup, null, 2));
    
    console.log("Backup generation complete!");
    
    return backup;
  } catch (error) {
    console.error("Error generating massive backup:", error);
    throw error;
  }
}

// Run the script
generateMassiveBackup().then(() => {
  console.log("Script execution complete!");
}).catch(error => {
  console.error("Script failed:", error);
});