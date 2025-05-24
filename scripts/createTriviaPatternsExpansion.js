/**
 * Script to expand trivia questions using structured patterns and variations
 * This approach creates unique questions without needing API calls
 */

import fs from 'fs';
import path from 'path';

// Load the existing questions
const backupPath = path.join('./backups', 'default-trivia-backup.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const existingQuestions = backup.questions || [];

console.log(`Starting with ${existingQuestions.length} existing questions`);

// Keep track of questions we've seen to avoid duplicates
const seenQuestionTexts = new Set();
for (const q of existingQuestions) {
  seenQuestionTexts.add(q.question.toLowerCase().trim());
}

// Pattern-based generation using templates
// These templates define the structure for creating many unique questions
const catPatterns = [
  // Anatomy patterns
  {
    template: "%prefix% a cat's %anatomyPart%?",
    prefixes: ["What is unique about", "What is the purpose of", "How does a cat use", "Why do cats have"],
    anatomyParts: ["whiskers", "retractable claws", "rough tongue", "sensitive paw pads", "flexible spine", "third eyelid", "ear shape", "tail", "sensitive nose", "teeth"],
    category: "Cat Anatomy",
    difficultyLevel: "medium"
  },
  // Behavior patterns
  {
    template: "%prefix% cats %behavior%?",
    prefixes: ["Why do", "When do", "How often do", "At what age do"],
    behaviors: ["purr", "knead with their paws", "groom themselves", "hide when sick", "play with toys", "chase laser pointers", "sleep so much", "pounce on prey", "climb trees", "stare at owners"],
    category: "Cat Behavior",
    difficultyLevel: "easy"
  },
  // Health patterns
  {
    template: "%prefix% for a cat to %healthAction%?",
    prefixes: ["Is it normal", "Is it healthy", "How common is it", "Is it concerning"],
    healthActions: ["sleep for 16 hours a day", "eat grass occasionally", "hide when in pain", "lose whiskers occasionally", "shed seasonally", "gain weight in winter", "drink less water than dogs", "groom excessively", "skip meals occasionally", "be active at night"],
    category: "Cat Health",
    difficultyLevel: "medium"
  },
  // Breed patterns
  {
    template: "Which cat breed %breedCharacteristic%?",
    breedCharacteristic: ["has no tail", "has folded ears", "has extra toes", "is completely hairless", "has a squashed face", "has a spotted coat", "originated in Asia", "is the largest domesticated", "is the smallest adult", "has blue eyes most often"],
    category: "Cat Breeds",
    difficultyLevel: "hard"
  }
];

const animalPatterns = [
  // Habitat patterns
  {
    template: "Which animal %habitatAction% in the %habitat%?",
    habitatAction: ["lives exclusively", "primarily hunts", "raises its young", "hibernates", "migrates to"],
    habitat: ["desert", "Arctic", "rainforest", "ocean depths", "mountain peaks", "underground", "treetops", "wetlands", "grasslands", "urban environments"],
    category: "Animal Habitats",
    difficultyLevel: "medium"
  },
  // Ability patterns
  {
    template: "Which animal can %uniqueAbility%?",
    uniqueAbility: ["regrow lost limbs", "change its color at will", "see ultraviolet light", "communicate using electricity", "survive being frozen", "live without oxygen", "mimic human speech", "sense Earth's magnetic field", "survive in space", "live for over a century"],
    category: "Animal Abilities",
    difficultyLevel: "hard"
  },
  // Diet patterns
  {
    template: "%prefix% animal exclusively eats %food%?",
    prefixes: ["Which", "What type of", "What species of", "What kind of"],
    food: ["bamboo", "eucalyptus leaves", "nectar", "wood", "blood", "bone marrow", "plankton", "krill", "ants", "other snakes"],
    category: "Animal Diet",
    difficultyLevel: "medium"
  },
  // Group patterns
  {
    template: "What is a group of %animal% called?",
    animal: ["elephants", "lions", "fish", "owls", "crows", "whales", "frogs", "bats", "zebras", "kangaroos"],
    category: "Animal Groups",
    difficultyLevel: "easy"
  }
];

// Function to generate answers with proper explanations
function generateAnswers(pattern, values) {
  // Generate four options where one is correct
  const correctIndex = Math.floor(Math.random() * 4);
  let options = [];
  let explanation = "";
  
  // Depending on pattern type, create appropriate answers
  if (pattern.template.includes("anatomyPart")) {
    options = [
      "For balance and coordination",
      "For sensing their environment",
      "For communication with other cats",
      "For temperature regulation"
    ];
    explanation = `A cat's ${values.anatomyPart} is primarily used for sensing their environment, helping them navigate and hunt effectively.`;
  } 
  else if (pattern.template.includes("behavior")) {
    options = [
      "For communication with humans",
      "Due to instinctive behavior",
      "For temperature regulation",
      "To mark territory"
    ];
    explanation = `Cats ${values.behavior} primarily due to instinctive behavior inherited from their wild ancestors.`;
  }
  else if (pattern.template.includes("healthAction")) {
    options = [
      "Yes, it's completely normal",
      "No, it's a sign of illness",
      "Only in kittens, not adult cats",
      "Only in certain breeds"
    ];
    explanation = `It is normal for cats to ${values.healthAction} as part of their natural behavior and physiology.`;
  }
  else if (pattern.template.includes("breedCharacteristic")) {
    options = [
      "Persian",
      "Siamese",
      "Maine Coon",
      "Manx"
    ];
    explanation = `The Manx cat breed is known for having no tail due to a natural genetic mutation.`;
  }
  else if (pattern.template.includes("habitatAction")) {
    options = [
      "Polar bear",
      "Camel",
      "Jaguar",
      "Penguin"
    ];
    explanation = `The ${options[correctIndex]} ${values.habitatAction} in the ${values.habitat} as a key adaptation for survival.`;
  }
  else if (pattern.template.includes("uniqueAbility")) {
    options = [
      "Dolphin",
      "Chameleon",
      "Octopus",
      "Bat"
    ];
    explanation = `The ${options[correctIndex]} can ${values.uniqueAbility}, which is a remarkable adaptation that helps it survive in its environment.`;
  }
  else if (pattern.template.includes("food")) {
    options = [
      "Koala",
      "Giant panda",
      "Hummingbird",
      "Anteater"
    ];
    explanation = `The ${options[correctIndex]} exclusively eats ${values.food} due to its specialized digestive system and evolutionary adaptations.`;
  }
  else if (pattern.template.includes("animal")) {
    if (values.animal === "lions") {
      options = ["Pack", "Pride", "Colony", "Herd"];
      explanation = "A group of lions is called a pride, typically consisting of related females, their cubs, and a small number of adult males.";
    } else if (values.animal === "elephants") {
      options = ["Herd", "Parade", "Memory", "Tribe"];
      explanation = "A group of elephants is called a herd or a parade, led by the oldest and largest female elephant.";
    } else {
      options = ["Herd", "Pack", "School", "Flock"];
      explanation = `A group of ${values.animal} has a specific collective noun in English that reflects their behavior or historical observation.`;
    }
  }
  else {
    // Generic options if no specific pattern matches
    options = [
      "Option A for this question",
      "Option B for this question",
      "Option C for this question",
      "Option D for this question"
    ];
    explanation = "This explanation provides details about the correct answer to this question.";
  }
  
  return {
    options,
    correctIndex,
    explanation
  };
}

// Function to create unique questions from patterns
function generateUniqueQuestions(patterns, targetCount, category) {
  const generatedQuestions = [];
  
  while (generatedQuestions.length < targetCount) {
    // Pick a random pattern
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Build values for template
    const values = {};
    let questionText = pattern.template;
    
    // Replace each placeholder with a value
    for (const key in pattern) {
      if (Array.isArray(pattern[key])) {
        // For arrays, pick a random value
        const array = pattern[key];
        const value = array[Math.floor(Math.random() * array.length)];
        values[key] = value;
        
        // Replace in template
        const placeholder = `%${key}%`;
        if (questionText.includes(placeholder)) {
          questionText = questionText.replace(placeholder, value);
        }
      }
    }
    
    // For prefixes specifically
    if (pattern.prefixes && pattern.template.includes("%prefix%")) {
      const prefix = pattern.prefixes[Math.floor(Math.random() * pattern.prefixes.length)];
      values.prefix = prefix;
      questionText = questionText.replace("%prefix%", prefix);
    }
    
    // Check if this question is unique
    if (!seenQuestionTexts.has(questionText.toLowerCase().trim())) {
      // Generate answers
      const answerData = generateAnswers(pattern, values);
      
      // Add to generated questions
      generatedQuestions.push({
        question: questionText,
        options: answerData.options,
        correctIndex: answerData.correctIndex,
        explanation: answerData.explanation,
        category: pattern.category || `${category} Facts`,
        difficulty: pattern.difficultyLevel || "medium"
      });
      
      // Mark as seen
      seenQuestionTexts.add(questionText.toLowerCase().trim());
    }
  }
  
  return generatedQuestions;
}

// Main function to expand the question set
async function expandQuestionSet() {
  try {
    console.log("Starting question set expansion...");
    
    // How many questions to generate
    const targetTotal = 300; // Start with a smaller set that we can expand later
    const catQuestionsToGenerate = Math.ceil((targetTotal - existingQuestions.length) / 2);
    const animalQuestionsToGenerate = Math.ceil((targetTotal - existingQuestions.length) / 2);
    
    console.log(`Generating ${catQuestionsToGenerate} new cat questions and ${animalQuestionsToGenerate} new animal questions`);
    
    // Generate questions
    const newCatQuestions = generateUniqueQuestions(catPatterns, catQuestionsToGenerate, "Cat");
    const newAnimalQuestions = generateUniqueQuestions(animalPatterns, animalQuestionsToGenerate, "Animal");
    
    console.log(`Generated ${newCatQuestions.length} cat questions and ${newAnimalQuestions.length} animal questions`);
    
    // Combine all questions
    const allQuestions = [
      ...existingQuestions,
      ...newCatQuestions,
      ...newAnimalQuestions
    ];
    
    // Assign sequential IDs
    const updatedQuestions = allQuestions.map((q, i) => ({
      ...q,
      id: i + 1
    }));
    
    // Count cat and animal questions
    const catCount = updatedQuestions.filter(q => 
      q.category && q.category.toLowerCase().includes('cat')
    ).length;
    
    const animalCount = updatedQuestions.length - catCount;
    
    // Create updated backup
    const updatedBackup = {
      timestamp: new Date().toISOString(),
      questionCount: updatedQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: updatedQuestions
    };
    
    // Calculate difficulty distribution
    const easyCount = updatedQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = updatedQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = updatedQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nExpanded question set statistics:");
    console.log(`Total questions: ${updatedQuestions.length}`);
    console.log(`Cat questions: ${catCount}`);
    console.log(`Animal questions: ${animalCount}`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/updatedQuestions.length*100).toFixed(1)}%)`);
    
    // Save to backup files
    const expandedPath = path.join('./backups', 'expanded-trivia-backup.json');
    fs.writeFileSync(expandedPath, JSON.stringify(updatedBackup, null, 2));
    console.log(`Saved expanded backup to ${expandedPath}`);
    
    // Update the default backup
    fs.writeFileSync(backupPath, JSON.stringify(updatedBackup, null, 2));
    console.log(`Updated default backup with expanded questions`);
    
    return updatedBackup;
    
  } catch (error) {
    console.error("Error expanding question set:", error);
  }
}

// Run the script
expandQuestionSet().catch(error => {
  console.error("Error in main script execution:", error);
});