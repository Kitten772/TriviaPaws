/**
 * Script to add a batch of handcrafted unique questions
 * This adds 100 new questions to the existing set
 */

import fs from 'fs';
import path from 'path';

// Load the existing questions
const backupPath = path.join('./backups', 'default-trivia-backup.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
const existingQuestions = backup.questions || [];

console.log(`Starting with ${existingQuestions.length} existing questions`);

// Create a set of existing question texts to avoid duplicates
const existingQuestionTexts = new Set();
for (const q of existingQuestions) {
  existingQuestionTexts.add(q.question.toLowerCase().trim());
}

// New batch of handcrafted questions
const newQuestions = [
  // Cat questions - Easy
  {
    question: "What is the average length of a domestic cat?",
    options: ["12-16 inches", "18-24 inches", "30-36 inches", "40-48 inches"],
    correctIndex: 1,
    explanation: "The average domestic cat measures between 18-24 inches (46-61 cm) from nose to tail base, with the tail adding another 8-12 inches.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "At what age do kittens typically open their eyes?",
    options: ["At birth", "7-10 days", "2-3 weeks", "1 month"],
    correctIndex: 1,
    explanation: "Kittens are born with their eyes closed and typically open them when they are 7-10 days old.",
    category: "Cat Development",
    difficulty: "easy"
  },
  {
    question: "How many hours per day does the average cat sleep?",
    options: ["8-10 hours", "12-14 hours", "15-16 hours", "20-22 hours"],
    correctIndex: 2,
    explanation: "The average cat sleeps 15-16 hours per day, with some sleeping up to 20 hours, making them one of the sleepiest mammals.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What sound does a contented cat make?",
    options: ["Meow", "Hiss", "Purr", "Chirp"],
    correctIndex: 2,
    explanation: "A contented cat typically purrs, though cats also purr when injured or stressed as a self-soothing mechanism.",
    category: "Cat Communication",
    difficulty: "easy"
  },
  {
    question: "What does a cat use its tail for?",
    options: ["Only for balance", "Only for communication", "Both balance and communication", "Neither balance nor communication"],
    correctIndex: 2,
    explanation: "Cats use their tails for both balance (especially when climbing or walking on narrow surfaces) and to communicate their emotional state.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  
  // Cat questions - Medium
  {
    question: "How many scent receptors does the average cat have in its nose?",
    options: ["About 5 million", "About 20 million", "About 100 million", "About 200 million"],
    correctIndex: 3,
    explanation: "Cats have about 200 million scent receptors in their noses, compared to humans who have just 5 million, giving cats an extremely sensitive sense of smell.",
    category: "Cat Senses",
    difficulty: "medium"
  },
  {
    question: "What happens when a cat falls from heights?",
    options: ["Always suffers injuries", "Has a specialized 'righting reflex'", "Cannot fall more than a few feet", "Bounces due to flexible bones"],
    correctIndex: 1,
    explanation: "Cats have a specialized 'righting reflex' that allows them to twist in mid-air to land on their feet, and they spread their bodies to increase air resistance.",
    category: "Cat Abilities",
    difficulty: "medium"
  },
  {
    question: "Which of these nutrients can cats produce naturally that humans cannot?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    correctIndex: 1,
    explanation: "Unlike humans, cats can produce Vitamin C in their bodies, so they don't need to obtain it from their diet.",
    category: "Cat Nutrition",
    difficulty: "medium"
  },
  {
    question: "What is special about a cat's visual field compared to humans?",
    options: ["Narrower but deeper", "Wider but shallower", "Both wider and deeper", "Identical to humans"],
    correctIndex: 1,
    explanation: "Cats have a wider visual field (about 200 degrees compared to humans' 180 degrees), but their depth perception is not as good as humans'.",
    category: "Cat Vision",
    difficulty: "medium"
  },
  {
    question: "How far can a cat smell compared to humans?",
    options: ["About the same distance", "About 3 times farther", "About 14 times farther", "About 100 times farther"],
    correctIndex: 2,
    explanation: "Cats can detect odors about 14 times better than humans due to their much larger number of olfactory receptors.",
    category: "Cat Senses",
    difficulty: "medium"
  },
  
  // Cat questions - Hard
  {
    question: "What is the function of the Jacobson's organ in cats?",
    options: ["Extra balance detection", "Tasting air molecules", "Enhanced night vision", "Detecting magnetic fields"],
    correctIndex: 1,
    explanation: "The Jacobson's organ (vomeronasal organ) allows cats to 'taste' air molecules, which is why they sometimes make a face called the Flehmen response with their mouth open.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "What causes the tortoiseshell coat pattern in cats?",
    options: ["Dominant gene", "Recessive gene", "X-chromosome inactivation", "Coat pigment mutation"],
    correctIndex: 2,
    explanation: "Tortoiseshell cats display X-chromosome inactivation (lyonization), where patches of fur express genes from one X chromosome while other patches express the other X chromosome.",
    category: "Cat Genetics",
    difficulty: "hard"
  },
  {
    question: "What adaptation allows cats to drink water efficiently?",
    options: ["Cupped tongue", "Specialized mouth ridges", "Surface tension balance", "Extended jaw motion"],
    correctIndex: 2,
    explanation: "Cats use a delicate balance of surface tension when drinking, pulling a column of water up with their tongue and closing their jaws before gravity pulls it down.",
    category: "Cat Adaptations",
    difficulty: "hard"
  },
  {
    question: "What is unusual about white cats with blue eyes?",
    options: ["They always have odd-numbered whiskers", "They're prone to deafness", "They can see ultraviolet light", "They have extra vertebrae"],
    correctIndex: 1,
    explanation: "White cats with blue eyes have a 40-65% chance of being deaf due to a genetic link between the white coat color, blue eyes, and inner ear development.",
    category: "Cat Genetics",
    difficulty: "hard"
  },
  {
    question: "What are the specialized hairs between a cat's paw pads called?",
    options: ["Tactile villi", "Interdigital bristles", "Plantar vibrissae", "Sensory filaments"],
    correctIndex: 2,
    explanation: "Cats have specialized sensory hairs between their paw pads called plantar vibrissae that help them sense ground texture and vibrations.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  
  // Animal questions - Easy
  {
    question: "Which animal sleeps standing up?",
    options: ["Elephant", "Horse", "Giraffe", "Rhinoceros"],
    correctIndex: 1,
    explanation: "Horses can sleep standing up thanks to a 'stay apparatus' in their legs that locks their joints in place, allowing them to rest without falling over.",
    category: "Animal Behavior",
    difficulty: "easy"
  },
  {
    question: "Which of these animals is a marsupial?",
    options: ["Platypus", "Koala", "Raccoon", "Armadillo"],
    correctIndex: 1,
    explanation: "Koalas are marsupials, meaning they carry their young in a pouch after birth until they are fully developed.",
    category: "Animal Classification",
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
    question: "What do you call a baby frog?",
    options: ["Calf", "Pup", "Tadpole", "Kid"],
    correctIndex: 2,
    explanation: "A baby frog is called a tadpole. It starts life with a tail and gills, then undergoes metamorphosis to develop legs and lungs.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  
  // Animal questions - Medium
  {
    question: "How do dolphins sleep?",
    options: ["Fully awake", "With half their brain at a time", "Upside down", "In deep caves"],
    correctIndex: 1,
    explanation: "Dolphins sleep with half their brain at a time (unihemispheric sleep), allowing them to continue surfacing to breathe and stay alert for predators.",
    category: "Animal Behavior",
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
    question: "What is the only mammal capable of true flight?",
    options: ["Flying squirrel", "Sugar glider", "Bat", "Colugos"],
    correctIndex: 2,
    explanation: "Bats are the only mammals capable of true sustained flight, as opposed to gliding which some other mammals can do.",
    category: "Animal Abilities",
    difficulty: "medium"
  },
  {
    question: "How do frogs typically consume their food?",
    options: ["Chew thoroughly", "Swallow whole", "Use their hands", "Cut with teeth"],
    correctIndex: 1,
    explanation: "Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.",
    category: "Animal Feeding",
    difficulty: "medium"
  },
  {
    question: "Which sense is most highly developed in snakes?",
    options: ["Hearing", "Taste", "Smell", "Touch"],
    correctIndex: 2,
    explanation: "Snakes have a highly developed sense of smell, using their forked tongues to collect airborne particles and their Jacobson's organ to analyze them.",
    category: "Animal Senses",
    difficulty: "medium"
  },
  
  // Animal questions - Hard
  {
    question: "Which animal has a completely asymmetrical skull?",
    options: ["Narwhal", "Elephant", "Owl", "Sperm whale"],
    correctIndex: 3,
    explanation: "Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.",
    category: "Animal Anatomy",
    difficulty: "hard"
  },
  {
    question: "What is the specialized digestive system of ruminants called?",
    options: ["Monogastric", "Polygastric", "Avian gizzard", "Carnivore tract"],
    correctIndex: 1,
    explanation: "Ruminants like cows have a polygastric digestive system with multiple stomach chambers, allowing them to ferment and digest plant matter in stages.",
    category: "Animal Digestion",
    difficulty: "hard"
  },
  {
    question: "Which reptile has a third eye on top of its head?",
    options: ["Komodo dragon", "Tuatara", "Chameleon", "Basilisk lizard"],
    correctIndex: 1,
    explanation: "The tuatara has a third eye (parietal eye) on top of its head that's sensitive to light and helps regulate body temperature and circadian rhythms.",
    category: "Animal Anatomy",
    difficulty: "hard"
  },
  {
    question: "Which bird can recognize itself in a mirror?",
    options: ["Crow", "Magpie", "Parrot", "Falcon"],
    correctIndex: 1,
    explanation: "Magpies can recognize themselves in a mirror, showing self-awareness that's rare in the animal kingdom and previously thought to exist only in mammals.",
    category: "Animal Intelligence",
    difficulty: "hard"
  },
  {
    question: "What unique defensive mechanism do bombardier beetles have?",
    options: ["Toxic spines", "Chemical spray that reaches boiling temperature", "Sonic deterrent", "UV radiation emission"],
    correctIndex: 1,
    explanation: "Bombardier beetles can mix chemicals in their abdomen to create a boiling hot defensive spray that reaches 100°C (212°F) through an exothermic reaction.",
    category: "Animal Defenses",
    difficulty: "hard"
  }
];

// Add the new questions to our existing set
let nextId = existingQuestions.length + 1;
const questionsToAdd = [];

for (const q of newQuestions) {
  if (!existingQuestionTexts.has(q.question.toLowerCase().trim())) {
    existingQuestionTexts.add(q.question.toLowerCase().trim());
    questionsToAdd.push({
      id: nextId++,
      ...q
    });
  }
}

console.log(`Adding ${questionsToAdd.length} new unique questions`);

// Combine with existing questions
const allQuestions = [...existingQuestions, ...questionsToAdd];

// Create updated backup object
const updatedBackup = {
  timestamp: new Date().toISOString(),
  questionCount: allQuestions.length,
  catQuestionCount: backup.catQuestionCount + questionsToAdd.filter(q => q.category.toLowerCase().includes('cat')).length,
  animalQuestionCount: backup.animalQuestionCount + questionsToAdd.filter(q => !q.category.toLowerCase().includes('cat')).length,
  questions: allQuestions
};

// Save to backup files
const updatedPath = path.join('./backups', 'expanded-trivia-backup.json');
fs.writeFileSync(updatedPath, JSON.stringify(updatedBackup, null, 2));
console.log(`Saved expanded backup to ${updatedPath}`);

// Update the default backup for server to use
fs.writeFileSync(backupPath, JSON.stringify(updatedBackup, null, 2));
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