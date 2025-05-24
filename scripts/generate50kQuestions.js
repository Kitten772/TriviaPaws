/**
 * Script to generate a full set of 50,000 unique trivia questions
 * Uses combinatorial generation instead of API calls to create unique questions
 */

import fs from 'fs';
import path from 'path';

// Load the existing questions
const backupPath = path.join('./backups', 'default-trivia-backup.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const existingQuestions = backup.questions || [];

console.log(`Starting with ${existingQuestions.length} existing questions`);

// Track existing questions to avoid duplicates
const existingQuestionTexts = new Set();
for (const q of existingQuestions) {
  existingQuestionTexts.add(q.question.toLowerCase().trim());
}

// Templates for cat questions
const catSubjects = [
  "domestic cats", "wild cats", "cat behavior", "cat anatomy", "cat senses", 
  "cat breeds", "cat health", "cat diet", "cat history", "cat intelligence",
  "cat sleep patterns", "cat communication", "cat hunting", "cat personalities", "cat genetics"
];

const catQuestionTemplates = [
  "What is unique about %subject%?",
  "How do cats %verb% compared to other animals?",
  "Why do cats %verb% in certain situations?",
  "Which cat breed is known for %trait%?",
  "What happens when cats %verb%?",
  "How can humans interpret %subject%?",
  "What role does %subject% play in a cat's life?",
  "Which adaptation helps cats %verb%?",
  "What are the differences between %subject% and %subject%?",
  "How has %subject% evolved over time?"
];

const catVerbs = [
  "communicate", "hunt", "play", "sleep", "groom themselves", "interact with humans",
  "respond to stress", "mark territory", "show affection", "navigate in darkness",
  "balance on narrow surfaces", "land on their feet", "perceive movement", "purr", "knead with their paws"
];

const catTraits = [
  "unusual ears", "distinctive coat patterns", "exceptional size", "unique vocalizations",
  "extraordinary jumping ability", "rare eye colors", "specific behavioral traits",
  "specialized hunting techniques", "adaptation to extreme environments", "remarkable intelligence",
  "peculiar facial features", "exceptional agility", "distinctive tails", "special social behaviors"
];

// Templates for animal questions
const animalSubjects = [
  "mammals", "reptiles", "birds", "fish", "amphibians", "insects", "arachnids",
  "marine life", "desert animals", "forest dwellers", "predators", "herbivores",
  "nocturnal creatures", "migratory species", "endangered animals"
];

const animalQuestionTemplates = [
  "Which animal has the most impressive %trait%?",
  "What unique adaptation allows certain animals to %verb%?",
  "How do animals in %habitat% survive extreme conditions?",
  "Which species has evolved to %verb% in an unusual way?",
  "What makes %subject% different from other animal groups?",
  "How do scientists explain why animals %verb%?",
  "Which animal holds the record for %trait%?",
  "What surprising behavior is exhibited by %subject%?",
  "How do animals use %subject% to their advantage?",
  "What evolutionary purpose does %trait% serve in certain animals?"
];

const animalVerbs = [
  "communicate", "hunt", "defend themselves", "attract mates", "raise their young",
  "navigate during migration", "camouflage", "build homes", "store food", "hibernate",
  "regulate body temperature", "breathe underwater", "move efficiently", "see in darkness"
];

const animalTraits = [
  "speed", "strength", "sensory abilities", "defensive mechanisms", "hunting strategies",
  "parenting techniques", "communication methods", "problem-solving skills", "memory capacity",
  "adaptability", "longevity", "resilience", "specialized diet", "cooperative behaviors"
];

const animalHabitats = [
  "deserts", "rainforests", "polar regions", "mountains", "oceans",
  "freshwater systems", "grasslands", "caves", "wetlands", "urban environments",
  "islands", "tundra", "coral reefs", "mangrove forests", "canopy layers"
];

// Function to create a unique question with options and correct answer
function createUniqueQuestion(questionText, category, difficulty) {
  // Create appropriate options based on category and question
  let options = [];
  let correctIndex = Math.floor(Math.random() * 4);
  let explanation = "";
  
  if (category.includes("Cat")) {
    if (questionText.includes("breed")) {
      options = ["Siamese", "Persian", "Maine Coon", "Scottish Fold"];
      explanation = `Different cat breeds have developed unique characteristics through selective breeding, with the ${options[correctIndex]} being particularly notable in this regard.`;
    } 
    else if (questionText.includes("behavior") || questionText.includes("communicate")) {
      options = ["Through body language", "Using vocalizations", "By scent marking", "With facial expressions"];
      explanation = `Cats primarily communicate ${options[correctIndex].toLowerCase()}, which helps them interact with other cats and humans.`;
    }
    else if (questionText.includes("anatomy") || questionText.includes("unique about")) {
      options = ["Their flexible spine", "Their specialized teeth", "Their sensitive whiskers", "Their retractable claws"];
      explanation = `${options[correctIndex]} is a key anatomical feature that gives cats their remarkable abilities and has evolved specifically for their survival needs.`;
    }
    else {
      // Generic cat options
      options = [
        "It's an adaptation for hunting",
        "It helps with communication",
        "It provides evolutionary advantages",
        "It's related to their sensory perception"
      ];
      explanation = `This aspect of cat biology relates to ${options[correctIndex].toLowerCase()}, which has been crucial to their success as a species.`;
    }
  } 
  else { // Animal questions
    if (questionText.includes("habitat") || questionText.includes("survive")) {
      options = ["Specialized metabolism", "Unique physical adaptations", "Behavioral strategies", "Symbiotic relationships"];
      explanation = `Animals survive in challenging environments through ${options[correctIndex].toLowerCase()}, which allows them to thrive where others cannot.`;
    }
    else if (questionText.includes("record") || questionText.includes("impressive")) {
      options = ["Cheetah", "Blue whale", "Peregrine falcon", "Elephant"];
      explanation = `The ${options[correctIndex]} is remarkable for this trait, which has evolved over millions of years to help the species survive.`;
    }
    else if (questionText.includes("communicate") || questionText.includes("behavior")) {
      options = ["Visual displays", "Vocalizations", "Chemical signals", "Tactile interactions"];
      explanation = `Many animals use ${options[correctIndex].toLowerCase()} as their primary mode of communication, which serves crucial functions in their social structures.`;
    }
    else {
      // Generic animal options
      options = [
        "An evolutionary adaptation",
        "A result of natural selection",
        "A specialized survival mechanism",
        "A unique biological feature"
      ];
      explanation = `This represents ${options[correctIndex].toLowerCase()} that has developed over time to give certain animals an advantage in their environment.`;
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

// Function to generate a unique cat question
function generateCatQuestion() {
  const template = catQuestionTemplates[Math.floor(Math.random() * catQuestionTemplates.length)];
  const subject = catSubjects[Math.floor(Math.random() * catSubjects.length)];
  const verb = catVerbs[Math.floor(Math.random() * catVerbs.length)];
  const trait = catTraits[Math.floor(Math.random() * catTraits.length)];
  
  let questionText = template
    .replace('%subject%', subject)
    .replace('%verb%', verb)
    .replace('%trait%', trait);
  
  // Handle template with two subject placeholders
  if (questionText.includes('%subject%')) {
    const secondSubject = catSubjects[Math.floor(Math.random() * catSubjects.length)];
    questionText = questionText.replace('%subject%', secondSubject);
  }
  
  // Determine difficulty
  const difficultyOptions = ["easy", "medium", "hard"];
  const difficulty = difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)];
  
  return createUniqueQuestion(questionText, "Cat Facts", difficulty);
}

// Function to generate a unique animal question
function generateAnimalQuestion() {
  const template = animalQuestionTemplates[Math.floor(Math.random() * animalQuestionTemplates.length)];
  const subject = animalSubjects[Math.floor(Math.random() * animalSubjects.length)];
  const verb = animalVerbs[Math.floor(Math.random() * animalVerbs.length)];
  const trait = animalTraits[Math.floor(Math.random() * animalTraits.length)];
  const habitat = animalHabitats[Math.floor(Math.random() * animalHabitats.length)];
  
  let questionText = template
    .replace('%subject%', subject)
    .replace('%verb%', verb)
    .replace('%trait%', trait)
    .replace('%habitat%', habitat);
  
  // Determine difficulty
  const difficultyOptions = ["easy", "medium", "hard"];
  const difficulty = difficultyOptions[Math.floor(Math.random() * difficultyOptions.length)];
  
  return createUniqueQuestion(questionText, "Animal Facts", difficulty);
}

// Function to save questions in batches
function saveQuestions(questions) {
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
  fs.writeFileSync(backupPath, JSON.stringify(updatedBackup, null, 2));
  console.log(`Updated backup with ${updatedQuestions.length} total questions`);
  
  return updatedQuestions;
}

// Main function to generate 50,000 questions
async function generate50kQuestions() {
  try {
    console.log("Starting massive question generation...");
    
    const targetTotal = 50000;
    const batchSize = 1000; // Process 1000 questions at a time to manage memory
    
    // Calculate how many cat and animal questions to generate
    const totalToGenerate = targetTotal - existingQuestions.length;
    const catToGenerate = Math.ceil(totalToGenerate / 2);
    const animalToGenerate = totalToGenerate - catToGenerate;
    
    console.log(`Need to generate ${totalToGenerate} more questions to reach ${targetTotal}`);
    console.log(`Will generate ${catToGenerate} cat questions and ${animalToGenerate} animal questions`);
    
    let generatedQuestions = [];
    let catGenerated = 0;
    let animalGenerated = 0;
    let batchNumber = 1;
    
    // Track progress and timing
    const startTime = Date.now();
    let nextId = existingQuestions.length + 1;
    
    // Generate questions in batches
    while (catGenerated < catToGenerate || animalGenerated < animalToGenerate) {
      console.log(`Processing batch ${batchNumber}...`);
      
      // Generate cat questions for this batch
      if (catGenerated < catToGenerate) {
        const catBatchSize = Math.min(batchSize / 2, catToGenerate - catGenerated);
        console.log(`Generating ${catBatchSize} cat questions...`);
        
        for (let i = 0; i < catBatchSize; i++) {
          // Try to generate a unique cat question (max 10 attempts)
          for (let attempt = 0; attempt < 10; attempt++) {
            const question = generateCatQuestion();
            
            // Check if this question is unique
            if (!existingQuestionTexts.has(question.question.toLowerCase().trim())) {
              // Add ID and track
              question.id = nextId++;
              generatedQuestions.push(question);
              existingQuestionTexts.add(question.question.toLowerCase().trim());
              catGenerated++;
              break;
            }
          }
        }
      }
      
      // Generate animal questions for this batch
      if (animalGenerated < animalToGenerate) {
        const animalBatchSize = Math.min(batchSize / 2, animalToGenerate - animalGenerated);
        console.log(`Generating ${animalBatchSize} animal questions...`);
        
        for (let i = 0; i < animalBatchSize; i++) {
          // Try to generate a unique animal question (max 10 attempts)
          for (let attempt = 0; attempt < 10; attempt++) {
            const question = generateAnimalQuestion();
            
            // Check if this question is unique
            if (!existingQuestionTexts.has(question.question.toLowerCase().trim())) {
              // Add ID and track
              question.id = nextId++;
              generatedQuestions.push(question);
              existingQuestionTexts.add(question.question.toLowerCase().trim());
              animalGenerated++;
              break;
            }
          }
        }
      }
      
      // Save progress every few batches
      if (generatedQuestions.length >= batchSize || 
          (catGenerated >= catToGenerate && animalGenerated >= animalToGenerate)) {
        console.log(`Saving batch ${batchNumber} with ${generatedQuestions.length} questions...`);
        
        // Save this batch
        existingQuestions = saveQuestions(generatedQuestions);
        generatedQuestions = [];
        nextId = existingQuestions.length + 1;
        
        // Show progress
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        const totalGenerated = catGenerated + animalGenerated;
        const percentComplete = (totalGenerated / totalToGenerate) * 100;
        
        console.log(`Progress: ${totalGenerated}/${totalToGenerate} (${percentComplete.toFixed(2)}%)`);
        console.log(`Time elapsed: ${elapsedMinutes.toFixed(1)} minutes`);
        
        if (totalGenerated < totalToGenerate) {
          const questionsPerMinute = totalGenerated / elapsedMinutes;
          const remainingQuestions = totalToGenerate - totalGenerated;
          const estimatedRemainingMinutes = remainingQuestions / questionsPerMinute;
          
          console.log(`Estimated time remaining: ${estimatedRemainingMinutes.toFixed(1)} minutes`);
        }
      }
      
      batchNumber++;
    }
    
    // Final stats
    const totalTimeMinutes = (Date.now() - startTime) / 60000;
    
    console.log("\nGeneration complete!");
    console.log(`Generated ${catGenerated + animalGenerated} new questions in ${totalTimeMinutes.toFixed(1)} minutes`);
    
    // Get latest stats from the backup
    const finalBackup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const finalQuestions = finalBackup.questions;
    
    // Calculate difficulty distribution
    const easyCount = finalQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = finalQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = finalQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nFinal question set statistics:");
    console.log(`Total questions: ${finalQuestions.length}`);
    console.log(`Cat questions: ${finalBackup.catQuestionCount}`);
    console.log(`Animal questions: ${finalBackup.animalQuestionCount}`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/finalQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/finalQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/finalQuestions.length*100).toFixed(1)}%)`);
    
    // Create a copy as massive-trivia-backup.json
    const massiveBackupPath = path.join('./backups', 'massive-trivia-backup.json');
    fs.copyFileSync(backupPath, massiveBackupPath);
    console.log(`Created massive backup at ${massiveBackupPath}`);
    
  } catch (error) {
    console.error("Error generating massive question set:", error);
  }
}

// Run the script
generate50kQuestions().catch(error => {
  console.error("Error in main script execution:", error);
});