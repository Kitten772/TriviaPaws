/**
 * Script to generate a high-quality, diverse set of trivia questions
 * No duplicates, varied topics, with proper category distribution
 */

import fs from 'fs';
import path from 'path';

// Create a set of unique animal questions to add variety to our game
const uniqueAnimalQuestions = [
  // ANIMAL QUESTIONS - EASY
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Leopard", "Jaguar"],
    correctIndex: 1,
    explanation: "The lion is often called the 'King of the Jungle', despite actually living in grasslands and plains rather than jungles.",
    category: "Animal Nicknames",
    difficulty: "easy"
  },
  {
    question: "What is the largest bird in the world?",
    options: ["Eagle", "Condor", "Ostrich", "Albatross"],
    correctIndex: 2,
    explanation: "The ostrich is the largest bird in the world, growing up to 9 feet tall and weighing up to 320 pounds.",
    category: "Birds",
    difficulty: "easy"
  },
  {
    question: "Which animal can survive without drinking water for the longest?",
    options: ["Camel", "Kangaroo Rat", "Giraffe", "Desert Tortoise"],
    correctIndex: 1,
    explanation: "The kangaroo rat can survive its entire life without drinking water, getting all the moisture it needs from the seeds it eats.",
    category: "Desert Animals",
    difficulty: "easy"
  },
  {
    question: "Which of these animals hibernates during winter?",
    options: ["Wolf", "Bear", "Moose", "Bison"],
    correctIndex: 1,
    explanation: "Bears hibernate during winter, entering a state of dormancy where their body temperature, heart rate, and respiration decrease to conserve energy.",
    category: "Animal Behavior",
    difficulty: "easy"
  },
  {
    question: "What is a baby fox called?",
    options: ["Cub", "Kit", "Pup", "Joey"],
    correctIndex: 1,
    explanation: "A baby fox is called a kit or cub. They're born blind and deaf, and stay with their parents for about 7 months.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  {
    question: "Which animal has black and white stripes?",
    options: ["Lion", "Zebra", "Hippo", "Rhino"],
    correctIndex: 1,
    explanation: "Zebras have distinctive black and white stripes that help confuse predators and regulate body temperature.",
    category: "Animal Appearance",
    difficulty: "easy"
  },
  {
    question: "Which animal is known for its long trunk?",
    options: ["Rhino", "Elephant", "Giraffe", "Hippo"],
    correctIndex: 1,
    explanation: "Elephants have a long trunk that serves as an extended nose and upper lip, used for breathing, grasping objects, and many other functions.",
    category: "Animal Anatomy",
    difficulty: "easy"
  },
  {
    question: "Which animal is the tallest in the world?",
    options: ["Elephant", "Giraffe", "Whale", "Dinosaur"],
    correctIndex: 1,
    explanation: "The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).",
    category: "Animal Facts",
    difficulty: "easy"
  },
  {
    question: "Which of these animals can fly?",
    options: ["Penguin", "Ostrich", "Bat", "Squirrel"],
    correctIndex: 2,
    explanation: "Bats are the only mammals capable of true flight, using wings formed from skin stretched between elongated finger bones.",
    category: "Animal Abilities",
    difficulty: "easy"
  },
  {
    question: "What animal is known as man's best friend?",
    options: ["Cat", "Dog", "Horse", "Rabbit"],
    correctIndex: 1,
    explanation: "Dogs are known as 'man's best friend' due to their long history of companionship and loyalty to humans.",
    category: "Animal Relationships",
    difficulty: "easy"
  },
  
  // ANIMAL QUESTIONS - MEDIUM
  {
    question: "Which animal can regrow its tail if it loses it?",
    options: ["Snake", "Lizard", "Frog", "Turtle"],
    correctIndex: 1,
    explanation: "Many lizard species can shed their tails when threatened (autotomy) and then regrow them, though the regrown tail often looks different from the original.",
    category: "Animal Adaptations",
    difficulty: "medium"
  },
  {
    question: "What is the only mammal that can't jump?",
    options: ["Sloth", "Elephant", "Hippo", "Rhino"],
    correctIndex: 1,
    explanation: "Elephants are the only mammals that can't jump, due to their weight and the structure of their legs, which are designed for weight-bearing rather than jumping.",
    category: "Animal Abilities",
    difficulty: "medium"
  },
  {
    question: "Which animal has the strongest bite force?",
    options: ["Lion", "Grizzly Bear", "Saltwater Crocodile", "Great White Shark"],
    correctIndex: 2,
    explanation: "The saltwater crocodile has the strongest bite force of any animal, measuring up to 3,700 pounds per square inch (psi).",
    category: "Animal Strength",
    difficulty: "medium"
  },
  {
    question: "Which bird builds the largest nest?",
    options: ["Eagle", "Sociable Weaver", "Stork", "Hummingbird"],
    correctIndex: 1,
    explanation: "Sociable weavers build massive communal nests that can house up to 100 pairs of birds, weigh several tons, and last for generations.",
    category: "Bird Behavior",
    difficulty: "medium"
  },
  {
    question: "Which animal has blue blood?",
    options: ["Octopus", "Lobster", "Jellyfish", "All of these"],
    correctIndex: 3,
    explanation: "Octopuses, lobsters, horseshoe crabs, and some other marine invertebrates have blue blood due to a copper-based compound called hemocyanin instead of the iron-based hemoglobin in red blood.",
    category: "Animal Physiology",
    difficulty: "medium"
  },
  {
    question: "Which animal has the longest migration route?",
    options: ["Monarch Butterfly", "Humpback Whale", "Arctic Tern", "Wildebeest"],
    correctIndex: 2,
    explanation: "The Arctic tern has the longest migration of any animal, traveling about 44,000 miles (71,000 km) annually between the Arctic and Antarctic.",
    category: "Animal Migration",
    difficulty: "medium"
  },
  {
    question: "What unique ability do platypuses have that other mammals don't?",
    options: ["They can breathe underwater", "They can detect electrical fields", "They can change color", "They can see ultraviolet light"],
    correctIndex: 1,
    explanation: "Platypuses can detect electrical fields produced by muscle contractions of prey animals through electroreceptors in their bills, a sense that very few mammals possess.",
    category: "Animal Abilities",
    difficulty: "medium"
  },
  {
    question: "Which animal sleeps up to 22 hours a day?",
    options: ["Sloth", "Koala", "Opossum", "Armadillo"],
    correctIndex: 1,
    explanation: "Koalas sleep 18-22 hours per day, partly due to their low-energy diet of eucalyptus leaves, which are toxic and take a lot of energy to digest.",
    category: "Animal Sleep",
    difficulty: "medium"
  },
  {
    question: "Which of these animals is venomous?",
    options: ["Komodo Dragon", "Gila Monster", "Box Jellyfish", "All of these"],
    correctIndex: 3,
    explanation: "All of these animals are venomous. Komodo dragons have venom glands, Gila monsters are venomous lizards, and box jellyfish have one of the most potent venoms known.",
    category: "Dangerous Animals",
    difficulty: "medium"
  },
  {
    question: "Which animal has the longest lifespan?",
    options: ["Bowhead Whale", "Giant Tortoise", "Greenland Shark", "Ocean Quahog Clam"],
    correctIndex: 2,
    explanation: "Greenland sharks have the longest known lifespan of any vertebrate, with some estimated to live over 400 years based on radiocarbon dating of eye lens nuclei.",
    category: "Animal Longevity",
    difficulty: "medium"
  },
  
  // ANIMAL QUESTIONS - HARD
  {
    question: "Which animal has a brain that continues growing throughout its life?",
    options: ["Elephant", "Octopus", "Alligator", "Human"],
    correctIndex: 0,
    explanation: "Elephants' brains continue to grow throughout their lives, unlike most mammals whose brains stop growing after adolescence.",
    category: "Animal Neurology",
    difficulty: "hard"
  },
  {
    question: "Which animal can freeze solid during winter and come back to life in spring?",
    options: ["Wood Frog", "Arctic Ground Squirrel", "Painted Turtle", "All of these"],
    correctIndex: 0,
    explanation: "Wood frogs can survive having 65-70% of their body water freeze solid during winter through special adaptations including glucose and urea acting as cryoprotectants.",
    category: "Animal Adaptations",
    difficulty: "hard"
  },
  {
    question: "What specialized organ do platypuses have that no other mammal has?",
    options: ["Electroreceptors", "Venomous spurs", "Duck-like bill", "All of these"],
    correctIndex: 3,
    explanation: "Platypuses have all these unique features: electroreceptors in their bills to detect prey, venomous spurs on males' hind legs, and a duck-like bill that contains sensory receptors.",
    category: "Animal Anatomy",
    difficulty: "hard"
  },
  {
    question: "Which animal has the most complex eyes?",
    options: ["Eagle", "Chameleon", "Mantis Shrimp", "Octopus"],
    correctIndex: 2,
    explanation: "Mantis shrimp have the most complex eyes in the animal kingdom with up to 16 types of photoreceptors (humans have 3) and the ability to see polarized light and multiple wavelengths of UV.",
    category: "Animal Senses",
    difficulty: "hard"
  },
  {
    question: "Which animal produces the most toxic venom?",
    options: ["Inland Taipan", "Box Jellyfish", "Blue-Ringed Octopus", "Cone Snail"],
    correctIndex: 0,
    explanation: "The inland taipan (also known as the fierce snake) produces the most toxic venom of any land snake, with one bite containing enough toxin to kill about 100 humans.",
    category: "Dangerous Animals",
    difficulty: "hard"
  },
  {
    question: "Which animal has a four-chambered stomach but is not a ruminant?",
    options: ["Hippo", "Sloth", "Koala", "Kangaroo"],
    correctIndex: 0,
    explanation: "Hippos have a four-chambered stomach similar to ruminants (like cows), but they're not true ruminants as they don't chew cud and their digestive process is different.",
    category: "Animal Digestion",
    difficulty: "hard"
  },
  {
    question: "Which animal is the only one known to have natural wheel-like appendages?",
    options: ["Stomatopod larvae", "Nanomachine bacteria", "None - wheels don't exist in nature", "Rolling spider"],
    correctIndex: 0,
    explanation: "Stomatopod larvae (mantis shrimp babies) have specialized appendages that function as wheels, allowing them to roll along the ocean floor - the only known example of a natural wheel in biology.",
    category: "Unusual Adaptations",
    difficulty: "hard"
  },
  {
    question: "Which of these animals is not actually a fish?",
    options: ["Starfish", "Jellyfish", "Cuttlefish", "All of these"],
    correctIndex: 3,
    explanation: "None of these are actually fish. Starfish are echinoderms, jellyfish are cnidarians, and cuttlefish are mollusks - all different animal groups from true fish.",
    category: "Animal Classification",
    difficulty: "hard"
  },
  {
    question: "Which animal can survive indefinitely in the vacuum of space?",
    options: ["Water Bear (Tardigrade)", "Nematode Worm", "Bacteria Spore", "None of these"],
    correctIndex: 0,
    explanation: "Water bears (tardigrades) can survive in the vacuum of space by entering cryptobiosis, where they expel water from their bodies and lower their metabolism to near zero.",
    category: "Extreme Survival",
    difficulty: "hard"
  },
  {
    question: "Which animal communicates using plasma bubbles?",
    options: ["Pistol Shrimp", "Mantis Shrimp", "Humpback Whale", "Dolphin"],
    correctIndex: 0,
    explanation: "Pistol shrimp snap their specialized claw so quickly it creates a cavitation bubble that collapses with enough force to produce light (sonoluminescence) and a temperature nearly as hot as the sun's surface.",
    category: "Animal Communication",
    difficulty: "hard"
  }
];

// Now we'll combine these with existing questions and create a proper backup
async function createUniqueQuestionSet() {
  console.log("Starting unique question set creation...");
  
  try {
    // Load existing questions from the backup
    const backupPath = path.join('./backups', 'default-trivia-backup.json');
    
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup file not found at ${backupPath}`);
      return;
    }
    
    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    const existingQuestions = backup.questions || [];
    
    console.log(`Loaded ${existingQuestions.length} existing questions`);
    
    // Track existing questions to avoid duplicates
    const seenQuestions = new Set();
    for (const q of existingQuestions) {
      seenQuestions.add(q.question.toLowerCase().trim());
    }
    
    console.log(`Loaded ${seenQuestions.size} unique existing questions`);
    
    // Add our unique animal questions if they don't already exist
    const questionsToAdd = [];
    for (const q of uniqueAnimalQuestions) {
      if (!seenQuestions.has(q.question.toLowerCase().trim())) {
        questionsToAdd.push(q);
        seenQuestions.add(q.question.toLowerCase().trim());
      }
    }
    
    console.log(`Adding ${questionsToAdd.length} new unique animal questions`);
    
    // Combine all questions
    const allQuestions = [
      ...existingQuestions,
      ...questionsToAdd
    ];
    
    // Reassign IDs to ensure they're sequential
    const updatedQuestions = allQuestions.map((q, i) => ({
      ...q,
      id: i + 1
    }));
    
    // Calculate statistics
    const catCount = updatedQuestions.filter(q => 
      q.category && q.category.toLowerCase().includes('cat')
    ).length;
    
    const animalCount = updatedQuestions.length - catCount;
    
    const easyCount = updatedQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = updatedQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = updatedQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nUpdated question set statistics:");
    console.log(`Total questions: ${updatedQuestions.length}`);
    console.log(`Cat questions: ${catCount} (${(catCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Animal questions: ${animalCount} (${(animalCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/updatedQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/updatedQuestions.length*100).toFixed(1)}%)`);
    
    // Create backup object
    const updatedBackup = {
      timestamp: new Date().toISOString(),
      questionCount: updatedQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: updatedQuestions
    };
    
    // Save the updated backup
    console.log(`Saving updated backup to ${backupPath}...`);
    fs.writeFileSync(backupPath, JSON.stringify(updatedBackup, null, 2));
    
    // Also create a copy as unique-trivia-backup.json
    const uniqueBackupPath = path.join('./backups', 'unique-trivia-backup.json');
    console.log(`Creating a copy at ${uniqueBackupPath}...`);
    fs.writeFileSync(uniqueBackupPath, JSON.stringify(updatedBackup, null, 2));
    
    console.log("Unique question set creation complete!");
    
    return updatedBackup;
  } catch (error) {
    console.error("Error creating unique question set:", error);
  }
}

// Run the script
createUniqueQuestionSet().then(() => {
  console.log("Script execution complete!");
}).catch(error => {
  console.error("Script failed:", error);
});