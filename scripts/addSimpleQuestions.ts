import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";

// Simple, fun animal trivia questions with correct answers

const simpleAnimalQuestions = [
  // CAT QUESTIONS - EASY
  {
    question: "What do cats do for several hours each day?",
    options: ["Sleep", "Eat", "Run around", "Swim"],
    correctIndex: 0,
    explanation: "Cats sleep for 12-16 hours each day! They're one of the sleepiest animals.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What is a group of cats called?",
    options: ["A pack", "A clowder", "A herd", "A flock"],
    correct_index: 1,
    explanation: "A group of cats is called a clowder. A group of kittens is called a kindle.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "Which of these is a popular cat breed?",
    options: ["Great Dane", "Siamese", "Labrador", "Cockatoo"],
    correct_index: 1,
    explanation: "Siamese cats are a popular breed known for their distinctive color points and blue eyes.",
    category: "Cat Breeds",
    difficulty: "easy"
  },
  {
    question: "What noise do cats make when they're happy?",
    options: ["Purr", "Bark", "Chirp", "Howl"],
    correct_index: 0,
    explanation: "Cats purr when they're happy or content. They also sometimes purr when injured as a way to heal themselves.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What do cats use their whiskers for?",
    options: ["Decoration", "Sensing if they can fit through spaces", "Attracting mates", "Swimming"],
    correct_index: 1,
    explanation: "Cats use their whiskers to determine if they can fit through openings - their whiskers are about as wide as their body.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "How many toes does a normal cat have on its front paws?",
    options: ["Three", "Four", "Five", "Six"],
    correct_index: 2,
    explanation: "Most cats have 5 toes on each front paw and 4 on each back paw, totaling 18 toes.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What is a kitten?",
    options: ["A baby cat", "A baby dog", "A cat toy", "A type of food"],
    correct_index: 0,
    explanation: "A kitten is a baby cat. Kittens are usually considered kittens until they're about one year old.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "Which of these is a popular internet cat known for looking grumpy?",
    options: ["Happy Cat", "Grumpy Cat", "Excited Cat", "Sleepy Cat"],
    correct_index: 1,
    explanation: "Grumpy Cat (real name Tardar Sauce) was famous for her permanently grumpy expression caused by feline dwarfism.",
    category: "Famous Cats",
    difficulty: "easy"
  },
  {
    question: "What color are most cats' eyes when they're born?",
    options: ["Green", "Yellow", "Brown", "Blue"],
    correct_index: 3,
    explanation: "All kittens are born with blue eyes. Their adult eye color develops when they're around 6-7 weeks old.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "What is a cat's favorite hobby?",
    options: ["Grooming", "Singing", "Dancing", "Reading"],
    correct_index: 0,
    explanation: "Cats spend up to 50% of their waking hours grooming themselves to keep clean.",
    category: "Cat Behavior",
    difficulty: "easy"
  },

  // CAT QUESTIONS - MEDIUM
  {
    question: "Which cat breed has no tail?",
    options: ["Persian", "Manx", "Siamese", "Ragdoll"],
    correct_index: 1,
    explanation: "The Manx cat from the Isle of Man is famous for having no tail or a very short tail due to a genetic mutation.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "What fruit do most cats dislike the smell of?",
    options: ["Apple", "Banana", "Citrus (oranges, lemons)", "Strawberry"],
    correct_index: 2,
    explanation: "Most cats dislike citrus smells like oranges and lemons. This is often used as a natural cat repellent.",
    category: "Cat Facts",
    difficulty: "medium"
  },
  {
    question: "How far can the average house cat jump?",
    options: ["1 foot", "3 feet", "5 feet", "7 feet"],
    correct_index: 2,
    explanation: "The average cat can jump about 5 feet high, which is about 5 times their own height.",
    category: "Cat Abilities",
    difficulty: "medium"
  },
  {
    question: "Which of these is a hairless cat breed?",
    options: ["Maine Coon", "Sphynx", "Persian", "Ragdoll"],
    correct_index: 1,
    explanation: "The Sphynx cat is a breed known for being hairless, though they may have a fine layer of fuzz.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "What is special about a Scottish Fold cat?",
    options: ["Extra toes", "Folded ears", "No tail", "Blue fur"],
    correct_index: 1,
    explanation: "Scottish Fold cats have a genetic mutation that causes their ear cartilage to fold forward, giving them a distinctive appearance.",
    category: "Cat Breeds",
    difficulty: "medium"
  },

  // OTHER ANIMAL QUESTIONS - EASY
  {
    question: "What is a baby kangaroo called?",
    options: ["Cub", "Pup", "Joey", "Kit"],
    correct_index: 2,
    explanation: "A baby kangaroo is called a joey. They're born very tiny and continue developing in their mother's pouch.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  {
    question: "Which animal has black and white stripes?",
    options: ["Elephant", "Zebra", "Monkey", "Giraffe"],
    correct_index: 1,
    explanation: "Zebras have distinctive black and white stripes. Each zebra's pattern is unique, like human fingerprints.",
    category: "Animal Patterns",
    difficulty: "easy"
  },
  {
    question: "What animal can fly and makes honey?",
    options: ["Spider", "Butterfly", "Bee", "Ant"],
    correct_index: 2,
    explanation: "Bees are flying insects that make honey from flower nectar. They're incredibly important for pollinating plants.",
    category: "Insects",
    difficulty: "easy"
  },
  {
    question: "Which of these animals lives in the ocean?",
    options: ["Dolphin", "Lion", "Elephant", "Bear"],
    correct_index: 0,
    explanation: "Dolphins are marine mammals that live in oceans and seas around the world.",
    category: "Marine Life",
    difficulty: "easy"
  },
  {
    question: "What animal says 'woof'?",
    options: ["Cat", "Dog", "Bird", "Fish"],
    correct_index: 1,
    explanation: "Dogs make the sound 'woof' or 'bark'. Different breeds and sizes of dogs have different types of barks.",
    category: "Animal Sounds",
    difficulty: "easy"
  },
  {
    question: "Which of these is the tallest animal?",
    options: ["Elephant", "Giraffe", "Horse", "Cow"],
    correct_index: 1,
    explanation: "Giraffes are the tallest living animals, with males reaching up to 18 feet tall!",
    category: "Animal Facts",
    difficulty: "easy"
  },
  {
    question: "What do birds have all over their body?",
    options: ["Fur", "Scales", "Feathers", "Wool"],
    correct_index: 2,
    explanation: "Birds have feathers covering their bodies, which help them fly, stay warm, and attract mates.",
    category: "Bird Facts",
    difficulty: "easy"
  },
  {
    question: "Which animal has a very long trunk?",
    options: ["Giraffe", "Elephant", "Lion", "Monkey"],
    correct_index: 1,
    explanation: "Elephants have long trunks, which they use for breathing, grabbing food, drinking water, and even greeting other elephants.",
    category: "Animal Anatomy",
    difficulty: "easy"
  },
  {
    question: "What animal likes to eat carrots and hops around?",
    options: ["Fox", "Mouse", "Rabbit", "Squirrel"],
    correct_index: 2,
    explanation: "Rabbits love to eat carrots and other vegetables. They move by hopping on their strong back legs.",
    category: "Animal Diet",
    difficulty: "easy"
  },
  {
    question: "Which of these animals can change color?",
    options: ["Dog", "Chameleon", "Cat", "Bear"],
    correct_index: 1,
    explanation: "Chameleons can change their skin color to blend in with their surroundings, communicate with other chameleons, or show their mood.",
    category: "Animal Abilities",
    difficulty: "easy"
  },

  // OTHER ANIMAL QUESTIONS - MEDIUM
  {
    question: "Which of these birds can't fly?",
    options: ["Eagle", "Penguin", "Robin", "Sparrow"],
    correct_index: 1,
    explanation: "Penguins can't fly, but they're excellent swimmers. Their wings have evolved into flippers that help them 'fly' through water.",
    category: "Bird Facts",
    difficulty: "medium"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Horse", "Deer"],
    correct_index: 0,
    explanation: "Cheetahs are the fastest land animals, capable of running at speeds up to 70 mph (113 km/h) for short distances.",
    category: "Animal Speed",
    difficulty: "medium"
  },
  {
    question: "Which animal sleeps standing up?",
    options: ["Dog", "Horse", "Cat", "Rabbit"],
    correct_index: 1,
    explanation: "Horses can sleep standing up thanks to special 'locking' mechanisms in their legs, although they do lie down for deep sleep.",
    category: "Animal Sleep",
    difficulty: "medium"
  },
  {
    question: "What is a group of wolves called?",
    options: ["A herd", "A flock", "A pack", "A school"],
    correct_index: 2,
    explanation: "A group of wolves is called a pack. Wolf packs usually consist of a family group led by an alpha male and female.",
    category: "Animal Groups",
    difficulty: "medium"
  },
  {
    question: "Which of these animals can live both on land and in water?",
    options: ["Frog", "Lion", "Eagle", "Spider"],
    correct_index: 0,
    explanation: "Frogs are amphibians, which means they can live both on land and in water. They typically start life as tadpoles in water before developing into adult frogs.",
    category: "Amphibians",
    difficulty: "medium"
  }
];

async function addSimpleQuestions() {
  try {
    console.log("Adding new simple animal trivia questions...");
    
    // Add the questions
    await db.insert(triviaQuestions).values(simpleAnimalQuestions);
    
    console.log(`Successfully added ${simpleAnimalQuestions.length} simple questions to the database!`);
    
    // Check the count
    const count = await db.select({
      count: sql`count(*)`
    }).from(triviaQuestions);
    
    console.log(`Database now has ${count[0].count} questions total.`);
    
  } catch (error) {
    console.error("Error adding simple questions:", error);
  }
}

// Execute the function
import { sql } from 'drizzle-orm';
addSimpleQuestions();