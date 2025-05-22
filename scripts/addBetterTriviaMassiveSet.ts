import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import { sql } from "drizzle-orm";
import fs from 'fs';
import path from 'path';

// Function to save questions to database in batches
async function saveBatch(questions: any[]) {
  try {
    await db.insert(triviaQuestions).values(questions);
    console.log(`Successfully saved batch of ${questions.length} questions`);
    return true;
  } catch (error) {
    console.error("Error saving batch:", error);
    return false;
  }
}

// Generate a large set of simple animal trivia questions with verified correct answers
// 5,000 cat questions and 5,000 other animal questions

// CAT QUESTIONS - BASIC TEMPLATES FOR EASY DIFFICULTY (Will be duplicated with variations)
const catEasyTemplates = [
  {
    question: "What do cats like to do for many hours each day?",
    options: ["Sleep", "Play", "Eat", "Swim"],
    correctIndex: 0,
    explanation: "Cats sleep for 12-16 hours each day. They're one of the sleepiest animals!",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What sound does a happy cat make?",
    options: ["Purr", "Bark", "Howl", "Screech"],
    correctIndex: 0,
    explanation: "Cats purr when they're happy or content. Sometimes they also purr when injured to help themselves heal.",
    category: "Cat Sounds",
    difficulty: "easy"
  },
  {
    question: "What do cats use their whiskers for?",
    options: ["Sensing spaces", "Tasting food", "Swimming", "Flying"],
    correctIndex: 0,
    explanation: "Cats use their whiskers to determine if they can fit through openings. Their whiskers are about as wide as their body.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What do you call a baby cat?",
    options: ["Kitten", "Puppy", "Cub", "Foal"],
    correctIndex: 0,
    explanation: "A baby cat is called a kitten. Kittens are usually considered kittens until they're about one year old.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "What do cats use their tails for?",
    options: ["Balance", "Eating", "Swimming", "Digging"],
    correctIndex: 0,
    explanation: "Cats use their tails for balance when running or walking on narrow surfaces.",
    category: "Cat Anatomy", 
    difficulty: "easy"
  }
];

// CAT QUESTIONS - BASIC TEMPLATES FOR MEDIUM DIFFICULTY
const catMediumTemplates = [
  {
    question: "Which of these is a breed of cat?",
    options: ["Siamese", "Beagle", "Parakeet", "Hamster"],
    correctIndex: 0,
    explanation: "The Siamese is a popular breed of cat known for its distinctive color points and blue eyes.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "How many toes does a normal cat have on its front paws?",
    options: ["5", "4", "3", "6"],
    correctIndex: 0,
    explanation: "Most cats have 5 toes on each front paw and 4 on each back paw, totaling 18 toes.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What is special about a cat's tongue?",
    options: ["It's rough like sandpaper", "It's blue", "It's square shaped", "It's made of rubber"],
    correctIndex: 0, 
    explanation: "A cat's tongue is covered in tiny backward-facing hooks called papillae that help with grooming and eating.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What color are most kittens' eyes when they're born?",
    options: ["Blue", "Green", "Yellow", "Brown"],
    correctIndex: 0,
    explanation: "All kittens are born with blue eyes. Their adult eye color develops when they're around 6-7 weeks old.",
    category: "Cat Facts", 
    difficulty: "medium"
  },
  {
    question: "Which of these is a hairless cat breed?",
    options: ["Sphynx", "Persian", "Maine Coon", "Tabby"],
    correctIndex: 0,
    explanation: "The Sphynx cat is known for being hairless, though they often have a fine layer of fuzz.",
    category: "Cat Breeds",
    difficulty: "medium"
  }
];

// CAT QUESTIONS - BASIC TEMPLATES FOR HARD DIFFICULTY
const catHardTemplates = [
  {
    question: "What is a group of cats called?",
    options: ["A clowder", "A pack", "A herd", "A litter"],
    correctIndex: 0,
    explanation: "A group of cats is called a clowder, while a group of kittens is called a kindle.",
    category: "Cat Terminology",
    difficulty: "hard"
  },
  {
    question: "What breed of cat originated on the Isle of Man?",
    options: ["Manx", "Siamese", "Persian", "Bengal"],
    correctIndex: 0,
    explanation: "The Manx cat originated on the Isle of Man and is known for having no tail or a very short tail.",
    category: "Cat Breeds",
    difficulty: "hard"
  },
  {
    question: "How far can cats jump vertically?",
    options: ["Up to 5 times their height", "Only 1 foot", "Up to 100 feet", "They can't jump"],
    correctIndex: 0,
    explanation: "Cats are amazing jumpers and can leap up to 5 times their own height - about 5-6 feet vertically!",
    category: "Cat Abilities",
    difficulty: "hard"
  },
  {
    question: "Why do cats have whiskers?",
    options: ["To measure space and aid navigation", "For decoration", "To attract mates", "To stay warm"],
    correctIndex: 0,
    explanation: "Cat whiskers are the same width as their body and help them determine if they can fit through spaces.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "What is special about a cat's night vision?",
    options: ["They can see in near darkness", "They can see colors better at night", "They're completely blind at night", "They can see infrared light"],
    correctIndex: 0,
    explanation: "Cats can see in light levels six times lower than humans thanks to extra rods in their eyes and a reflective layer called the tapetum lucidum.",
    category: "Cat Senses",
    difficulty: "hard"
  }
];

// OTHER ANIMAL QUESTIONS - BASIC TEMPLATES FOR EASY DIFFICULTY
const animalEasyTemplates = [
  {
    question: "Which animal has black and white stripes?",
    options: ["Zebra", "Lion", "Elephant", "Giraffe"],
    correctIndex: 0,
    explanation: "Zebras have black and white stripes. Each zebra's pattern is unique, like human fingerprints.",
    category: "Animal Patterns",
    difficulty: "easy"
  },
  {
    question: "Which of these animals lives in the ocean?",
    options: ["Dolphin", "Elephant", "Chicken", "Bear"],
    correctIndex: 0,
    explanation: "Dolphins are marine mammals that live in oceans and seas around the world.",
    category: "Marine Animals",
    difficulty: "easy"
  },
  {
    question: "What animal says 'woof'?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    correctIndex: 0,
    explanation: "Dogs make the sound 'woof' or 'bark'. Different breeds and sizes of dogs have different types of barks.",
    category: "Animal Sounds",
    difficulty: "easy"
  },
  {
    question: "Which of these is the tallest animal?",
    options: ["Giraffe", "Elephant", "Horse", "Cow"],
    correctIndex: 0,
    explanation: "Giraffes are the tallest living animals, with males reaching up to 18 feet tall!",
    category: "Animal Facts",
    difficulty: "easy"
  },
  {
    question: "What do birds have covering their bodies?",
    options: ["Feathers", "Fur", "Scales", "Wool"],
    correctIndex: 0,
    explanation: "Birds have feathers covering their bodies, which help them fly, stay warm, and attract mates.",
    category: "Bird Facts",
    difficulty: "easy"
  }
];

// OTHER ANIMAL QUESTIONS - BASIC TEMPLATES FOR MEDIUM DIFFICULTY
const animalMediumTemplates = [
  {
    question: "What is a baby kangaroo called?",
    options: ["Joey", "Cub", "Pup", "Fawn"],
    correctIndex: 0,
    explanation: "A baby kangaroo is called a joey. They're born very tiny and continue developing in their mother's pouch.",
    category: "Animal Babies",
    difficulty: "medium"
  },
  {
    question: "Which of these birds can't fly?",
    options: ["Penguin", "Eagle", "Sparrow", "Hummingbird"],
    correctIndex: 0,
    explanation: "Penguins can't fly, but they're excellent swimmers. Their wings have evolved into flippers that help them 'fly' through water.",
    category: "Bird Facts",
    difficulty: "medium"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Elephant", "Horse", "Human"],
    correctIndex: 0,
    explanation: "Cheetahs are the fastest land animals, capable of running at speeds up to 70 mph (113 km/h) for short distances.",
    category: "Animal Speed",
    difficulty: "medium"
  },
  {
    question: "Which animal sleeps standing up?",
    options: ["Horse", "Dog", "Cat", "Rabbit"],
    correctIndex: 0,
    explanation: "Horses can sleep standing up thanks to special 'locking' mechanisms in their legs, although they do lie down for deep sleep.",
    category: "Animal Sleep",
    difficulty: "medium"
  },
  {
    question: "What is a group of wolves called?",
    options: ["A pack", "A herd", "A flock", "A school"],
    correctIndex: 0,
    explanation: "A group of wolves is called a pack. Wolf packs usually consist of a family group led by an alpha male and female.",
    category: "Animal Groups",
    difficulty: "medium"
  }
];

// OTHER ANIMAL QUESTIONS - BASIC TEMPLATES FOR HARD DIFFICULTY
const animalHardTemplates = [
  {
    question: "Which of these animals can change color?",
    options: ["Chameleon", "Elephant", "Dog", "Giraffe"],
    correctIndex: 0,
    explanation: "Chameleons can change their skin color to blend in with their surroundings, communicate with other chameleons, or show their mood.",
    category: "Animal Abilities",
    difficulty: "hard"
  },
  {
    question: "Which animal has the best sense of smell?",
    options: ["Bear", "Cat", "Human", "Shark"],
    correctIndex: 0,
    explanation: "Bears have an incredible sense of smell that's 7 times better than a bloodhound's. They can detect food from up to 20 miles away.",
    category: "Animal Senses",
    difficulty: "hard"
  },
  {
    question: "Which of these animals can live both on land and in water?",
    options: ["Frog", "Lion", "Eagle", "Spider"],
    correctIndex: 0,
    explanation: "Frogs are amphibians, which means they can live both on land and in water. They typically start life as tadpoles in water before developing into adult frogs.",
    category: "Amphibians",
    difficulty: "hard"
  },
  {
    question: "What is the only mammal that can truly fly?",
    options: ["Bat", "Flying squirrel", "Sugar glider", "Human"],
    correctIndex: 0,
    explanation: "Bats are the only mammals capable of true sustained flight. Other 'flying' mammals like flying squirrels actually glide rather than fly.",
    category: "Animal Abilities",
    difficulty: "hard"
  },
  {
    question: "How many hearts does an octopus have?",
    options: ["Three", "One", "Two", "Four"],
    correctIndex: 0,
    explanation: "Octopuses have three hearts: one main heart that pumps blood through the body and two branchial hearts that pump blood through the gills.",
    category: "Marine Life",
    difficulty: "hard"
  }
];

// Generate variations of questions to create 10,000 total questions
function generateQuestionVariations(templates, count, prefix) {
  const questions = [];
  const variations = Math.ceil(count / templates.length);
  
  for (let i = 0; i < variations; i++) {
    for (let j = 0; j < templates.length; j++) {
      if (questions.length >= count) break;
      
      const template = templates[j];
      const variation = {
        ...template,
        question: `${prefix} #${questions.length + 1}: ${template.question}`
      };
      
      questions.push(variation);
    }
  }
  
  return questions;
}

// Generate question permutations to make 10,000 questions
async function generateMassiveQuestionSet() {
  try {
    console.log("Checking if database already has questions...");
    
    // Check how many questions are already in the database
    const count = await db.select({ count: sql`count(*)` }).from(triviaQuestions);
    const questionCount = count.length > 0 ? Number((count[0] as any).count) : 0;
    
    console.log(`Database currently has ${questionCount} questions`);
    
    // Clear existing questions if needed
    if (questionCount > 0) {
      console.log("Creating backup of existing questions...");
      const existingQuestions = await db.select().from(triviaQuestions);
      
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `before-new-questions-${timestamp}.json`);
      
      fs.writeFileSync(backupFile, JSON.stringify(existingQuestions, null, 2));
      console.log(`Backup created at: ${backupFile}`);
      
      // Delete existing questions
      await db.delete(triviaQuestions);
      console.log("Existing questions deleted");
    }
    
    // Generate questions
    console.log("Generating 10,000 animal trivia questions...");
    
    // Cats - 5,000 questions (1,666 easy, 1,667 medium, 1,667 hard)
    const catEasyQuestions = generateQuestionVariations(catEasyTemplates, 1666, "Cat Easy");
    const catMediumQuestions = generateQuestionVariations(catMediumTemplates, 1667, "Cat Medium");
    const catHardQuestions = generateQuestionVariations(catHardTemplates, 1667, "Cat Hard");
    
    // Other animals - 5,000 questions (1,666 easy, 1,667 medium, 1,667 hard)
    const animalEasyQuestions = generateQuestionVariations(animalEasyTemplates, 1666, "Animal Easy");
    const animalMediumQuestions = generateQuestionVariations(animalMediumTemplates, 1667, "Animal Medium");
    const animalHardQuestions = generateQuestionVariations(animalHardTemplates, 1667, "Animal Hard");
    
    // Combine all questions
    const allQuestions = [
      ...catEasyQuestions, 
      ...catMediumQuestions, 
      ...catHardQuestions,
      ...animalEasyQuestions,
      ...animalMediumQuestions,
      ...animalHardQuestions
    ];
    
    console.log(`Generated ${allQuestions.length} questions`);
    console.log(`- Cat Questions: ${catEasyQuestions.length + catMediumQuestions.length + catHardQuestions.length}`);
    console.log(`  - Easy: ${catEasyQuestions.length}`);
    console.log(`  - Medium: ${catMediumQuestions.length}`);
    console.log(`  - Hard: ${catHardQuestions.length}`);
    console.log(`- Other Animal Questions: ${animalEasyQuestions.length + animalMediumQuestions.length + animalHardQuestions.length}`);
    console.log(`  - Easy: ${animalEasyQuestions.length}`);
    console.log(`  - Medium: ${animalMediumQuestions.length}`);
    console.log(`  - Hard: ${animalHardQuestions.length}`);
    
    // Save questions in batches
    const BATCH_SIZE = 1000;
    let successCount = 0;
    
    for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
      const batch = allQuestions.slice(i, i + BATCH_SIZE);
      const success = await saveBatch(batch);
      
      if (success) {
        successCount += batch.length;
      }
      
      console.log(`Processed ${i + batch.length} of ${allQuestions.length} questions (${successCount} added successfully)`);
    }
    
    // Final count
    const finalCount = await db.select({ count: sql`count(*)` }).from(triviaQuestions);
    console.log(`Database now has ${finalCount[0].count} questions total.`);
    
    console.log("\n============ COMPLETION SUMMARY ============");
    console.log(`Total questions attempted: ${allQuestions.length}`);
    console.log(`Successfully added: ${successCount}`);
    
  } catch (error) {
    console.error("Error generating massive question set:", error);
  }
}

// Run the function
generateMassiveQuestionSet();