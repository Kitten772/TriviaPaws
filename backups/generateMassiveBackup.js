/**
 * This script generates a large backup file with thousands of trivia questions
 * for easy deployment to Render
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utility functions
function getRandomDifficulty() {
  const difficulties = ["easy", "medium", "hard"];
  return difficulties[Math.floor(Math.random() * difficulties.length)];
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Generate a massive set of varied cat trivia questions
function generateCatQuestions() {
  const questions = [];
  
  // Cat fact templates
  const catFactTemplates = [
    {
      question: "What is the average lifespan of a {CAT_BREED} cat?",
      options: ["5-8 years", "10-15 years", "15-20 years", "20-25 years"],
      correctIndex: 1,
      explanation: "Most {CAT_BREED} cats live between 10-15 years on average when kept as indoor pets.",
      category: "Cat Breeds"
    },
    {
      question: "Which of these is NOT a characteristic of the {CAT_BREED} cat breed?",
      options: ["{TRAIT1}", "{TRAIT2}", "{TRAIT3}", "{TRAIT4}"],
      correctIndex: 3,
      explanation: "{TRAIT4} is not a characteristic of {CAT_BREED} cats. They are known for {TRAIT1}, {TRAIT2}, and {TRAIT3}.",
      category: "Cat Breeds"
    },
    {
      question: "What color eyes do {CAT_BREED} cats typically have?",
      options: ["Blue", "Green", "Yellow", "Copper"],
      correctIndex: 0,
      explanation: "{CAT_BREED} cats typically have {CORRECT_ANSWER} eyes, which is one of their distinctive features.",
      category: "Cat Breeds"
    },
    {
      question: "How many hours per day do cats typically sleep?",
      options: ["8-10", "12-14", "15-20", "22-23"],
      correctIndex: 2,
      explanation: "Cats sleep 15-20 hours per day, which is why they're often found napping in sunny spots throughout the day.",
      category: "Cat Behavior"
    },
    {
      question: "Which of these is a way cats communicate?",
      options: ["Purring", "Meowing", "Tail positioning", "All of the above"],
      correctIndex: 3,
      explanation: "Cats use multiple methods to communicate including purring, meowing, and body language like tail positioning.",
      category: "Cat Behavior"
    }
  ];
  
  // Cat breeds to use in templates
  const catBreeds = [
    "Siamese", "Persian", "Maine Coon", "Bengal", "Sphynx", "Ragdoll", 
    "British Shorthair", "Abyssinian", "Scottish Fold", "Russian Blue",
    "Norwegian Forest", "Devon Rex", "Birman", "Burmese", "Egyptian Mau",
    "Himalayan", "Cornish Rex", "Exotic Shorthair", "American Shorthair", "Tonkinese"
  ];
  
  // Cat traits to use in templates
  const catTraits = [
    "long fur", "short fur", "vocal personality", "quiet demeanor", "blue eyes", 
    "green eyes", "spotted coat", "striped pattern", "playful attitude", "reserved temperament",
    "large size", "small build", "ear tufts", "folded ears", "curly fur",
    "no fur", "bushy tail", "white paws", "black coat", "calico coloring",
    "sociable with strangers", "shy with strangers", "high intelligence", "stubborn personality",
    "enjoys water", "dislikes water", "good climber", "prefers ground level", "loud purr", "silent purr"
  ];
  
  // Generate questions from templates
  for (let i = 0; i < 200; i++) {
    // Randomly select a template
    const template = { ...catFactTemplates[getRandomIndex(catFactTemplates.length)] };
    
    // Randomly select a cat breed
    const breed = catBreeds[getRandomIndex(catBreeds.length)];
    
    // Generate unique traits
    let traitIndexes = [];
    while (traitIndexes.length < 4) {
      const idx = getRandomIndex(catTraits.length);
      if (!traitIndexes.includes(idx)) {
        traitIndexes.push(idx);
      }
    }
    
    const traits = traitIndexes.map(idx => catTraits[idx]);
    
    // Replace placeholders in template
    let question = { ...template };
    question.question = question.question.replace('{CAT_BREED}', breed);
    question.explanation = question.explanation.replace(/{CAT_BREED}/g, breed);
    
    // Replace correct answer placeholder if exists
    if (question.explanation.includes('{CORRECT_ANSWER}')) {
      question.explanation = question.explanation.replace('{CORRECT_ANSWER}', question.options[question.correctIndex]);
    }
    
    // Replace trait placeholders if they exist
    if (question.options.includes('{TRAIT1}')) {
      question.options = question.options.map((opt, idx) => {
        if (opt === `{TRAIT${idx+1}}`) {
          return traits[idx];
        }
        return opt;
      });
      
      // Update explanation
      question.explanation = question.explanation
        .replace('{TRAIT1}', traits[0])
        .replace('{TRAIT2}', traits[1])
        .replace('{TRAIT3}', traits[2])
        .replace('{TRAIT4}', traits[3]);
    }
    
    // Set a random difficulty if not already set
    if (!question.difficulty) {
      question.difficulty = getRandomDifficulty();
    }
    
    // Add to questions array
    questions.push(question);
  }
  
  return questions;
}

// Generate a set of mixed animal trivia questions
function generateAnimalQuestions() {
  const questions = [];
  
  // Fixed specific animal questions
  const fixedAnimalQuestions = [
    {
      question: "What is the largest living bird by wingspan?",
      options: ["Ostrich", "Wandering Albatross", "California Condor", "Andean Condor"],
      correctIndex: 1,
      explanation: "The Wandering Albatross has the largest wingspan of any living bird, measuring up to 3.5 meters (11.5 feet) across.",
      category: "Bird Facts",
      difficulty: "medium"
    },
    {
      question: "Which animal has the longest lifespan?",
      options: ["Bowhead Whale", "Giant Tortoise", "Greenland Shark", "Ocean Quahog Clam"],
      correctIndex: 2,
      explanation: "The Greenland Shark has the longest known lifespan of any vertebrate, estimated to live up to 400-500 years.",
      category: "Animal Lifespans",
      difficulty: "hard"
    },
    {
      question: "What is a group of lions called?",
      options: ["Pack", "Pride", "Colony", "Herd"],
      correctIndex: 1,
      explanation: "A group of lions is called a pride, typically consisting of related females, their cubs, and a small number of adult males.",
      category: "Animal Groups",
      difficulty: "easy"
    },
    {
      question: "Which animal sleeps the most hours per day?",
      options: ["Sloth", "Koala", "Brown Bat", "Giant Armadillo"],
      correctIndex: 2,
      explanation: "Brown Bats sleep up to 20 hours a day, which is the most among mammals. They need this rest to conserve energy.",
      category: "Animal Sleep",
      difficulty: "medium"
    },
    {
      question: "What is the fastest land animal?",
      options: ["Cheetah", "Pronghorn Antelope", "Springbok", "Brown Hare"],
      correctIndex: 0,
      explanation: "The Cheetah can reach speeds of up to 70 mph (113 km/h), making it the fastest land animal.",
      category: "Animal Speed",
      difficulty: "easy"
    },
    {
      question: "Which of these animals does NOT hibernate?",
      options: ["Bears", "Skunks", "Elephants", "Groundhogs"],
      correctIndex: 2,
      explanation: "Elephants do not hibernate. They remain active year-round and migrate to find food and water as needed.",
      category: "Animal Behavior",
      difficulty: "medium"
    }
  ];
  
  // Add fixed questions
  questions.push(...fixedAnimalQuestions);
  
  // Animal templates
  const animalTemplates = [
    {
      question: "What is the main diet of a {ANIMAL}?",
      options: ["Carnivore (meat)", "Herbivore (plants)", "Omnivore (both)", "Insectivore (insects)"],
      // correctIndex will be set dynamically
      explanation: "{ANIMALS} are {DIET}s, primarily eating {FOOD}.",
      category: "Animal Diets"
    },
    {
      question: "Where would you naturally find a {ANIMAL} in the wild?",
      options: ["Africa", "Asia", "South America", "Australia"],
      // correctIndex will be set dynamically
      explanation: "{ANIMALS} are native to {HABITAT}, where they {BEHAVIOR}.",
      category: "Animal Habitats"
    },
    {
      question: "How many species of {ANIMAL_TYPE} exist today?",
      options: ["Less than 50", "50-200", "200-500", "More than 500"],
      // correctIndex will be set dynamically
      explanation: "There are approximately {NUMBER} species of {ANIMAL_TYPE} in the world today.",
      category: "Animal Species"
    }
  ];
  
  // Animal data to fill templates
  const animalData = [
    {
      animal: "Giraffe",
      animals: "Giraffes",
      diet: "Herbivore",
      dietIndex: 1,
      food: "leaves from tall trees, especially acacia trees",
      habitat: "Africa",
      habitatIndex: 0,
      behavior: "roam the savannas looking for tall trees to feed on"
    },
    {
      animal: "Penguin",
      animals: "Penguins",
      diet: "Carnivore",
      dietIndex: 0,
      food: "fish, squid, and other marine creatures",
      habitat: "Antarctica and the Southern Hemisphere",
      habitatIndex: 3, // modified for options
      behavior: "huddle together for warmth and dive for food"
    },
    {
      animal: "Tiger",
      animals: "Tigers",
      diet: "Carnivore",
      dietIndex: 0,
      food: "deer, wild boar, and other large mammals",
      habitat: "Asia",
      habitatIndex: 1,
      behavior: "hunt alone and mark their large territories"
    },
    {
      animal: "Kangaroo",
      animals: "Kangaroos",
      diet: "Herbivore",
      dietIndex: 1,
      food: "grass, leaves, and other vegetation",
      habitat: "Australia",
      habitatIndex: 3,
      behavior: "hop around in groups called mobs"
    },
    {
      animal: "Sloth",
      animals: "Sloths",
      diet: "Herbivore",
      dietIndex: 1,
      food: "leaves, buds, and tender shoots",
      habitat: "South America",
      habitatIndex: 2,
      behavior: "move very slowly and sleep up to 20 hours a day"
    }
  ];
  
  // Animal type data
  const animalTypeCounts = [
    { type: "bird", count: "10,500", countIndex: 3 },
    { type: "mammal", count: "6,400", countIndex: 3 },
    { type: "reptile", count: "10,000", countIndex: 3 },
    { type: "amphibian", count: "7,300", countIndex: 3 },
    { type: "fish", count: "34,000", countIndex: 3 },
    { type: "insect", count: "1,000,000", countIndex: 3 },
    { type: "spider", count: "45,000", countIndex: 3 }
  ];
  
  // Generate questions from templates
  for (let i = 0; i < 30; i++) {
    // Diet/habitat template questions
    for (const animalInfo of animalData) {
      // Diet question
      const dietQuestion = { ...animalTemplates[0] };
      dietQuestion.question = dietQuestion.question.replace('{ANIMAL}', animalInfo.animal);
      dietQuestion.explanation = dietQuestion.explanation
        .replace('{ANIMALS}', animalInfo.animals)
        .replace('{DIET}', animalInfo.diet.toLowerCase())
        .replace('{FOOD}', animalInfo.food);
      dietQuestion.correctIndex = animalInfo.dietIndex;
      dietQuestion.difficulty = getRandomDifficulty();
      
      // Habitat question
      const habitatQuestion = { ...animalTemplates[1] };
      habitatQuestion.question = habitatQuestion.question.replace('{ANIMAL}', animalInfo.animal);
      habitatQuestion.explanation = habitatQuestion.explanation
        .replace('{ANIMALS}', animalInfo.animals)
        .replace('{HABITAT}', animalInfo.habitat)
        .replace('{BEHAVIOR}', animalInfo.behavior);
      habitatQuestion.correctIndex = animalInfo.habitatIndex;
      habitatQuestion.difficulty = getRandomDifficulty();
      
      questions.push(dietQuestion, habitatQuestion);
    }
    
    // Species count questions
    for (const typeInfo of animalTypeCounts) {
      const countQuestion = { ...animalTemplates[2] };
      countQuestion.question = countQuestion.question.replace('{ANIMAL_TYPE}', typeInfo.type);
      countQuestion.explanation = countQuestion.explanation
        .replace('{NUMBER}', typeInfo.count)
        .replace('{ANIMAL_TYPE}', typeInfo.type);
      countQuestion.correctIndex = typeInfo.countIndex;
      countQuestion.difficulty = getRandomDifficulty();
      
      questions.push(countQuestion);
    }
  }
  
  return questions;
}

// Generate cat science trivia
function generateCatScienceQuestions() {
  const questions = [
    {
      question: "What is special about a cat's tongue?",
      options: ["It's completely smooth", "It has tiny hooks called papillae", "It can taste sweetness", "It changes color with mood"],
      correctIndex: 1,
      explanation: "A cat's tongue has tiny backward-facing hooks called papillae that help them groom and strip meat from bones.",
      category: "Cat Anatomy",
      difficulty: "medium"
    },
    {
      question: "How many bones does the average adult cat have?",
      options: ["180", "230", "270", "320"],
      correctIndex: 1,
      explanation: "The average adult cat has 230 bones, which is more than humans who have 206 bones.",
      category: "Cat Anatomy",
      difficulty: "hard"
    },
    {
      question: "What is a cat's normal body temperature?",
      options: ["97-99°F (36.1-37.2°C)", "100-102.5°F (37.7-39.2°C)", "103-105°F (39.4-40.6°C)", "106-108°F (41.1-42.2°C)"],
      correctIndex: 1,
      explanation: "A cat's normal body temperature ranges from 100-102.5°F (37.7-39.2°C), which is higher than humans.",
      category: "Cat Physiology",
      difficulty: "medium"
    },
    {
      question: "What is unique about a cat's collar bone (clavicle)?",
      options: ["Cats don't have collar bones", "They're attached to the spine", "They're not attached to other bones", "They're fused to the skull"],
      correctIndex: 2,
      explanation: "A cat's collar bones (clavicles) are not attached to other bones, which contributes to their flexibility and ability to fit through tight spaces.",
      category: "Cat Anatomy",
      difficulty: "hard"
    },
    {
      question: "Why do cats have whiskers?",
      options: ["For balance only", "To sense if they can fit through spaces", "For attracting mates", "They have no function"],
      correctIndex: 1,
      explanation: "Cat whiskers help them determine if they can fit through openings. The whiskers are generally as wide as the cat's body.",
      category: "Cat Anatomy",
      difficulty: "easy"
    }
  ];
  
  // Multiply these questions by changing small details
  const expandedQuestions = [];
  
  for (const q of questions) {
    expandedQuestions.push(q);
    
    // Create variations
    const variation1 = { ...q };
    variation1.question = "According to feline biology, " + q.question.toLowerCase();
    
    const variation2 = { ...q };
    variation2.question = "In terms of cat physiology, " + q.question.toLowerCase();
    
    const variation3 = { ...q };
    variation3.question = "Cat owners often wonder: " + q.question.toLowerCase();
    
    expandedQuestions.push(variation1, variation2, variation3);
  }
  
  return expandedQuestions;
}

// Generate history questions
function generateCatHistoryQuestions() {
  return [
    {
      question: "In which ancient civilization were cats first domesticated?",
      options: ["Ancient Greece", "Ancient Rome", "Ancient Egypt", "Ancient China"],
      correctIndex: 2,
      explanation: "Cats were first domesticated in Ancient Egypt around 4,000 years ago, where they were revered and even worshipped.",
      category: "Cat History",
      difficulty: "medium"
    },
    {
      question: "Which goddess from Ancient Egypt had a cat's head?",
      options: ["Isis", "Bastet", "Hathor", "Sekhmet"],
      correctIndex: 1,
      explanation: "Bastet was the Ancient Egyptian goddess of home, fertility, and protection, often depicted with a cat's head.",
      category: "Cat History",
      difficulty: "medium"
    },
    {
      question: "In the Middle Ages, what were cats falsely associated with?",
      options: ["Healing powers", "Witchcraft", "Royalty", "Good harvests"],
      correctIndex: 1,
      explanation: "During the Middle Ages, cats were often associated with witchcraft and the devil, leading to widespread persecution.",
      category: "Cat History",
      difficulty: "easy"
    },
    {
      question: "When was the first cat show held?",
      options: ["1871 in London", "1901 in New York", "1925 in Paris", "1950 in Tokyo"],
      correctIndex: 0,
      explanation: "The first cat show was held at the Crystal Palace in London in 1871, organized by Harrison Weir.",
      category: "Cat History",
      difficulty: "hard"
    },
    {
      question: "What was the name of the cat that reportedly sailed with Christopher Columbus?",
      options: ["Sailor", "Navigator", "Guacamole", "There was no cat"],
      correctIndex: 3,
      explanation: "Contrary to some myths, there is no historical record of a specific cat sailing with Christopher Columbus.",
      category: "Cat History",
      difficulty: "hard"
    }
  ];
}

// Generate cat facts general questions
function generateCatFactQuestions() {
  const questions = [];
  
  // Basic cat fact templates to multiply
  const factTemplates = [
    {
      question: "Which is NOT true about cats' vision?",
      options: [
        "They see better in dim light than humans", 
        "They can see colors, but less vibrantly than humans", 
        "They have better peripheral vision than humans", 
        "They can see clearly at distances better than humans"
      ],
      correctIndex: 3,
      explanation: "Cats actually have poor distance vision compared to humans. They're nearsighted and see best at distances of about 20 feet or less.",
      category: "Cat Facts",
      difficulty: "medium"
    },
    {
      question: "What percentage of cats are affected by catnip?",
      options: ["10-20%", "30-50%", "60-70%", "80-90%"],
      correctIndex: 1,
      explanation: "Only about 30-50% of cats are affected by catnip. The response is hereditary and kittens under 8 weeks old aren't affected at all.",
      category: "Cat Facts",
      difficulty: "medium"
    },
    {
      question: "How many muscles do cats use to control their ears?",
      options: ["6", "12", "20", "32"],
      correctIndex: 3,
      explanation: "Cats have 32 muscles in each ear, allowing them to move their ears independently and rotate them 180 degrees.",
      category: "Cat Anatomy",
      difficulty: "hard"
    },
    {
      question: "What color can cats NOT see well?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correctIndex: 2,
      explanation: "Cats cannot see the color red well. They see primarily in blue and green, and are not fully colorblind as sometimes believed.",
      category: "Cat Facts",
      difficulty: "medium"
    },
    {
      question: "What is the normal heart rate for a resting adult cat?",
      options: ["60-100 beats per minute", "120-140 beats per minute", "150-200 beats per minute", "220-240 beats per minute"],
      correctIndex: 2,
      explanation: "A cat's normal heart rate is typically 150-200 beats per minute when resting, which is much faster than a human's.",
      category: "Cat Physiology",
      difficulty: "hard"
    }
  ];
  
  // Add the base templates
  questions.push(...factTemplates);
  
  // Generate hundreds more cat fact questions by combining these templates with modifiers
  const questionStarters = [
    "According to veterinarians,",
    "Cat experts say",
    "Research shows that",
    "Studies have proven",
    "In feline physiology,",
    "Interestingly,",
    "Most people don't know that",
    "Did you know that"
  ];
  
  for (let i = 0; i < 20; i++) {
    for (const template of factTemplates) {
      const starter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
      
      // Create variation with starter
      if (!template.question.includes("?")) {
        // Only add starters to questions that are statements
        const variation = { ...template };
        variation.question = `${starter} ${template.question.toLowerCase()}`;
        
        // Randomize difficulty a bit
        const difficulties = ["easy", "medium", "hard"];
        variation.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        questions.push(variation);
      }
    }
  }
  
  return questions;
}

// Generate programmatically varied questions
function generateMassiveQuestionSet() {
  const allQuestions = [
    ...generateCatQuestions(),
    ...generateAnimalQuestions(),
    ...generateCatScienceQuestions(),
    ...generateCatHistoryQuestions(),
    ...generateCatFactQuestions()
  ];
  
  // Remove duplicates by question text
  const uniqueQuestions = [];
  const questionSet = new Set();
  
  for (const q of allQuestions) {
    // Make sure each question has difficulty set
    if (!q.difficulty) {
      q.difficulty = getRandomDifficulty();
    }
    
    // Only add if we haven't seen this question text before
    if (!questionSet.has(q.question)) {
      questionSet.add(q.question);
      uniqueQuestions.push(q);
    }
  }
  
  // Process each question to ensure it has all required fields and correct format
  const processedQuestions = uniqueQuestions.map(q => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    category: q.category,
    difficulty: q.difficulty
  }));
  
  console.log(`Generated ${processedQuestions.length} unique questions`);
  
  return processedQuestions;
}

// Main function
async function generateAndSaveBackup() {
  // Generate questions
  const questions = generateMassiveQuestionSet();
  
  // Create backup format
  const backupData = {
    timestamp: new Date().toISOString(),
    questionCount: questions.length,
    questions: questions
  };
  
  // Save to file
  const backupPath = path.join(__dirname, 'default-trivia-backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
  
  console.log(`Saved ${questions.length} questions to ${backupPath}`);
}

// Run the generator
generateAndSaveBackup();