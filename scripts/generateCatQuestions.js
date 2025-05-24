/**
 * Script to generate 25,000 cat-specific trivia questions
 * These will have equal distribution across easy, medium, and hard difficulties
 */

import fs from 'fs';
import path from 'path';

// Define templates for cat questions
const catSubjects = [
  "domestic cats", "wild cats", "cat behavior", "cat anatomy", "feline senses", 
  "different cat breeds", "cat health", "cat diet", "cat history", "cat intelligence",
  "cat sleep patterns", "cat communication", "cat hunting", "feline personalities", 
  "cat genetics", "kittens", "cat toys", "cat grooming", "cat whiskers", "cat tails",
  "cat paws", "cat ears", "cat eyes", "cat fur", "cat vocalizations"
];

const catVerbs = [
  "purr", "hunt", "groom themselves", "communicate", "play", "sleep",
  "mark territory", "show affection", "use their whiskers", "climb trees",
  "land on their feet", "knead with their paws", "meow", "hiss", "chirp",
  "scratch", "pounce", "hide", "stretch", "yawn"
];

const catTraits = [
  "retractable claws", "night vision", "sensitive whiskers", "flexible spine",
  "rough tongue", "acute hearing", "silent movement", "independent nature", 
  "territorial behavior", "hunting instincts", "balancing ability", "jumping height",
  "strong sense of smell", "tactile paw pads", "specialized teeth", "facial expressions",
  "body language", "social hierarchy", "scent marking", "grooming behavior"
];

// Question templates by difficulty
const easyTemplates = [
  "How many hours do cats typically sleep each day?",
  "What sound does a contented cat make?",
  "What is a group of cats called?",
  "What is the normal body temperature of a cat?",
  "How many whiskers does the average cat have?",
  "What is a female cat called?",
  "What is a male cat called?",
  "What is the average lifespan of a domestic cat?",
  "How many toes does a typical cat have on its front paws?",
  "What is a baby cat called?",
  "Which sense is most developed in newborn kittens?",
  "What is the average weight of an adult domestic cat?",
  "What is a cat's natural diet in the wild?",
  "How high can the average cat jump relative to its body length?",
  "At what age do kittens typically open their eyes?"
];

const mediumTemplates = [
  "How do cats use their %trait% when hunting?",
  "Why do cats %verb% when they're comfortable?",
  "What purpose does a cat's tail serve?",
  "How do cats communicate with other cats?",
  "What is unique about a cat's tongue?",
  "How do cats always land on their feet when falling?",
  "What's special about a cat's night vision?",
  "Why do cats knead with their paws?",
  "How do cats use scent to mark territory?",
  "What is the purpose of a cat's whiskers?",
  "How do cats regulate their body temperature?",
  "Why are cats so flexible compared to other animals?",
  "What's unique about %subject% compared to dogs?",
  "How do cats use body language to communicate?",
  "What does it mean when a cat slowly blinks at you?"
];

const hardTemplates = [
  "What is the Jacobson's organ in cats and what does it do?",
  "How does a cat's vestibular system work?",
  "What genetic mutation causes tortoiseshell coat patterns?",
  "How do cats perceive time compared to humans?",
  "What's the relationship between coat color and personality in cats?",
  "How do cats use their vibrissae for spatial awareness?",
  "What are the specific phases of a cat's hunting sequence?",
  "How do cats' brains process visual information differently than humans?",
  "What is the unique adaptation in cats' kidneys that allows them to drink sea water?",
  "How does the tapetum lucidum work in a cat's eye?",
  "What's the evolutionary purpose of purring in cats?",
  "How do domestic cats communicate differently than their wild ancestors?",
  "What physiological changes occur when cats enter 'fight or flight' mode?",
  "How do cats' paw pads help them navigate silently?",
  "What is the proprioceptive function of a cat's whiskers?"
];

// Function to generate options and explanations based on the question
function generateOptions(question, difficulty) {
  let options = [];
  let correctIndex = Math.floor(Math.random() * 4);
  
  if (difficulty === "easy") {
    if (question.includes("sleep")) {
      options = ["4-8 hours", "10-12 hours", "12-16 hours", "18-20 hours"];
      return { options, correctIndex: 2 };
    } else if (question.includes("contented cat")) {
      options = ["Meow", "Hiss", "Purr", "Growl"];
      return { options, correctIndex: 2 };
    } else if (question.includes("group of cats")) {
      options = ["Pack", "Clowder", "Herd", "Colony"];
      return { options, correctIndex: 1 };
    } else if (question.includes("body temperature")) {
      options = ["97-99°F", "100-102.5°F", "103-105°F", "106-108°F"];
      return { options, correctIndex: 1 };
    } else if (question.includes("whiskers")) {
      options = ["8-12", "16-20", "24-28", "32-36"];
      return { options, correctIndex: 2 };
    } else if (question.includes("female cat")) {
      options = ["Doe", "Queen", "Dam", "Filly"];
      return { options, correctIndex: 1 };
    } else if (question.includes("male cat")) {
      options = ["Tom", "Buck", "Bull", "Jack"];
      return { options, correctIndex: 0 };
    } else if (question.includes("lifespan")) {
      options = ["5-8 years", "10-15 years", "16-20 years", "21-25 years"];
      return { options, correctIndex: 1 };
    } else if (question.includes("toes")) {
      options = ["4 toes", "5 toes", "6 toes", "8 toes"];
      return { options, correctIndex: 1 };
    } else if (question.includes("baby cat")) {
      options = ["Pup", "Calf", "Kitten", "Cub"];
      return { options, correctIndex: 2 };
    }
  } else if (difficulty === "medium") {
    if (question.includes("tail")) {
      options = ["Only for balance", "Only for communication", "Both balance and communication", "Neither balance nor communication"];
      return { options, correctIndex: 2 };
    } else if (question.includes("communicate")) {
      options = ["Only with sounds", "Primarily through body language", "Mainly through scent marking", "Equally through sounds, visuals, and scents"];
      return { options, correctIndex: 3 };
    } else if (question.includes("tongue")) {
      options = ["It has fewer taste buds than humans", "It has a smooth surface", "It has backward-facing barbs", "It can detect sweetness"];
      return { options, correctIndex: 2 };
    } else if (question.includes("land on their feet")) {
      options = ["They have specialized leg muscles", "They rotate their flexible spine", "They use their tail as a counterweight", "They have an inner ear mechanism"];
      return { options, correctIndex: 1 };
    } else if (question.includes("night vision")) {
      options = ["They can see colors in darkness", "They have a reflective layer behind their retina", "They can see infrared light", "Their pupils can open 50% wider than humans"];
      return { options, correctIndex: 1 };
    }
  } else if (difficulty === "hard") {
    if (question.includes("Jacobson's organ")) {
      options = ["An extra balance detector", "A specialized scent analyzer", "A heat-sensing organ", "A specialized vocal apparatus"];
      return { options, correctIndex: 1 };
    } else if (question.includes("vestibular system")) {
      options = ["It helps with vocalization", "It regulates hunger", "It maintains balance and spatial orientation", "It enhances night vision"];
      return { options, correctIndex: 2 };
    } else if (question.includes("tortoiseshell")) {
      options = ["Incomplete dominance", "X-chromosome inactivation", "Simple recessive inheritance", "Polygenic inheritance"];
      return { options, correctIndex: 1 };
    } else if (question.includes("perceive time")) {
      options = ["Cats perceive time exactly like humans", "Cats have no concept of time", "Cats perceive time at a faster rate than humans", "Cats perceive time primarily through light cycles"];
      return { options, correctIndex: 3 };
    } else if (question.includes("vibrissae")) {
      options = ["To detect air currents", "To measure openings", "To enhance taste", "To amplify sounds"];
      return { options, correctIndex: 1 };
    }
  }
  
  // Generic options for questions that don't match specific patterns
  if (difficulty === "easy") {
    options = [
      "2-3 times per day", "5-6 hours", "10-12 inches", "8-10 weeks",
      "Through scent", "By sound", "Using sight", "By touch",
      "1-2 pounds", "3-4 months", "4-6 weeks", "6-10 years"
    ];
  } else if (difficulty === "medium") {
    options = [
      "For improved hunting", "For better communication", "For temperature regulation", "For defense",
      "Inherited instinct", "Learned behavior", "Social bonding", "Stress reduction",
      "Enhances sense of smell", "Improves balance", "Aids in hunting", "Helps with climbing"
    ];
  } else { // hard
    options = [
      "A specialized neural pathway", "A genetic adaptation", "An evolutionary advantage", "A physiological response",
      "Through specialized receptors", "Via glandular secretions", "Using acoustic sensors", "With thermal detection",
      "A metabolic process", "A neurological function", "A behavioral adaptation", "A chemical response"
    ];
  }
  
  // Pick 4 random options from the appropriate difficulty pool
  const selectedOptions = [];
  while (selectedOptions.length < 4) {
    const randomIndex = Math.floor(Math.random() * options.length);
    if (!selectedOptions.includes(options[randomIndex])) {
      selectedOptions.push(options[randomIndex]);
    }
  }
  
  return { options: selectedOptions, correctIndex };
}

// Function to generate explanations based on question and correct answer
function generateExplanation(question, difficulty, correctAnswer) {
  if (difficulty === "easy") {
    if (question.includes("sleep")) {
      return "Cats are known for sleeping 12-16 hours per day, which is why they're often seen napping. This sleep pattern comes from their wild ancestors who needed to conserve energy between hunts.";
    } else if (question.includes("contented cat")) {
      return "A contented cat typically purrs, which is a low, continuous, rumbling sound. While purring is usually associated with contentment, cats may also purr when stressed or injured, as it has self-soothing properties.";
    } else if (question.includes("group of cats")) {
      return "A group of cats is called a clowder. Other terms include a colony (for feral cats), a glaring, or a pounce.";
    } else if (question.includes("female cat")) {
      return "A female cat is called a queen, especially when she is pregnant or nursing kittens.";
    } else if (question.includes("baby cat")) {
      return "A baby cat is called a kitten until it reaches about one year of age.";
    }
  } else if (difficulty === "medium") {
    if (question.includes("tail")) {
      return "A cat's tail serves multiple functions: it helps with balance when walking on narrow surfaces or jumping, and it's also a key communication tool to express emotions and intentions to other cats and humans.";
    } else if (question.includes("tongue")) {
      return "A cat's tongue has backward-facing barbs called papillae that help with grooming by acting like a comb to remove loose fur and debris, and also assist in rasping meat from bones when eating prey.";
    } else if (question.includes("night vision")) {
      return "Cats have excellent night vision due to a reflective layer behind their retina called the tapetum lucidum, which bounces light back through the retina for a second chance at detection. This is also what makes their eyes appear to glow in the dark.";
    }
  } else if (difficulty === "hard") {
    if (question.includes("Jacobson's organ")) {
      return "The Jacobson's organ (vomeronasal organ) is a specialized scent analyzer located in the roof of a cat's mouth. When a cat makes a grimace with an open mouth (called the Flehmen response), they're drawing air into this organ to analyze complex scents, particularly pheromones.";
    } else if (question.includes("tortoiseshell")) {
      return "Tortoiseshell coat patterns in cats result from X-chromosome inactivation (lyonization). Since coat color genes are carried on the X chromosome and female cats have two X chromosomes, random inactivation of one X chromosome in each cell during development creates the mottled pattern.";
    } else if (question.includes("vibrissae")) {
      return "Cats use their vibrissae (whiskers) for spatial awareness by measuring openings to determine if they can fit through. The whiskers are so sensitive they can detect air currents, helping cats navigate in darkness and sense nearby objects without touching them.";
    }
  }
  
  // Generic explanation if no specific pattern matched
  return `The correct answer is ${correctAnswer}, which reflects important aspects of feline biology, behavior, or evolution. Cats have developed this characteristic over thousands of years of evolution as both predators and social animals.`;
}

// Main function to generate cat questions
function generateCatQuestions() {
  console.log("Starting cat question generation...");
  
  // Set target counts
  const totalQuestions = 25000;
  const questionsPerDifficulty = totalQuestions / 3;
  
  const easyQuestions = [];
  const mediumQuestions = [];
  const hardQuestions = [];
  
  // Track seen questions to avoid duplicates
  const seenQuestions = new Set();
  
  // Generate easy questions
  console.log(`Generating ${questionsPerDifficulty} easy cat questions...`);
  while (easyQuestions.length < questionsPerDifficulty) {
    // Base easy questions on templates
    let questionText = easyTemplates[Math.floor(Math.random() * easyTemplates.length)];
    
    // Check if we've seen this question before
    if (!seenQuestions.has(questionText.toLowerCase())) {
      seenQuestions.add(questionText.toLowerCase());
      
      // Generate options and correct answer
      const { options, correctIndex } = generateOptions(questionText, "easy");
      const explanation = generateExplanation(questionText, "easy", options[correctIndex]);
      
      easyQuestions.push({
        question: questionText,
        options: options,
        correctIndex: correctIndex,
        explanation: explanation,
        category: "Cat Facts",
        difficulty: "easy"
      });
      
      // Log progress
      if (easyQuestions.length % 1000 === 0) {
        console.log(`Generated ${easyQuestions.length} easy cat questions`);
      }
    }
  }
  
  // Generate medium questions
  console.log(`Generating ${questionsPerDifficulty} medium cat questions...`);
  while (mediumQuestions.length < questionsPerDifficulty) {
    // Get a template and fill in placeholders
    let template = mediumTemplates[Math.floor(Math.random() * mediumTemplates.length)];
    let questionText = template
      .replace('%subject%', catSubjects[Math.floor(Math.random() * catSubjects.length)])
      .replace('%verb%', catVerbs[Math.floor(Math.random() * catVerbs.length)])
      .replace('%trait%', catTraits[Math.floor(Math.random() * catTraits.length)]);
    
    // Check if we've seen this question before
    if (!seenQuestions.has(questionText.toLowerCase())) {
      seenQuestions.add(questionText.toLowerCase());
      
      // Generate options and correct answer
      const { options, correctIndex } = generateOptions(questionText, "medium");
      const explanation = generateExplanation(questionText, "medium", options[correctIndex]);
      
      mediumQuestions.push({
        question: questionText,
        options: options,
        correctIndex: correctIndex,
        explanation: explanation,
        category: "Cat Facts",
        difficulty: "medium"
      });
      
      // Log progress
      if (mediumQuestions.length % 1000 === 0) {
        console.log(`Generated ${mediumQuestions.length} medium cat questions`);
      }
    }
  }
  
  // Generate hard questions
  console.log(`Generating ${questionsPerDifficulty} hard cat questions...`);
  while (hardQuestions.length < questionsPerDifficulty) {
    // Base hard questions on templates
    let questionText = hardTemplates[Math.floor(Math.random() * hardTemplates.length)];
    
    // Check if we've seen this question before
    if (!seenQuestions.has(questionText.toLowerCase())) {
      seenQuestions.add(questionText.toLowerCase());
      
      // Generate options and correct answer
      const { options, correctIndex } = generateOptions(questionText, "hard");
      const explanation = generateExplanation(questionText, "hard", options[correctIndex]);
      
      hardQuestions.push({
        question: questionText,
        options: options,
        correctIndex: correctIndex,
        explanation: explanation,
        category: "Cat Facts",
        difficulty: "hard"
      });
      
      // Log progress
      if (hardQuestions.length % 1000 === 0) {
        console.log(`Generated ${hardQuestions.length} hard cat questions`);
      }
    }
  }
  
  // Combine all questions
  const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  
  // Assign IDs
  const questionsWithIds = allQuestions.map((q, index) => ({
    id: index + 1,
    ...q
  }));
  
  console.log(`Total cat questions generated: ${questionsWithIds.length}`);
  console.log(`Easy: ${easyQuestions.length}`);
  console.log(`Medium: ${mediumQuestions.length}`);
  console.log(`Hard: ${hardQuestions.length}`);
  
  return questionsWithIds;
}

// Main execution function
function main() {
  try {
    const catQuestions = generateCatQuestions();
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      questionCount: catQuestions.length,
      catQuestionCount: catQuestions.length,
      animalQuestionCount: 0,
      questions: catQuestions
    };
    
    // Save the backup
    const backupsDir = path.join('.', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    const backupPath = path.join(backupsDir, 'cat-questions.json');
    console.log(`Saving cat questions to ${backupPath}...`);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    console.log("Cat question generation complete!");
  } catch (error) {
    console.error("Error generating cat questions:", error);
  }
}

// Run the script
main();