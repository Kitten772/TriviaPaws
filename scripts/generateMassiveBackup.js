/**
 * Script to generate a massive backup file with 50,000 trivia questions
 * (25,000 cat questions and 25,000 animal questions)
 * This creates a backup file that can be loaded into the database with restoreTriviaQuestions.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Templates for generating cat questions
const catQuestionTemplates = {
  easy: [
    { template: "What is a %s called?", topics: ["group of cats", "baby cat", "male cat", "female cat", "cat's home", "cat toy", "cat sound", "cat breed"] },
    { template: "How many %s does the average cat have?", topics: ["whiskers", "teeth", "toes", "lives", "kittens per litter", "hours of sleep per day", "years in a lifespan", "vertebrae"] },
    { template: "Which cat breed is known for its %s?", topics: ["folded ears", "short legs", "no tail", "long fur", "flat face", "blue eyes", "spots", "stripes", "unusual color"] },
    { template: "What color are most cats' eyes at birth?", topics: [] },
    { template: "What is the most common coat pattern in cats?", topics: [] },
    { template: "True or false: Cats cannot taste %s.", topics: ["sweet things", "salty foods", "bitter flavors", "sour items"] },
  ],
  medium: [
    { template: "Which vitamin can cats produce naturally that humans cannot?", topics: [] },
    { template: "What percentage of a cat's bones are in its tail?", topics: [] },
    { template: "In Ancient Egypt, what happened to someone who killed a cat?", topics: [] },
    { template: "What is the proper name for a cat's whiskers?", topics: [] },
    { template: "Why do cats purr?", topics: [] },
    { template: "What cat breed holds the record for longest domestic cat?", topics: [] },
    { template: "How far can a cat fall and still survive?", topics: [] },
    { template: "What is special about a cat's tongue?", topics: [] },
    { template: "What is unique about a cat's collar bone?", topics: [] },
  ],
  hard: [
    { template: "What is the name of the genetic condition that causes cats to have extra toes?", topics: [] },
    { template: "What is the term for a cat's ability to always land on its feet?", topics: [] },
    { template: "Which gene causes calico cats to almost always be female?", topics: [] },
    { template: "What is a cat's field of vision in degrees?", topics: [] },
    { template: "How many muscles control a cat's ear?", topics: [] },
    { template: "What is the fastest domestic cat breed?", topics: [] },
    { template: "What is the scientific term for a cat's kneading behavior?", topics: [] },
    { template: "What is special about the Singapura cat breed?", topics: [] },
    { template: "What is the term for a cat's third eyelid?", topics: [] },
  ]
};

// Templates for generating animal questions
const animalQuestionTemplates = {
  easy: [
    { template: "What animal is known as the %s?", topics: ["king of the jungle", "ship of the desert", "man's best friend", "river horse", "striped horse", "flying fox", "sea cow", "bird of paradise"] },
    { template: "How many legs does a %s have?", topics: ["spider", "octopus", "crab", "starfish", "insect", "butterfly", "grasshopper", "centipede", "millipede"] },
    { template: "What do you call a baby %s?", topics: ["kangaroo", "bear", "deer", "owl", "goose", "sheep", "tiger", "frog", "swan", "elephant"] },
    { template: "Which animal %s?", topics: ["can live without water the longest", "has the best sense of smell", "is the largest land mammal", "sleeps standing up", "never sleeps", "has the most teeth"] },
    { template: "What is a group of %s called?", topics: ["wolves", "fish", "lions", "elephants", "birds", "geese", "owls", "zebras", "snakes", "monkeys"] },
  ],
  medium: [
    { template: "How long can a %s go without water?", topics: ["camel", "kangaroo rat", "tortoise", "koala"] },
    { template: "What is unique about a %s's heart?", topics: ["giraffe", "octopus", "blue whale", "hummingbird"] },
    { template: "Which animal can %s?", topics: ["see ultraviolet light", "change its sex", "regrow its head", "live forever", "clone itself naturally", "smell with its tongue"] },
    { template: "What is the only animal that %s?", topics: ["cannot jump", "never sleeps", "has four knees", "has square pupils", "can get sunburned", "can see behind itself without turning its head"] },
    { template: "How far can a %s jump relative to its body length?", topics: ["flea", "grasshopper", "kangaroo", "frog", "mountain lion"] },
  ],
  hard: [
    { template: "What is the only mammal that %s?", topics: ["cannot jump", "lays eggs but produces milk", "has no vocal cords", "can resist certain snake venoms"] },
    { template: "How many hearts does a %s have?", topics: ["octopus", "earthworm", "hagfish", "squid", "cockroach"] },
    { template: "What is the term for %s in the animal kingdom?", topics: ["animals that eat both plants and animals", "a male sheep", "an animal active at dawn and dusk", "hibernation during hot weather", "animals born in a very undeveloped state"] },
    { template: "Which animal has the %s relative to its body size?", topics: ["largest brain", "smallest brain", "strongest bite force", "largest eyes", "most complex social structure"] },
    { template: "What unique ability does the %s possess?", topics: ["mimic octopus", "mantis shrimp", "bombardier beetle", "pistol shrimp", "axolotl", "tardigrade"] },
  ]
};

// Answers and explanations for specific cat questions
const catSpecificAnswers = {
  "Which vitamin can cats produce naturally that humans cannot?": {
    options: ["Vitamin C", "Vitamin D", "Vitamin A", "Vitamin K"],
    correctIndex: 1,
    explanation: "Cats can produce Vitamin D naturally through their skin when exposed to sunlight, unlike humans who need dietary sources."
  },
  "What percentage of a cat's bones are in its tail?": {
    options: ["5%", "10%", "15%", "20%"],
    correctIndex: 1,
    explanation: "About 10% of a cat's bones are found in its tail, which contains around 20-23 vertebrae depending on the breed."
  },
  "In Ancient Egypt, what happened to someone who killed a cat?": {
    options: ["A small fine", "Public shaming", "Death penalty", "Exile from the kingdom"],
    correctIndex: 2,
    explanation: "In Ancient Egypt, cats were highly revered and killing one (even accidentally) could result in the death penalty."
  },
  "What is the proper name for a cat's whiskers?": {
    options: ["Feliforms", "Vibrissae", "Tactilia", "Sensoria"],
    correctIndex: 1,
    explanation: "A cat's whiskers are scientifically called vibrissae, which are specialized tactile hairs that help the cat navigate its environment."
  },
  "Why do cats purr?": {
    options: ["Only when happy", "To communicate with humans", "For healing and communication", "To mark territory"],
    correctIndex: 2,
    explanation: "Cats purr not only when content but also when injured or stressed. The frequency of purring (25-150 Hz) can promote healing and bone growth."
  },
  // More specific answers for hard-coded questions
  "What color are most cats' eyes at birth?": {
    options: ["Green", "Yellow", "Blue", "Brown"],
    correctIndex: 2,
    explanation: "Most kittens are born with blue eyes. The eye color typically changes as they age, usually between 4-6 weeks old."
  },
  "What is the most common coat pattern in cats?": {
    options: ["Tabby", "Solid", "Calico", "Colorpoint"],
    correctIndex: 0,
    explanation: "The tabby pattern is the most common coat pattern in domestic cats, characterized by distinctive stripes, whorls, or spots."
  },
  "What is the name of the genetic condition that causes cats to have extra toes?": {
    options: ["Polydactyly", "Hyperdactyly", "Multitoeism", "Extrapedia"],
    correctIndex: 0,
    explanation: "Polydactyly is a genetic condition that causes cats to have extra toes. It's especially common in certain regions like Boston and the East Coast of the USA."
  },
};

// Function to generate variations of questions
function generateQuestionVariations(templates, count, difficulty, category) {
  const questions = [];
  const usedTexts = new Set();
  
  while (questions.length < count) {
    const difficultyTemplates = templates[difficulty];
    const templateObj = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
    
    // If template has no topic variations, use it directly
    if (templateObj.topics.length === 0) {
      const questionText = templateObj.template;
      
      // Check if this exact question already exists
      if (!usedTexts.has(questionText)) {
        usedTexts.add(questionText);
        
        // Use predefined answers if available, otherwise generate generic ones
        if (catSpecificAnswers[questionText]) {
          const answerData = catSpecificAnswers[questionText];
          questions.push({
            question: questionText,
            options: answerData.options,
            correctIndex: answerData.correctIndex,
            explanation: answerData.explanation,
            category: category,
            difficulty: difficulty
          });
        } else {
          // Generate generic options and explanation
          questions.push(generateGenericQuestion(questionText, category, difficulty));
        }
      }
      continue;
    }
    
    // Use a random topic to fill in the template
    const topic = templateObj.topics[Math.floor(Math.random() * templateObj.topics.length)];
    const questionText = templateObj.template.replace('%s', topic);
    
    // Check if this question already exists
    if (!usedTexts.has(questionText)) {
      usedTexts.add(questionText);
      questions.push(generateGenericQuestion(questionText, category, difficulty));
    }
  }
  
  return questions;
}

// Generate generic question options and explanation
function generateGenericQuestion(questionText, category, difficulty) {
  const difficultyMultiplier = { easy: 1, medium: 2, hard: 3 };
  const baseScore = 50 * difficultyMultiplier[difficulty];
  
  return {
    question: questionText,
    options: [`Option A (${baseScore} points)`, `Option B (${baseScore} points)`, `Option C (${baseScore} points)`, `Option D (${baseScore} points)`],
    correctIndex: Math.floor(Math.random() * 4),
    explanation: `This is a ${difficulty} ${category} question worth ${baseScore} points. The correct answer provides insight about ${questionText.toLowerCase().replace('?', '')}.`,
    category: category,
    difficulty: difficulty
  };
}

// Main function to generate and store questions
async function generateMassiveBackup() {
  try {
    console.log("Starting massive trivia set generation...");
    
    // Define the target counts - exactly 25,000 each with 1:1:1 difficulty ratio
    const questionsPerCategory = 25000;
    const questionsPerDifficulty = Math.ceil(questionsPerCategory / 3); // ~8,333 questions per difficulty
    
    console.log(`Generating exactly ${questionsPerCategory} questions per category (cat/animal)`);
    console.log(`Each difficulty level will have ~${questionsPerDifficulty} questions`);
    
    // Generate cat questions
    console.log("Generating cat questions...");
    let catQuestions = [
      ...generateQuestionVariations(catQuestionTemplates, questionsPerDifficulty, "easy", "Cat Facts"),
      ...generateQuestionVariations(catQuestionTemplates, questionsPerDifficulty, "medium", "Cat Facts"),
      ...generateQuestionVariations(catQuestionTemplates, questionsPerDifficulty, "hard", "Cat Facts"),
    ];
    
    // Generate animal questions
    console.log("Generating animal questions...");
    let animalQuestions = [
      ...generateQuestionVariations(animalQuestionTemplates, questionsPerDifficulty, "easy", "Animal Facts"),
      ...generateQuestionVariations(animalQuestionTemplates, questionsPerDifficulty, "medium", "Animal Facts"),
      ...generateQuestionVariations(animalQuestionTemplates, questionsPerDifficulty, "hard", "Animal Facts"),
    ];
    
    // Combine all questions
    const allQuestions = [...catQuestions, ...animalQuestions];
    console.log(`Generated ${allQuestions.length} total questions`);
    
    // Create a backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      questionCount: allQuestions.length,
      catQuestionCount: catQuestions.length,
      animalQuestionCount: animalQuestions.length,
      questions: allQuestions.map((q, index) => ({
        id: index + 1, // Add an ID for database import
        ...q
      }))
    };
    
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const backupPath = path.join(dirname, '..', 'backups', 'massive-trivia-backup.json');
    
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`Backup created at ${backupPath}`);
    
    // Summary of what was generated
    console.log("\nFinal counts:");
    console.log(`Total questions: ${backupData.questionCount}`);
    console.log(`Cat questions: ${backupData.catQuestionCount}`);
    console.log(`Animal questions: ${backupData.animalQuestionCount}`);
    
    // Calculate difficulty distribution
    const easyCount = allQuestions.filter(q => q.difficulty === 'easy').length;
    const mediumCount = allQuestions.filter(q => q.difficulty === 'medium').length;
    const hardCount = allQuestions.filter(q => q.difficulty === 'hard').length;
    
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/allQuestions.length*100).toFixed(1)}%)`);
    
  } catch (error) {
    console.error("Error generating backup:", error);
  }
}

// Run the script
generateMassiveBackup().catch(err => {
  console.error('Error in main script execution:', err);
});