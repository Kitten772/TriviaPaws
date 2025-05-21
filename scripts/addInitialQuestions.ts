import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";

// A smaller set of initial questions that won't overwhelm the database
const initialQuestions = [
  // Cat questions - Easy
  {
    question: "What is a group of cats called?",
    options: ["A clowder", "A pride", "A litter", "A herd"],
    correctIndex: 0,
    explanation: "A group of cats is called a clowder, while a group of kittens is called a kindle.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "Which famous internet cat had a permanently grumpy facial expression?",
    options: ["Lil Bub", "Grumpy Cat", "Maru", "Keyboard Cat"],
    correctIndex: 1,
    explanation: "Grumpy Cat (real name Tardar Sauce) became famous for her permanently grumpy facial expression caused by feline dwarfism.",
    category: "Famous Cats",
    difficulty: "easy"
  },
  
  // Cat questions - Medium
  {
    question: "How many toes does a normal cat have on its front paws?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    explanation: "Most cats have 5 toes on their front paws and 4 on their back paws, for a total of 18.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "Which cat breed is known for having no fur?",
    options: ["Persian", "Maine Coon", "Sphynx", "Siamese"],
    correctIndex: 2,
    explanation: "The Sphynx cat is known for being hairless, although they may have a fine layer of fuzz.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  
  // Cat questions - Hard
  {
    question: "What was the name of the ancient Egyptian goddess with a cat's head?",
    options: ["Isis", "Bastet", "Hathor", "Sekhmet"],
    correctIndex: 1,
    explanation: "Bastet was a goddess of protection and cats, often depicted with a cat's head on a woman's body.",
    category: "Cats in History",
    difficulty: "hard"
  },
  {
    question: "In what year was the first cat show held?",
    options: ["1851", "1871", "1901", "1921"],
    correctIndex: 1,
    explanation: "The first cat show was held at the Crystal Palace in London in 1871, organized by Harrison Weir.",
    category: "Cat History",
    difficulty: "hard"
  },
  
  // Mixed animals - Easy
  {
    question: "Which bird cannot fly?",
    options: ["Penguin", "Eagle", "Swan", "Hawk"],
    correctIndex: 0,
    explanation: "Penguins cannot fly. Their wings have evolved into flippers which make them excellent swimmers instead.",
    category: "Bird Facts",
    difficulty: "easy"
  },
  {
    question: "What is a baby kangaroo called?",
    options: ["Cub", "Fawn", "Joey", "Kid"],
    correctIndex: 2,
    explanation: "A baby kangaroo is called a joey. They're born very underdeveloped and continue to grow in their mother's pouch.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  
  // Mixed animals - Medium
  {
    question: "Which animal sleeps standing up?",
    options: ["Cow", "Horse", "Giraffe", "Elephant"],
    correctIndex: 1,
    explanation: "Horses can sleep standing up thanks to a 'stay apparatus' in their legs that locks their joints in place.",
    category: "Animal Sleep",
    difficulty: "medium"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Gazelle", "Ostrich"],
    correctIndex: 0,
    explanation: "Cheetahs can reach speeds of up to 70 mph (113 km/h) for short bursts.",
    category: "Animal Speed",
    difficulty: "medium"
  },
  
  // Mixed animals - Hard
  {
    question: "How many hearts does an octopus have?",
    options: ["1", "2", "3", "8"],
    correctIndex: 2,
    explanation: "Octopuses have three hearts: one main heart that pumps blood through the body and two branchial hearts that pump blood through the gills.",
    category: "Marine Life",
    difficulty: "hard"
  },
  {
    question: "Which animal has the best sense of smell?",
    options: ["Bear", "Dog", "Shark", "Elephant"],
    correctIndex: 1,
    explanation: "Dogs have up to 300 million olfactory receptors in their noses, compared to about 6 million in humans.",
    category: "Animal Senses",
    difficulty: "hard"
  }
];

async function addInitialQuestions() {
  try {
    console.log("Checking if database already has questions...");
    
    // Check if there are already questions in the database
    const count = await db
      .select({ count: sql`count(*)` })
      .from(triviaQuestions);
    
    // If there are already questions, don't add more
    if (count[0].count > 0) {
      console.log(`Database already has ${count[0].count} questions. Skipping initial load.`);
      console.log("If you want to add more, backup first and then run with --force flag");
      return;
    }
    
    console.log("Adding initial questions to database...");
    
    // Add the initial questions
    await db.insert(triviaQuestions).values(initialQuestions);
    
    console.log(`Successfully added ${initialQuestions.length} initial questions to the database!`);
    
    // Now create a backup of these initial questions
    console.log("Creating initial backup...");
    
    // Create backup
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `initial-questions-${timestamp}.json`);
    
    fs.writeFileSync(backupFile, JSON.stringify(initialQuestions, null, 2));
    
    console.log(`Initial backup created at: ${backupFile}`);
    
  } catch (error) {
    console.error("Error adding initial questions:", error);
  } finally {
    process.exit(0);
  }
}

// Import missing modules needed for backup
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';

// Execute the function
addInitialQuestions();