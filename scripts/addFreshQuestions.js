/**
 * Script to replace all existing trivia questions with fresh, handcrafted ones
 * No duplicates, no numbering, no generated content - just clean, unique questions
 */

import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to database
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Fresh cat-related questions
const catQuestions = [
  {
    question: "What is unique about a cat's retractable claws?",
    options: ["They can be replaced if broken", "They allow silent movement", "They grow continuously", "They are made of special bone"],
    correctIndex: 1,
    explanation: "Cat claws retract into a protective sheath, allowing cats to move silently and protect the claws from damage when not in use.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "Which cat breed originated from Turkey and loves swimming?",
    options: ["Angora", "Van", "Balinese", "Korat"],
    correctIndex: 1,
    explanation: "The Turkish Van is known for its unusual love of water and swimming, unlike most cats who avoid water.",
    category: "Cat Breeds",
    difficulty: "hard"
  },
  {
    question: "How can you tell a cat is happy when it approaches you?",
    options: ["Ears flat back", "Tail straight up", "Dilated pupils", "Whiskers pulled back"],
    correctIndex: 1,
    explanation: "A cat with its tail held straight up is displaying confidence and friendly intentions - it's a classic happy greeting posture.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What evolutionary advantage do cats gain from purring?",
    options: ["Attracting prey", "Bone and tissue healing", "Camouflage", "Temperature regulation"],
    correctIndex: 1,
    explanation: "Cat purring occurs at a frequency that promotes healing of bones and tissues, helping cats recover faster from injuries.",
    category: "Cat Biology",
    difficulty: "medium"
  },
  {
    question: "Which feature is unique to the Scottish Fold cat breed?",
    options: ["Extra toes", "Curled ears", "Hairless body", "Short legs"],
    correctIndex: 1,
    explanation: "Scottish Fold cats have a natural dominant gene mutation that affects cartilage, causing their ears to fold forward and downward.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "What is the function of a cat's whiskers?",
    options: ["Taste detection", "Spatial awareness", "Temperature sensing", "Attracting mates"],
    correctIndex: 1,
    explanation: "Cat whiskers are sensitive touch receptors that help cats determine if they can fit through spaces and navigate in darkness.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "Why do cats knead with their paws?",
    options: ["Testing surface stability", "Marking territory", "Leftover nursing behavior", "Exercising claws"],
    correctIndex: 2,
    explanation: "Kneading is a behavior that persists from kittenhood when kittens knead their mother's belly to stimulate milk flow. Adult cats often knead when content.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "Which of these is toxic to cats but not to most other animals?",
    options: ["Chocolate", "Lilies", "Grapes", "Coffee"],
    correctIndex: 1,
    explanation: "Lilies are extremely toxic to cats and can cause kidney failure even in small amounts, while many other animals can tolerate them.",
    category: "Cat Health",
    difficulty: "medium"
  },
  {
    question: "What is unique about the vision of cats compared to humans?",
    options: ["They see more colors", "Better distance vision", "Superior night vision", "Sharper focus"],
    correctIndex: 2,
    explanation: "Cats have a reflective layer behind their retina called the tapetum lucidum that enhances their night vision to be about six times better than humans.",
    category: "Cat Senses",
    difficulty: "medium"
  },
  {
    question: "What is the purpose of a cat's slow blink?",
    options: ["Rest the eyes", "Clean the cornea", "Show affection", "Improve focus"],
    correctIndex: 2,
    explanation: "A cat's slow blink, sometimes called a 'cat kiss', is a sign of trust and affection. When cats slow blink at you, they're showing they feel safe.",
    category: "Cat Communication",
    difficulty: "easy"
  },
  {
    question: "Which wild cat is the domestic cat most closely related to?",
    options: ["Cheetah", "Lynx", "African wildcat", "Puma"],
    correctIndex: 2,
    explanation: "Domestic cats evolved from the African wildcat (Felis silvestris lybica) and share about 95% of their genetic makeup.",
    category: "Cat Evolution",
    difficulty: "hard"
  },
  {
    question: "What unique ability do calico cats have?",
    options: ["Changing eye color", "Better balance", "Night howling", "Color vision"],
    correctIndex: 3,
    explanation: "Unlike most cats who are color-blind, calico cats have been found to have some color vision due to their unique genetic makeup.",
    category: "Cat Genetics",
    difficulty: "hard"
  },
  {
    question: "How do mother cats carry their kittens?",
    options: ["By the tail", "By the scruff", "On their back", "In their mouth"],
    correctIndex: 1,
    explanation: "Mother cats carry kittens by the scruff, which triggers a relaxation response in kittens and makes them go limp for safe transport.",
    category: "Cat Parenting",
    difficulty: "easy"
  },
  {
    question: "What happens to a cat's pupils in bright light?",
    options: ["Become round", "Form vertical slits", "Disappear completely", "Turn blue"],
    correctIndex: 1,
    explanation: "In bright light, a cat's pupils contract into vertical slits, allowing precise control of light and better depth perception.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "Which feature helps cats always land on their feet?",
    options: ["Flexible tail", "Righting reflex", "Hollow bones", "Magnetic sensing"],
    correctIndex: 1,
    explanation: "Cats have a natural 'righting reflex' that allows them to twist their flexible spine mid-air to land on their feet when falling.",
    category: "Cat Abilities",
    difficulty: "medium"
  },
  {
    question: "What is the normal body temperature of a cat?",
    options: ["Same as humans", "Slightly higher than humans", "Lower than humans", "It varies by breed"],
    correctIndex: 1,
    explanation: "A cat's normal body temperature is slightly higher than humans, ranging from 100.5 to 102.5°F (38.1 to 39.2°C).",
    category: "Cat Health",
    difficulty: "medium"
  },
  {
    question: "Which cat holds the record for the loudest purr?",
    options: ["Merlin", "Smokey", "Thunder", "Rumble"],
    correctIndex: 1,
    explanation: "Smokey, a British cat, holds the Guinness World Record for the loudest purr by a domestic cat, reaching 67.8 decibels.",
    category: "Cat Records",
    difficulty: "hard"
  },
  {
    question: "What ability do cats lose as they mature?",
    options: ["Jumping", "Purring", "Kneading", "Drinking milk"],
    correctIndex: 3,
    explanation: "Most adult cats become lactose intolerant, losing the ability to digest milk properly as they mature past kittenhood.",
    category: "Cat Development",
    difficulty: "medium"
  },
  {
    question: "What is a cat's most popular sleeping position?",
    options: ["Curled up", "On their back", "Stretched out", "Half sitting"],
    correctIndex: 0,
    explanation: "The curled-up position is most popular as it conserves heat and protects vital organs, showing cats still retain wild instincts.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "Which country has the highest cat ownership per capita?",
    options: ["United States", "Japan", "Russia", "New Zealand"],
    correctIndex: 3,
    explanation: "New Zealand has the highest rate of cat ownership per capita, with nearly half of households owning at least one cat.",
    category: "Cat Culture",
    difficulty: "hard"
  }
];

// Fresh animal questions (non-cat specific)
const animalQuestions = [
  {
    question: "Which animal has the largest brain in the world?",
    options: ["Blue whale", "Elephant", "Dolphin", "Gorilla"],
    correctIndex: 0,
    explanation: "The blue whale has the largest brain of any animal, weighing about 17 pounds (7.8 kg).",
    category: "Animal Facts",
    difficulty: "medium"
  },
  {
    question: "Which bird can fly backward?",
    options: ["Eagle", "Owl", "Hummingbird", "Penguin"],
    correctIndex: 2,
    explanation: "The hummingbird is the only bird that can fly backward due to its unique wing structure and flight muscles.",
    category: "Birds",
    difficulty: "medium"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Horse", "Gazelle"],
    correctIndex: 1,
    explanation: "The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (113 km/h) in short bursts.",
    category: "Animal Speed",
    difficulty: "easy"
  },
  {
    question: "Which animal has the longest lifespan?",
    options: ["Giant tortoise", "Bowhead whale", "Elephant", "Parrot"],
    correctIndex: 1,
    explanation: "The bowhead whale has the longest known lifespan of any mammal, potentially living over 200 years.",
    category: "Animal Longevity",
    difficulty: "hard"
  },
  {
    question: "Which animal never sleeps?",
    options: ["Giraffe", "Bullfrog", "Dolphin", "Ant"],
    correctIndex: 0,
    explanation: "Giraffes only sleep about 30 minutes per day, in very short intervals, but never enter deep sleep in the wild.",
    category: "Animal Behavior",
    difficulty: "medium"
  },
  {
    question: "Which insect has the best eyesight?",
    options: ["Ant", "Dragonfly", "Butterfly", "Beetle"],
    correctIndex: 1,
    explanation: "Dragonflies have compound eyes with up to 30,000 facets, giving them nearly 360-degree vision and the ability to see ultraviolet light.",
    category: "Insects",
    difficulty: "medium"
  },
  {
    question: "Which animal has the strongest bite force?",
    options: ["Lion", "Hippopotamus", "Crocodile", "Shark"],
    correctIndex: 2,
    explanation: "The saltwater crocodile has the strongest measured bite force of any animal, up to 3,700 pounds per square inch (psi).",
    category: "Animal Strength",
    difficulty: "medium"
  },
  {
    question: "Which animal can regrow its head?",
    options: ["Starfish", "Lizard", "Flatworm", "Sea cucumber"],
    correctIndex: 2,
    explanation: "Some species of flatworms (planarians) can regenerate their entire bodies from small pieces, including growing a new head.",
    category: "Animal Adaptations",
    difficulty: "hard"
  },
  {
    question: "Which animal has blue blood?",
    options: ["Squid", "Lobster", "Horseshoe crab", "Octopus"],
    correctIndex: 2,
    explanation: "Horseshoe crabs have blue blood due to the copper-based molecule hemocyanin, which transports oxygen instead of iron-based hemoglobin.",
    category: "Animal Biology",
    difficulty: "hard"
  },
  {
    question: "Which animal can change its sex?",
    options: ["Parrotfish", "Salamander", "Frog", "Turtle"],
    correctIndex: 0,
    explanation: "Parrotfish can change their sex from female to male, with some species changing color during the transformation.",
    category: "Marine Life",
    difficulty: "hard"
  },
  {
    question: "Which animal has the longest migration?",
    options: ["Monarch butterfly", "Arctic tern", "Humpback whale", "Caribou"],
    correctIndex: 1,
    explanation: "The Arctic tern migrates from the Arctic to the Antarctic and back annually, covering about 44,000 miles (71,000 km).",
    category: "Animal Migration",
    difficulty: "medium"
  },
  {
    question: "Which animal can survive being frozen?",
    options: ["Wood frog", "Arctic fox", "Polar bear", "Snow leopard"],
    correctIndex: 0,
    explanation: "Wood frogs can survive being frozen solid, with their hearts stopping and ice crystals forming in their blood, thanks to special proteins and glucose.",
    category: "Animal Adaptations",
    difficulty: "hard"
  },
  {
    question: "Which animal sleeps the most?",
    options: ["Sloth", "Koala", "Lion", "Brown bat"],
    correctIndex: 3,
    explanation: "Brown bats sleep up to 20 hours a day, making them one of the sleepiest animals in the world.",
    category: "Animal Behavior",
    difficulty: "medium"
  },
  {
    question: "Which animal has the best sense of smell?",
    options: ["Elephant", "Shark", "Bear", "Dog"],
    correctIndex: 0,
    explanation: "African elephants have the best sense of smell among all animals, able to detect water sources from several miles away.",
    category: "Animal Senses",
    difficulty: "medium"
  },
  {
    question: "Which animal doesn't drink water?",
    options: ["Kangaroo rat", "Koala", "Desert tortoise", "Fennec fox"],
    correctIndex: 0,
    explanation: "The kangaroo rat never drinks water, getting all the moisture it needs from the seeds it eats and efficient kidneys.",
    category: "Desert Animals",
    difficulty: "hard"
  },
  {
    question: "Which bird builds the largest nest?",
    options: ["Eagle", "Sociable weaver", "Albatross", "Stork"],
    correctIndex: 1,
    explanation: "The sociable weaver of Africa builds massive communal nests that can house up to 500 birds and last for generations.",
    category: "Birds",
    difficulty: "hard"
  },
  {
    question: "Which ocean creature can produce light?",
    options: ["Clownfish", "Anglerfish", "Sea turtle", "Manatee"],
    correctIndex: 1,
    explanation: "The anglerfish produces light through bioluminescence in a rod-like appendage from its head to attract prey in the deep sea.",
    category: "Marine Life",
    difficulty: "medium"
  },
  {
    question: "Which mammal lays eggs?",
    options: ["Bat", "Pangolin", "Platypus", "Sloth"],
    correctIndex: 2,
    explanation: "The platypus is one of only five monotreme mammals that lay eggs instead of giving birth to live young.",
    category: "Mammals",
    difficulty: "easy"
  },
  {
    question: "Which animal has the largest eyes?",
    options: ["Elephant", "Giant squid", "Ostrich", "Owl"],
    correctIndex: 1,
    explanation: "The giant squid has the largest eyes of any animal, up to 10 inches (25 cm) in diameter - about the size of a dinner plate.",
    category: "Animal Anatomy",
    difficulty: "medium"
  },
  {
    question: "Which animal has the most teeth?",
    options: ["Shark", "Snail", "Dolphin", "Crocodile"],
    correctIndex: 1,
    explanation: "Garden snails have the most teeth of any animal - up to 25,000 tiny teeth on their radula, a tongue-like organ.",
    category: "Animal Anatomy",
    difficulty: "hard"
  }
];

async function replaceAllQuestions() {
  try {
    console.log("Starting fresh question replacement...");

    // First, clear out the existing questions
    console.log("Clearing existing questions from database...");
    await pool.query("TRUNCATE TABLE trivia_questions");
    console.log("All existing questions removed.");

    // Now insert our fresh handcrafted questions
    // First the cat questions
    console.log(`Adding ${catQuestions.length} fresh cat questions...`);

    for (const question of catQuestions) {
      await pool.query(
        `INSERT INTO trivia_questions 
        (question, options, correct_index, explanation, category, difficulty)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          question.question,
          JSON.stringify(question.options),
          question.correctIndex,
          question.explanation,
          question.category,
          question.difficulty
        ]
      );
    }

    // Then the animal questions
    console.log(`Adding ${animalQuestions.length} fresh animal questions...`);

    for (const question of animalQuestions) {
      await pool.query(
        `INSERT INTO trivia_questions 
        (question, options, correct_index, explanation, category, difficulty)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          question.question,
          JSON.stringify(question.options),
          question.correctIndex,
          question.explanation,
          question.category,
          question.difficulty
        ]
      );
    }

    // Count questions in database
    const { rows } = await pool.query("SELECT COUNT(*) FROM trivia_questions");
    console.log(`Successfully added ${rows[0].count} fresh handcrafted questions to the database.`);
    console.log("Easy:", catQuestions.filter(q => q.difficulty === "easy").length + animalQuestions.filter(q => q.difficulty === "easy").length);
    console.log("Medium:", catQuestions.filter(q => q.difficulty === "medium").length + animalQuestions.filter(q => q.difficulty === "medium").length);
    console.log("Hard:", catQuestions.filter(q => q.difficulty === "hard").length + animalQuestions.filter(q => q.difficulty === "hard").length);

  } catch (error) {
    console.error("Error replacing questions:", error);
  } finally {
    await pool.end();
  }
}

// Run the script
replaceAllQuestions();