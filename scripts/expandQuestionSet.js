/**
 * Script to expand the trivia question set by adding batches of new questions
 * Each batch will add more unique, handcrafted questions
 */

import fs from 'fs';
import path from 'path';

// Load the existing questions
const existingBackupPath = path.join('./backups', 'default-trivia-backup.json');
const existingBackup = JSON.parse(fs.readFileSync(existingBackupPath, 'utf8'));
const existingQuestions = existingBackup.questions || [];

console.log(`Starting with ${existingQuestions.length} existing questions`);

// Create a set of existing question texts to avoid duplicates
const existingQuestionTexts = new Set();
for (const q of existingQuestions) {
  existingQuestionTexts.add(q.question);
}

// New batch of questions to add
const newCatQuestions = [
  // Easy cat questions
  {
    question: "What color are most kittens' eyes when they are born?",
    options: ["Green", "Yellow", "Blue", "Brown"],
    correctIndex: 2,
    explanation: "Most kittens are born with blue eyes, which may change color as they mature, usually between 3-8 weeks of age.",
    category: "Cat Development",
    difficulty: "easy"
  },
  {
    question: "How many toes does a typical cat have on each front paw?",
    options: ["Three", "Four", "Five", "Six"],
    correctIndex: 2,
    explanation: "Normal cats have five toes on each front paw and four on each back paw, for a total of eighteen toes.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What is a female cat called?",
    options: ["Doe", "Hen", "Queen", "Dam"],
    correctIndex: 2,
    explanation: "A female cat is called a queen, especially when she is pregnant or nursing kittens.",
    category: "Cat Terminology",
    difficulty: "easy"
  },
  {
    question: "How do cats communicate with each other?",
    options: ["Only through meowing", "Body language and scent", "Only through purring", "Telepathy"],
    correctIndex: 1,
    explanation: "Adult cats rarely meow at each other; they primarily communicate through body language, scent marking, and sometimes vocalizations like hissing or growling.",
    category: "Cat Communication",
    difficulty: "easy"
  },
  {
    question: "What do cats use their whiskers for?",
    options: ["Tasting food", "Measuring spaces", "Attracting mates", "Cooling down"],
    correctIndex: 1,
    explanation: "Cats use their whiskers as measuring tools to determine if they can fit through spaces - they're typically as wide as the cat's body.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  
  // Medium cat questions
  {
    question: "Why do cats have rough tongues?",
    options: ["To scrape meat from bones", "For grooming their fur", "To taste bitter flavors", "To drink water more efficiently"],
    correctIndex: 1,
    explanation: "Cats have tiny backward-facing hooks called papillae on their tongues that help them groom by removing dirt and loose fur, almost like a built-in brush.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What is special about a cat's hearing?",
    options: ["They can only hear high pitches", "They can hear ultrasonic sounds", "They can hear underwater", "They cannot locate sound direction"],
    correctIndex: 1,
    explanation: "Cats can hear ultrasonic sounds that humans and even dogs cannot detect, including the high-pitched sounds made by rodents.",
    category: "Cat Senses",
    difficulty: "medium"
  },
  {
    question: "What percentage of a cat's day is spent grooming?",
    options: ["About 5%", "About 15%", "About 30%", "About 50%"],
    correctIndex: 2,
    explanation: "Cats spend approximately 30-50% of their waking hours grooming themselves, which helps with coat maintenance, cooling, and bonding.",
    category: "Cat Behavior",
    difficulty: "medium"
  },
  {
    question: "Which part of a cat's body contains sweat glands?",
    options: ["Entire body", "Only the fur", "Paw pads", "Only the nose"],
    correctIndex: 2,
    explanation: "Cats only have sweat glands on their paw pads, which is why you might see wet paw prints when a cat is hot or stressed.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What is unique about a cat's spine compared to humans?",
    options: ["It has more vertebrae", "It's less flexible", "It lacks discs", "It grows throughout life"],
    correctIndex: 0,
    explanation: "Cats have more vertebrae than humans (52-53 compared to our 33), which contributes to their incredible flexibility.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  
  // Hard cat questions
  {
    question: "What genetic mutation causes 'toe beans' to be black on some cats?",
    options: ["Melanism", "Leucism", "Piebaldism", "Hypermelanosis"],
    correctIndex: 0,
    explanation: "Melanism is a genetic condition that causes excess dark pigmentation, resulting in black paw pads or 'toe beans' on some cats.",
    category: "Cat Genetics",
    difficulty: "hard"
  },
  {
    question: "Which cat breed has naturally bent ear tips?",
    options: ["American Curl", "Scottish Fold", "Devon Rex", "Siamese"],
    correctIndex: 0,
    explanation: "The American Curl has a natural mutation causing the ears to curve backward in an arc, unlike the Scottish Fold whose ears fold downward.",
    category: "Cat Breeds",
    difficulty: "hard"
  },
  {
    question: "What medical phenomenon occurs in the brains of cats who eat raw fish?",
    options: ["Hypervitaminosis", "Thiamine deficiency", "Mercury poisoning", "Protein intoxication"],
    correctIndex: 1,
    explanation: "Raw fish contains thiaminase, which breaks down thiamine (vitamin B1) and can lead to neurological problems in cats when consumed regularly.",
    category: "Cat Health",
    difficulty: "hard"
  },
  {
    question: "What is feline hyperesthesia syndrome?",
    options: ["Excessive hunger", "Skin hypersensitivity", "Enhanced vision", "Improved reflexes"],
    correctIndex: 1,
    explanation: "Feline hyperesthesia syndrome is a rare condition where a cat's skin becomes hypersensitive, causing twitching, aggression, and self-harm behaviors.",
    category: "Cat Health",
    difficulty: "hard"
  },
  {
    question: "What is unique about the Manx cat's genetics?",
    options: ["Carries a lethal gene", "Has extra chromosomes", "Lacks mutations", "Cannot interbreed"],
    correctIndex: 0,
    explanation: "The Manx tailless gene is actually a lethal gene in its homozygous form - kittens with two copies die before birth, so all Manx cats are heterozygous.",
    category: "Cat Genetics",
    difficulty: "hard"
  }
];

const newAnimalQuestions = [
  // Easy animal questions
  {
    question: "Which animal is known as the king of the jungle?",
    options: ["Tiger", "Lion", "Elephant", "Gorilla"],
    correctIndex: 1,
    explanation: "Despite living in savannas, not jungles, the lion is traditionally known as the 'king of the jungle' due to its majestic appearance and role as apex predator.",
    category: "Animal Nicknames",
    difficulty: "easy"
  },
  {
    question: "What do you call a baby kangaroo?",
    options: ["Kitten", "Joey", "Calf", "Cub"],
    correctIndex: 1,
    explanation: "A baby kangaroo is called a joey. It's born extremely undeveloped and crawls into its mother's pouch to continue developing.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  {
    question: "Which of these animals hibernates?",
    options: ["Wolf", "Bear", "Deer", "Squirrel"],
    correctIndex: 1,
    explanation: "Bears enter a state of hibernation during winter months when food is scarce, lowering their body temperature and metabolic rate to conserve energy.",
    category: "Animal Behavior",
    difficulty: "easy"
  },
  {
    question: "What is a group of wolves called?",
    options: ["Herd", "Flock", "Pack", "School"],
    correctIndex: 2,
    explanation: "A group of wolves is called a pack. Wolf packs are family groups that hunt, care for young, and defend territory together.",
    category: "Animal Groups",
    difficulty: "easy"
  },
  {
    question: "Which animal has stripes for camouflage?",
    options: ["Elephant", "Zebra", "Giraffe", "Hippo"],
    correctIndex: 1,
    explanation: "Zebras have black and white stripes that help confuse predators by making it difficult to isolate a single animal from the herd.",
    category: "Animal Adaptations",
    difficulty: "easy"
  },
  
  // Medium animal questions
  {
    question: "Which animal has the most powerful jump relative to body size?",
    options: ["Kangaroo", "Flea", "Frog", "Grasshopper"],
    correctIndex: 1,
    explanation: "Fleas can jump over 100 times their body length, equivalent to a human jumping the length of a football field.",
    category: "Animal Abilities",
    difficulty: "medium"
  },
  {
    question: "Which animal communicates using echolocation?",
    options: ["Elephant", "Owl", "Dolphin", "Snake"],
    correctIndex: 2,
    explanation: "Dolphins emit clicks and listen for echoes to navigate and find prey, essentially using sound to 'see' underwater.",
    category: "Animal Communication",
    difficulty: "medium"
  },
  {
    question: "Which animal has the highest blood pressure?",
    options: ["Elephant", "Giraffe", "Blue whale", "Cheetah"],
    correctIndex: 1,
    explanation: "Giraffes have extremely high blood pressure (about twice that of humans) to pump blood up their long necks to their brains.",
    category: "Animal Physiology",
    difficulty: "medium"
  },
  {
    question: "Which animal has the thickest fur of any mammal?",
    options: ["Polar bear", "Arctic fox", "Sea otter", "Siberian husky"],
    correctIndex: 2,
    explanation: "Sea otters have the densest fur of any mammal with up to one million hairs per square inch, which keeps them warm in cold water.",
    category: "Animal Adaptations",
    difficulty: "medium"
  },
  {
    question: "Which animal performs the longest annual migration?",
    options: ["Caribou", "Monarch butterfly", "Arctic tern", "Humpback whale"],
    correctIndex: 2,
    explanation: "Arctic terns migrate from the Arctic to the Antarctic and back each year, traveling about 44,000 miles annually.",
    category: "Animal Migration",
    difficulty: "medium"
  },
  
  // Hard animal questions
  {
    question: "Which animal can survive the highest radiation doses?",
    options: ["Cockroach", "Tardigrade", "Scorpion", "Desert rat"],
    correctIndex: 1,
    explanation: "Tardigrades (water bears) can survive radiation doses thousands of times higher than would be fatal to humans, due to unique DNA repair proteins.",
    category: "Animal Adaptations",
    difficulty: "hard"
  },
  {
    question: "Which animal has a heart that can change size seasonally?",
    options: ["Python", "Hummingbird", "Penguin", "Grizzly bear"],
    correctIndex: 0,
    explanation: "Pythons can increase their heart size by 40% after a large meal to help digest, then shrink it back to normal when digestion is complete.",
    category: "Animal Physiology",
    difficulty: "hard"
  },
  {
    question: "Which animal can delay its pregnancy after fertilization?",
    options: ["Giant panda", "Roe deer", "Kangaroo", "Sloth"],
    correctIndex: 1,
    explanation: "Roe deer can delay implantation of fertilized eggs for several months, allowing them to mate in summer but give birth in spring when conditions are better.",
    category: "Animal Reproduction",
    difficulty: "hard"
  },
  {
    question: "Which animal produces the most toxic venom?",
    options: ["Inland taipan", "Box jellyfish", "Blue-ringed octopus", "Cone snail"],
    correctIndex: 0,
    explanation: "The inland taipan of Australia produces the most toxic venom of any snake, with enough toxicity in one bite to kill about 100 humans.",
    category: "Animal Defenses",
    difficulty: "hard"
  },
  {
    question: "Which animal can recognize itself in a mirror?",
    options: ["Dog", "Dolphin", "Lizard", "Crow"],
    correctIndex: 1,
    explanation: "Dolphins can recognize themselves in mirrors, demonstrating self-awareness, a rare cognitive ability only found in a few species including great apes and elephants.",
    category: "Animal Intelligence",
    difficulty: "hard"
  }
];

// Add the new questions to the existing ones, making sure to avoid duplicates
let nextId = existingQuestions.length + 1;
const newQuestions = [];

function addUniqueQuestion(question) {
  if (!existingQuestionTexts.has(question.question)) {
    existingQuestionTexts.add(question.question);
    newQuestions.push({
      id: nextId++,
      ...question
    });
    return true;
  }
  return false;
}

// Add all the new questions
let catAdded = 0;
for (const q of newCatQuestions) {
  if (addUniqueQuestion(q)) {
    catAdded++;
  }
}

let animalAdded = 0;
for (const q of newAnimalQuestions) {
  if (addUniqueQuestion(q)) {
    animalAdded++;
  }
}

console.log(`Added ${catAdded} new cat questions and ${animalAdded} new animal questions`);

// Combine with existing questions
const allQuestions = [...existingQuestions, ...newQuestions];

// Create updated backup object
const updatedBackup = {
  timestamp: new Date().toISOString(),
  questionCount: allQuestions.length,
  catQuestionCount: existingBackup.catQuestionCount + catAdded,
  animalQuestionCount: existingBackup.animalQuestionCount + animalAdded,
  questions: allQuestions
};

// Save to backup files
const updatedPath = path.join('./backups', 'expanded-trivia-backup.json');
fs.writeFileSync(updatedPath, JSON.stringify(updatedBackup, null, 2));
console.log(`Saved expanded backup to ${updatedPath}`);

// Update the default backup for server to use
fs.writeFileSync(existingBackupPath, JSON.stringify(updatedBackup, null, 2));
console.log(`Updated default backup with new questions`);

// Calculate difficulty distribution
const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;

console.log("\nCurrent question set statistics:");
console.log(`Total questions: ${allQuestions.length}`);
console.log(`Cat questions: ${updatedBackup.catQuestionCount}`);
console.log(`Animal questions: ${updatedBackup.animalQuestionCount}`);
console.log(`\nDifficulty distribution:`);
console.log(`Easy: ${easyCount} (${(easyCount/allQuestions.length*100).toFixed(1)}%)`);
console.log(`Medium: ${mediumCount} (${(mediumCount/allQuestions.length*100).toFixed(1)}%)`);
console.log(`Hard: ${hardCount} (${(hardCount/allQuestions.length*100).toFixed(1)}%)`);

console.log("\nTarget: 50,000 questions");
console.log(`Progress: ${(allQuestions.length/50000*100).toFixed(2)}%`);
console.log(`Remaining: ${50000 - allQuestions.length} questions`);