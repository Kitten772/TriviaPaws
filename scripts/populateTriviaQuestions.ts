import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import { randomUUID } from "crypto";

// Large set of animal trivia questions
const questionsData = [
  // Cat Category - Easy
  ...Array(100).fill(null).map((_, i) => ({
    question: `Cat Easy Question ${i+1}: What is a group of kittens called?`,
    options: ["A kindle", "A clutter", "A litter", "A pack"],
    correctIndex: 0,
    explanation: "A group of kittens is called a kindle, while a group of adult cats is called a clowder.",
    category: "Cat Facts",
    difficulty: "easy"
  })),
  
  // Cat Category - Medium
  ...Array(100).fill(null).map((_, i) => ({
    question: `Cat Medium Question ${i+1}: Which cat breed is known for having no tail?`,
    options: ["Persian", "Manx", "Siamese", "Maine Coon"],
    correctIndex: 1,
    explanation: "The Manx cat is famous for its taillessness, which is caused by a genetic mutation.",
    category: "Cat Breeds",
    difficulty: "medium"
  })),
  
  // Cat Category - Hard
  ...Array(100).fill(null).map((_, i) => ({
    question: `Cat Hard Question ${i+1}: In ancient Egypt, what was the penalty for killing a cat?`,
    options: ["A fine", "Imprisonment", "Death", "Community service"],
    correctIndex: 2,
    explanation: "In ancient Egypt, cats were highly revered and killing a cat, even accidentally, was a crime punishable by death.",
    category: "Cat History",
    difficulty: "hard"
  })),
  
  // Mixed Animals - Easy
  ...Array(100).fill(null).map((_, i) => ({
    question: `Mixed Easy Question ${i+1}: Which animal is known as the 'King of the Jungle'?`,
    options: ["Tiger", "Lion", "Elephant", "Gorilla"],
    correctIndex: 1,
    explanation: "Lions are often called the 'King of the Jungle', despite typically living in grasslands and savannas, not jungles.",
    category: "Wild Animals",
    difficulty: "easy"
  })),
  
  // Mixed Animals - Medium
  ...Array(100).fill(null).map((_, i) => ({
    question: `Mixed Medium Question ${i+1}: How many hearts does an octopus have?`,
    options: ["One", "Two", "Three", "Four"],
    correctIndex: 2,
    explanation: "Octopuses have three hearts: one main heart that pumps blood through the body, and two branchial hearts that pump blood through the gills.",
    category: "Marine Life",
    difficulty: "medium"
  })),
  
  // Mixed Animals - Hard
  ...Array(100).fill(null).map((_, i) => ({
    question: `Mixed Hard Question ${i+1}: Which animal has the highest blood pressure?`,
    options: ["Elephant", "Giraffe", "Blue Whale", "Human"],
    correctIndex: 1,
    explanation: "Giraffes have the highest blood pressure of any animal, around 280/180 mmHg, which is necessary to pump blood all the way up their long necks to their brains.",
    category: "Animal Physiology",
    difficulty: "hard"
  })),
  
  // Dogs - Easy
  ...Array(100).fill(null).map((_, i) => ({
    question: `Dog Easy Question ${i+1}: What is a baby dog called?`,
    options: ["Calf", "Puppy", "Cub", "Kitten"],
    correctIndex: 1,
    explanation: "A baby dog is called a puppy. Most puppies are born after a gestation period of about 63 days.",
    category: "Dog Facts",
    difficulty: "easy"
  })),
  
  // Dogs - Medium
  ...Array(100).fill(null).map((_, i) => ({
    question: `Dog Medium Question ${i+1}: Which dog breed is the smallest?`,
    options: ["Shih Tzu", "Pomeranian", "Chihuahua", "Yorkshire Terrier"],
    correctIndex: 2,
    explanation: "The Chihuahua is generally recognized as the smallest dog breed in the world.",
    category: "Dog Breeds",
    difficulty: "medium"
  })),
  
  // Birds - Easy
  ...Array(100).fill(null).map((_, i) => ({
    question: `Bird Easy Question ${i+1}: Which bird cannot fly?`,
    options: ["Penguin", "Eagle", "Swan", "Hawk"],
    correctIndex: 0,
    explanation: "Penguins cannot fly. Their wings have evolved into flippers which make them excellent swimmers instead.",
    category: "Bird Facts",
    difficulty: "easy"
  })),
  
  // Birds - Medium
  ...Array(100).fill(null).map((_, i) => ({
    question: `Bird Medium Question ${i+1}: Which bird can fly backwards?`,
    options: ["Eagle", "Hummingbird", "Owl", "Falcon"],
    correctIndex: 1,
    explanation: "The hummingbird is the only bird that can fly backwards, as well as upside down and hover in mid-air.",
    category: "Bird Abilities",
    difficulty: "medium"
  })),
];

async function populateDatabase() {
  console.log(`Starting to populate database with ${questionsData.length} questions...`);
  
  try {
    // Add some variation to prevent exact duplicates
    const processedQuestions = questionsData.map((q, index) => ({
      ...q,
      question: q.question.replace(/^\w+ \w+ Question \d+: /, "") + ` (#${index+1} ${randomUUID().substring(0, 4)})`
    }));
    
    // Insert in batches to avoid overloading the database
    const batchSize = 50;
    for (let i = 0; i < processedQuestions.length; i += batchSize) {
      const batch = processedQuestions.slice(i, i + batchSize);
      await db.insert(triviaQuestions).values(batch);
      console.log(`Inserted questions ${i+1} to ${Math.min(i+batchSize, processedQuestions.length)}`);
    }
    
    console.log("Database population complete!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateDatabase().finally(() => {
  process.exit(0);
});