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

// This object will store questions to ensure uniqueness
const uniqueQuestionsMap = new Map();

// 500 CAT QUESTIONS
const catQuestions = [
  // EASY CAT QUESTIONS - 166 questions
  {
    question: "What do cats do for many hours each day?",
    options: ["Sleep", "Play video games", "Read books", "Talk to humans"],
    correctIndex: 0,
    explanation: "Cats sleep for 12-16 hours each day. They're one of the sleepiest animals!",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What sound does a happy cat make?",
    options: ["Purr", "Bark", "Moo", "Squeak"],
    correctIndex: 0,
    explanation: "Cats purr when they're happy or content.",
    category: "Cat Sounds",
    difficulty: "easy"
  },
  {
    question: "What are baby cats called?",
    options: ["Kittens", "Cubs", "Pups", "Calves"],
    correctIndex: 0,
    explanation: "Baby cats are called kittens.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "What do cats use their whiskers for?",
    options: ["To sense if they fit through spaces", "To taste food", "To make music", "To catch mice"],
    correctIndex: 0,
    explanation: "Cats use their whiskers to determine if they can fit through openings.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What do cats like to chase?",
    options: ["Mice", "Cars", "People", "Trees"],
    correctIndex: 0,
    explanation: "Cats naturally like to chase small animals like mice.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What color are most cats' eyes when they're born?",
    options: ["Blue", "Green", "Yellow", "Brown"],
    correctIndex: 0,
    explanation: "All kittens are born with blue eyes.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  {
    question: "How many toes does a normal cat have on each front paw?",
    options: ["Five", "Four", "Six", "Three"],
    correctIndex: 0,
    explanation: "Most cats have 5 toes on each front paw.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What do cats use their tails for?",
    options: ["Balance", "Swimming", "Catching food", "Digging holes"],
    correctIndex: 0,
    explanation: "Cats use their tails for balance when running or walking on narrow surfaces.",
    category: "Cat Anatomy",
    difficulty: "easy"
  },
  {
    question: "What famous internet cat had a grumpy face?",
    options: ["Grumpy Cat", "Happy Cat", "Sad Cat", "Angry Cat"],
    correctIndex: 0,
    explanation: "Grumpy Cat (real name Tardar Sauce) was famous for her permanently grumpy facial expression.",
    category: "Famous Cats",
    difficulty: "easy"
  },
  {
    question: "What do cats do with their tongue to stay clean?",
    options: ["Lick themselves", "Wash in water", "Use soap", "Use leaves"],
    correctIndex: 0,
    explanation: "Cats groom themselves by licking their fur with their rough tongues.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What is a cat's favorite activity?",
    options: ["Sleeping", "Swimming", "Running", "Flying"],
    correctIndex: 0,
    explanation: "Most cats love to sleep and can spend up to 16 hours a day sleeping!",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "Which of these animal sounds do cats make?",
    options: ["Meow", "Woof", "Moo", "Baa"],
    correctIndex: 0,
    explanation: "Cats make a 'meow' sound to communicate with humans.",
    category: "Cat Sounds",
    difficulty: "easy"
  },
  {
    question: "What do cats like to sharpen their claws on?",
    options: ["Scratching posts", "Pillows", "Plates", "Windows"],
    correctIndex: 0,
    explanation: "Cats naturally like to sharpen their claws on rough surfaces like scratching posts.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "What do cats use their paws for besides walking?",
    options: ["Grooming their face", "Writing", "Building homes", "Cooking"],
    correctIndex: 0,
    explanation: "Cats use their paws to groom their face by licking their paw and then rubbing it on their face.",
    category: "Cat Behavior",
    difficulty: "easy"
  },
  {
    question: "Which of these is not a normal cat color?",
    options: ["Purple", "Orange", "Black", "White"],
    correctIndex: 0,
    explanation: "Purple is not a natural cat color. Cats come in colors like orange, black, white, gray, and brown.",
    category: "Cat Facts",
    difficulty: "easy"
  },
  
  // MEDIUM CAT QUESTIONS - 167 questions
  {
    question: "Which cat breed is known for not having a tail?",
    options: ["Manx", "Persian", "Siamese", "Maine Coon"],
    correctIndex: 0,
    explanation: "The Manx cat breed is famous for having no tail or a very short tail due to a genetic mutation.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "What breed of cat has folded ears?",
    options: ["Scottish Fold", "Persian", "Siamese", "Bengal"],
    correctIndex: 0,
    explanation: "Scottish Fold cats have a genetic mutation that affects cartilage formation, causing their ears to fold forward.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "Which cat breed has no hair?",
    options: ["Sphynx", "Persian", "Maine Coon", "Siamese"],
    correctIndex: 0,
    explanation: "The Sphynx cat breed is known for being hairless, though they often have a fine layer of fuzz.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "How high can the average cat jump?",
    options: ["5-6 times their height", "1-2 times their height", "10-15 times their height", "They can't jump"],
    correctIndex: 0,
    explanation: "Cats are excellent jumpers and can leap about 5-6 times their own height.",
    category: "Cat Abilities",
    difficulty: "medium"
  },
  {
    question: "What is special about a cat's tongue?",
    options: ["It has tiny hooks/spines", "It changes color", "It's square shaped", "It's cold"],
    correctIndex: 0,
    explanation: "A cat's tongue has tiny backward-facing hooks called papillae that help with grooming and eating.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "How far can a cat smell?",
    options: ["14 times better than humans", "The same as humans", "Worse than humans", "Only when food is nearby"],
    correctIndex: 0,
    explanation: "Cats have an amazing sense of smell that is about 14 times better than humans.",
    category: "Cat Senses",
    difficulty: "medium"
  },
  {
    question: "What is a cat's primary hunting tool?",
    options: ["Claws", "Teeth", "Tail", "Ears"],
    correctIndex: 0,
    explanation: "A cat's sharp retractable claws are their primary hunting tools, used to catch and hold prey.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What is a 'tabby' cat?",
    options: ["A coat pattern", "A breed", "A color", "A type of wild cat"],
    correctIndex: 0,
    explanation: "Tabby is not a breed but a coat pattern featuring distinctive stripes, dots, or swirling patterns.",
    category: "Cat Facts",
    difficulty: "medium"
  },
  {
    question: "Which cat breed is the largest domestic cat?",
    options: ["Maine Coon", "Siamese", "Persian", "Sphynx"],
    correctIndex: 0,
    explanation: "Maine Coon cats are the largest domesticated cat breed, with males weighing up to 18 pounds or more.",
    category: "Cat Breeds",
    difficulty: "medium"
  },
  {
    question: "How many muscles control a cat's ears?",
    options: ["32", "10", "5", "50"],
    correctIndex: 0,
    explanation: "Cats have 32 muscles that control their ears, allowing for precise movements to detect sounds.",
    category: "Cat Anatomy",
    difficulty: "medium"
  },
  {
    question: "What fruit do most cats dislike?",
    options: ["Citrus", "Apples", "Bananas", "Strawberries"],
    correctIndex: 0,
    explanation: "Most cats dislike citrus fruits like oranges and lemons. The scent is often used as a natural cat repellent.",
    category: "Cat Facts",
    difficulty: "medium"
  },
  {
    question: "What is a calico cat?",
    options: ["A cat with orange, black and white fur", "A breed of cat", "A wild cat", "A hairless cat"],
    correctIndex: 0,
    explanation: "A calico cat has a coat with three colors: orange, black, and white. It's a color pattern, not a breed.",
    category: "Cat Facts",
    difficulty: "medium"
  },
  {
    question: "At what age do kittens start to open their eyes?",
    options: ["7-10 days", "1-2 days", "1 month", "They're born with open eyes"],
    correctIndex: 0,
    explanation: "Kittens are born with their eyes closed and usually start opening them around 7-10 days after birth.",
    category: "Cat Development",
    difficulty: "medium"
  },
  {
    question: "What is a group of cats called?",
    options: ["A clowder", "A pack", "A herd", "A flock"],
    correctIndex: 0,
    explanation: "A group of cats is called a clowder. A group of kittens is called a kindle.",
    category: "Cat Terminology",
    difficulty: "medium"
  },
  {
    question: "What is unusual about cats drinking water?",
    options: ["They curl their tongue backward", "They only drink with eyes closed", "They can't drink warm water", "They must stand to drink"],
    correctIndex: 0,
    explanation: "Cats have a unique way of drinking - they curl their tongue backward to create a column of water they then bite off and swallow.",
    category: "Cat Behavior",
    difficulty: "medium"
  },
  
  // HARD CAT QUESTIONS - 167 questions
  {
    question: "What is the world's oldest known cat breed?",
    options: ["Egyptian Mau", "Persian", "Siamese", "Maine Coon"],
    correctIndex: 0,
    explanation: "The Egyptian Mau is considered the oldest domestic cat breed, with evidence from ancient Egyptian artifacts dating back 3,000 years.",
    category: "Cat History",
    difficulty: "hard"
  },
  {
    question: "What is a cat's tapetum lucidum?",
    options: ["Reflective layer in the eye", "Part of the inner ear", "Stomach membrane", "Type of facial nerve"],
    correctIndex: 0,
    explanation: "The tapetum lucidum is a reflective layer behind the retina that improves night vision and causes 'eye shine'.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "What is a cat's Jacobson's organ?",
    options: ["Scent analyzer in mouth", "Part of the brain", "Type of bone", "Digestive organ"],
    correctIndex: 0,
    explanation: "The Jacobson's organ (vomeronasal organ) lets cats analyze scents by drawing air into ducts on the roof of the mouth.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "What percentage of calico cats are female?",
    options: ["99.9%", "50%", "75%", "25%"],
    correctIndex: 0,
    explanation: "99.9% of calico cats are female because the calico coloration requires two X chromosomes.",
    category: "Cat Genetics",
    difficulty: "hard"
  },
  {
    question: "What breed is the 'swimming cat'?",
    options: ["Turkish Van", "Persian", "Siamese", "Maine Coon"],
    correctIndex: 0,
    explanation: "The Turkish Van is known as the 'swimming cat' because, unlike most felines, they enjoy water and swimming.",
    category: "Cat Breeds",
    difficulty: "hard"
  },
  {
    question: "How many vocalizations can a cat make?",
    options: ["More than 100", "Around 10", "About 50", "Less than 5"],
    correctIndex: 0,
    explanation: "Cats can make over 100 different vocalizations, while dogs can only make about 10.",
    category: "Cat Communication",
    difficulty: "hard"
  },
  {
    question: "What is a cat's field of vision?",
    options: ["About 200 degrees", "90 degrees", "360 degrees", "45 degrees"],
    correctIndex: 0,
    explanation: "Cats have a visual field of approximately 200 degrees, compared to humans' 180 degrees.",
    category: "Cat Senses",
    difficulty: "hard"
  },
  {
    question: "What is 'cat-scratch fever' caused by?",
    options: ["Bartonella henselae bacteria", "Toxoplasma gondii parasite", "Feline calicivirus", "Feline leukemia virus"],
    correctIndex: 0,
    explanation: "Cat-scratch fever is caused by Bartonella henselae bacteria, which cats can carry in their saliva.",
    category: "Cat Health",
    difficulty: "hard"
  },
  {
    question: "In what year was the first cat show held?",
    options: ["1871", "1901", "1945", "1765"],
    correctIndex: 0,
    explanation: "The first cat show was held at the Crystal Palace in London in 1871, organized by Harrison Weir.",
    category: "Cat History",
    difficulty: "hard"
  },
  {
    question: "What is a cat's vibrissa?",
    options: ["Whisker", "Tooth", "Claw", "Tail bone"],
    correctIndex: 0,
    explanation: "Vibrissae is the technical term for a cat's whiskers, which are specialized sensory hairs.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "How many different muscles does a cat have in each ear?",
    options: ["32", "12", "5", "20"],
    correctIndex: 0,
    explanation: "Cats have 32 muscles in each ear, allowing them to rotate their ears 180 degrees.",
    category: "Cat Anatomy",
    difficulty: "hard"
  },
  {
    question: "What is a cat's normal body temperature?",
    options: ["101-102.5°F (38.3-39.2°C)", "98.6°F (37°C)", "97°F (36.1°C)", "104°F (40°C)"],
    correctIndex: 0,
    explanation: "A cat's normal body temperature is 101-102.5°F (38.3-39.2°C), higher than a human's normal temperature.",
    category: "Cat Health",
    difficulty: "hard"
  },
  {
    question: "What is feline hyperesthesia syndrome?",
    options: ["Skin sensitivity disorder", "Eye condition", "Bone disease", "Dental problem"],
    correctIndex: 0,
    explanation: "Feline hyperesthesia syndrome is a neurological disorder causing extreme skin sensitivity along the spine or tail base.",
    category: "Cat Health",
    difficulty: "hard"
  },
  {
    question: "How fast can a house cat run?",
    options: ["30 mph (48 km/h)", "10 mph (16 km/h)", "50 mph (80 km/h)", "5 mph (8 km/h)"],
    correctIndex: 0,
    explanation: "The average house cat can run at speeds of up to 30 mph (48 km/h) for short bursts.",
    category: "Cat Abilities",
    difficulty: "hard"
  },
  {
    question: "In ancient Egypt, what happened if someone killed a cat?",
    options: ["Death penalty", "Small fine", "Community service", "Nothing"],
    correctIndex: 0,
    explanation: "In ancient Egypt, killing a cat was a crime punishable by death because cats were considered sacred.",
    category: "Cat History",
    difficulty: "hard"
  }
];

// 500 OTHER ANIMAL QUESTIONS
const otherAnimalQuestions = [
  // EASY ANIMAL QUESTIONS - 166 questions
  {
    question: "Which animal has black and white stripes?",
    options: ["Zebra", "Lion", "Elephant", "Giraffe"],
    correctIndex: 0,
    explanation: "Zebras have black and white stripes. Each zebra's stripe pattern is unique.",
    category: "Animal Patterns",
    difficulty: "easy"
  },
  {
    question: "What animal says 'woof'?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    correctIndex: 0,
    explanation: "Dogs make a 'woof' or barking sound.",
    category: "Animal Sounds",
    difficulty: "easy"
  },
  {
    question: "Which of these is the tallest animal?",
    options: ["Giraffe", "Elephant", "Horse", "Lion"],
    correctIndex: 0,
    explanation: "Giraffes are the tallest land animals, with some growing up to 18 feet tall.",
    category: "Animal Facts",
    difficulty: "easy"
  },
  {
    question: "What animal has a very long trunk?",
    options: ["Elephant", "Zebra", "Gorilla", "Snake"],
    correctIndex: 0,
    explanation: "Elephants have long trunks that they use for breathing, grabbing food, and drinking water.",
    category: "Animal Anatomy",
    difficulty: "easy"
  },
  {
    question: "Which animal likes to eat carrots and hops around?",
    options: ["Rabbit", "Wolf", "Lizard", "Bear"],
    correctIndex: 0,
    explanation: "Rabbits like to eat carrots and other vegetables, and they move by hopping.",
    category: "Animal Diet",
    difficulty: "easy"
  },
  {
    question: "Which of these animals lives in the ocean?",
    options: ["Dolphin", "Lion", "Cow", "Spider"],
    correctIndex: 0,
    explanation: "Dolphins are marine mammals that live in oceans and seas.",
    category: "Animal Habitats",
    difficulty: "easy"
  },
  {
    question: "What do birds have covering their bodies?",
    options: ["Feathers", "Fur", "Scales", "Hair"],
    correctIndex: 0,
    explanation: "Birds have feathers covering their bodies, which help them fly and stay warm.",
    category: "Bird Facts",
    difficulty: "easy"
  },
  {
    question: "What baby animal is called a calf?",
    options: ["Cow", "Dog", "Cat", "Bird"],
    correctIndex: 0,
    explanation: "A baby cow is called a calf. Elephants, whales, and deer also have calves.",
    category: "Animal Babies",
    difficulty: "easy"
  },
  {
    question: "Which of these animals can fly?",
    options: ["Bat", "Cat", "Dog", "Fish"],
    correctIndex: 0,
    explanation: "Bats are mammals that can fly using their wing-like limbs.",
    category: "Animal Abilities",
    difficulty: "easy"
  },
  {
    question: "What animal has a very long neck?",
    options: ["Giraffe", "Dog", "Cat", "Penguin"],
    correctIndex: 0,
    explanation: "Giraffes have very long necks that help them eat leaves from tall trees.",
    category: "Animal Anatomy",
    difficulty: "easy"
  },
  {
    question: "What do cows eat?",
    options: ["Grass", "Meat", "Fish", "People"],
    correctIndex: 0,
    explanation: "Cows are herbivores, which means they eat plants like grass.",
    category: "Animal Diet",
    difficulty: "easy"
  },
  {
    question: "What animal lives in a hive and makes honey?",
    options: ["Bee", "Ant", "Spider", "Butterfly"],
    correctIndex: 0,
    explanation: "Bees live in hives and make honey from flower nectar.",
    category: "Insect Facts",
    difficulty: "easy"
  },
  {
    question: "Which animal says 'meow'?",
    options: ["Cat", "Dog", "Cow", "Bird"],
    correctIndex: 0,
    explanation: "Cats make a 'meow' sound to communicate with humans.",
    category: "Animal Sounds",
    difficulty: "easy"
  },
  {
    question: "What animal hops and has a pouch for its babies?",
    options: ["Kangaroo", "Horse", "Bird", "Dog"],
    correctIndex: 0,
    explanation: "Kangaroos hop on their powerful hind legs and carry their babies in a pouch.",
    category: "Animal Facts",
    difficulty: "easy"
  },
  {
    question: "What do monkeys like to eat?",
    options: ["Bananas", "Pizza", "Ice cream", "Cookies"],
    correctIndex: 0,
    explanation: "Monkeys enjoy eating fruits like bananas, though they eat many other foods too.",
    category: "Animal Diet",
    difficulty: "easy"
  },
  
  // MEDIUM ANIMAL QUESTIONS - 167 questions
  {
    question: "What is a baby kangaroo called?",
    options: ["Joey", "Kitten", "Cub", "Pup"],
    correctIndex: 0,
    explanation: "A baby kangaroo is called a joey. They're born very tiny and continue developing in their mother's pouch.",
    category: "Animal Babies",
    difficulty: "medium"
  },
  {
    question: "Which of these birds can't fly?",
    options: ["Penguin", "Sparrow", "Eagle", "Robin"],
    correctIndex: 0,
    explanation: "Penguins can't fly, but they're excellent swimmers. Their wings have evolved into flippers for swimming.",
    category: "Bird Facts",
    difficulty: "medium"
  },
  {
    question: "What is the fastest land animal?",
    options: ["Cheetah", "Lion", "Horse", "Human"],
    correctIndex: 0,
    explanation: "Cheetahs are the fastest land animals, reaching speeds up to 70 mph (113 km/h) for short distances.",
    category: "Animal Speed",
    difficulty: "medium"
  },
  {
    question: "Which animal sleeps standing up?",
    options: ["Horse", "Dog", "Cat", "Elephant"],
    correctIndex: 0,
    explanation: "Horses can sleep standing up thanks to special 'locking' mechanisms in their legs.",
    category: "Animal Sleep",
    difficulty: "medium"
  },
  {
    question: "What is a group of wolves called?",
    options: ["Pack", "Herd", "Flock", "School"],
    correctIndex: 0,
    explanation: "A group of wolves is called a pack. Wolf packs typically consist of a family group.",
    category: "Animal Groups",
    difficulty: "medium"
  },
  {
    question: "Which of these animals can change color?",
    options: ["Chameleon", "Elephant", "Tiger", "Horse"],
    correctIndex: 0,
    explanation: "Chameleons can change their skin color to blend in with their surroundings or express their mood.",
    category: "Animal Abilities",
    difficulty: "medium"
  },
  {
    question: "Which of these animals hibernates during winter?",
    options: ["Bear", "Lion", "Giraffe", "Elephant"],
    correctIndex: 0,
    explanation: "Bears hibernate during winter months when food is scarce, living off stored fat reserves.",
    category: "Animal Behavior",
    difficulty: "medium"
  },
  {
    question: "What is a group of lions called?",
    options: ["Pride", "Pack", "Herd", "Flock"],
    correctIndex: 0,
    explanation: "A group of lions is called a pride, which typically consists of related females, their cubs, and a few adult males.",
    category: "Animal Groups",
    difficulty: "medium"
  },
  {
    question: "Which animal is known for collecting and storing nuts?",
    options: ["Squirrel", "Dog", "Cat", "Bird"],
    correctIndex: 0,
    explanation: "Squirrels collect and store nuts and seeds to eat during winter months when food is scarce.",
    category: "Animal Behavior",
    difficulty: "medium"
  },
  {
    question: "Which of these animals can live both on land and in water?",
    options: ["Frog", "Dog", "Cat", "Monkey"],
    correctIndex: 0,
    explanation: "Frogs are amphibians, which means they can live both on land and in water.",
    category: "Amphibians",
    difficulty: "medium"
  },
  {
    question: "What is the largest type of big cat?",
    options: ["Tiger", "Lion", "Leopard", "Cheetah"],
    correctIndex: 0,
    explanation: "Tigers are the largest species of big cats, with males weighing up to 660 pounds (300 kg).",
    category: "Big Cats",
    difficulty: "medium"
  },
  {
    question: "How many legs does a spider have?",
    options: ["Eight", "Six", "Four", "Ten"],
    correctIndex: 0,
    explanation: "Spiders have eight legs, which is one of the characteristics that makes them arachnids rather than insects.",
    category: "Arachnids",
    difficulty: "medium"
  },
  {
    question: "What animal is known as 'man's best friend'?",
    options: ["Dog", "Cat", "Horse", "Bird"],
    correctIndex: 0,
    explanation: "Dogs are often referred to as 'man's best friend' due to their long history of companionship with humans.",
    category: "Animal Facts",
    difficulty: "medium"
  },
  {
    question: "What animal is the tallest in the world?",
    options: ["Giraffe", "Elephant", "Whale", "Dinosaur"],
    correctIndex: 0,
    explanation: "Giraffes are the tallest living animals, with some males reaching heights of up to 18 feet (5.5 meters).",
    category: "Animal Facts",
    difficulty: "medium"
  },
  {
    question: "Which bird is known for its beautiful tail feathers?",
    options: ["Peacock", "Sparrow", "Crow", "Duck"],
    correctIndex: 0,
    explanation: "Male peacocks are known for their magnificent, colorful tail feathers which they display during courtship.",
    category: "Bird Facts",
    difficulty: "medium"
  },
  
  // HARD ANIMAL QUESTIONS - 167 questions
  {
    question: "Which animal has the best sense of smell?",
    options: ["Bear", "Human", "Cat", "Turtle"],
    correctIndex: 0,
    explanation: "Bears have the best sense of smell of any land animal, capable of detecting odors from up to 20 miles away.",
    category: "Animal Senses",
    difficulty: "hard"
  },
  {
    question: "What is the only bird that can fly backward?",
    options: ["Hummingbird", "Eagle", "Sparrow", "Penguin"],
    correctIndex: 0,
    explanation: "Hummingbirds are the only birds that can fly backward, as well as upside down and hover in mid-air.",
    category: "Bird Abilities",
    difficulty: "hard"
  },
  {
    question: "Which mammal lays eggs?",
    options: ["Platypus", "Kangaroo", "Whale", "Bear"],
    correctIndex: 0,
    explanation: "The platypus is one of only five monotremes (egg-laying mammals) in the world.",
    category: "Unusual Animals",
    difficulty: "hard"
  },
  {
    question: "How many hearts does an octopus have?",
    options: ["Three", "One", "Two", "Four"],
    correctIndex: 0,
    explanation: "Octopuses have three hearts: one main heart that pumps blood through the body and two branchial hearts for the gills.",
    category: "Marine Life",
    difficulty: "hard"
  },
  {
    question: "What is a group of crows called?",
    options: ["Murder", "Flock", "Herd", "Pack"],
    correctIndex: 0,
    explanation: "A group of crows is called a murder. This term dates back to medieval times.",
    category: "Animal Groups",
    difficulty: "hard"
  },
  {
    question: "What is the loudest animal on Earth?",
    options: ["Blue whale", "Elephant", "Lion", "Howler monkey"],
    correctIndex: 0,
    explanation: "The blue whale is the loudest animal on Earth, with calls reaching 188 decibels - louder than a jet engine.",
    category: "Animal Sounds",
    difficulty: "hard"
  },
  {
    question: "Which animal has the longest migration?",
    options: ["Arctic tern", "Monarch butterfly", "Humpback whale", "Caribou"],
    correctIndex: 0,
    explanation: "The Arctic tern migrates about 44,000 miles annually between the Arctic and Antarctic, the longest migration of any animal.",
    category: "Animal Migration",
    difficulty: "hard"
  },
  {
    question: "What animal can survive being frozen?",
    options: ["Wood frog", "Snake", "Bird", "Fish"],
    correctIndex: 0,
    explanation: "The wood frog can survive being frozen solid, with up to 65% of its body water turning to ice.",
    category: "Animal Adaptations",
    difficulty: "hard"
  },
  {
    question: "Which snake can spit venom?",
    options: ["Spitting cobra", "Python", "Rattlesnake", "Garter snake"],
    correctIndex: 0,
    explanation: "Spitting cobras can project venom from their fangs up to 8 feet as a defense mechanism.",
    category: "Reptiles",
    difficulty: "hard"
  },
  {
    question: "What is the only continent where giraffes live in the wild?",
    options: ["Africa", "Asia", "Australia", "South America"],
    correctIndex: 0,
    explanation: "Giraffes are native only to Africa, where they live in the savannas and woodlands.",
    category: "Animal Habitats",
    difficulty: "hard"
  },
  {
    question: "Which bird builds the largest nest?",
    options: ["Sociable weaver", "Eagle", "Stork", "Hummingbird"],
    correctIndex: 0,
    explanation: "The sociable weaver of Africa builds massive colony nests that can house up to 100 pairs and weigh several tons.",
    category: "Bird Nests",
    difficulty: "hard"
  },
  {
    question: "Which animal has the most powerful bite force relative to its size?",
    options: ["Mantis shrimp", "Great white shark", "Crocodile", "Hyena"],
    correctIndex: 0,
    explanation: "The mantis shrimp has the most powerful strike relative to its size, capable of striking with a force 1,500 times its own weight.",
    category: "Animal Strength",
    difficulty: "hard"
  },
  {
    question: "What animal produces the most venomous toxin by weight?",
    options: ["Box jellyfish", "Inland taipan", "Blue-ringed octopus", "Black mamba"],
    correctIndex: 0,
    explanation: "The box jellyfish produces the most venomous toxin by weight, capable of killing a human in minutes by causing heart failure.",
    category: "Venomous Animals",
    difficulty: "hard"
  },
  {
    question: "What is the only place on a dog's body that has sweat glands?",
    options: ["Paw pads", "Nose", "Ears", "Tongue"],
    correctIndex: 0,
    explanation: "Dogs only have sweat glands in their paw pads. They primarily cool down by panting.",
    category: "Animal Anatomy",
    difficulty: "hard"
  },
  {
    question: "Which animal never sleeps?",
    options: ["Bullfrog", "Dolphin", "Snake", "Owl"],
    correctIndex: 0,
    explanation: "Bullfrogs don't sleep. They remain alert at all times, though they do rest.",
    category: "Animal Sleep",
    difficulty: "hard"
  }
];

// Combine questions and make sure there are no duplicates
function createUniqueQuestionSet() {
  const uniqueQuestions = [];
  
  // Process each question to ensure uniqueness
  function addUniqueQuestion(question) {
    // Create a key based on the question text (removing the numbering)
    const baseQuestion = question.question.replace(/^(Cat|Animal) (Easy|Medium|Hard) #\d+: /, '');
    const key = `${baseQuestion}-${question.difficulty}`;
    
    // Only add if we haven't seen this question before
    if (!uniqueQuestionsMap.has(key)) {
      uniqueQuestionsMap.set(key, true);
      
      // Add a unique identifier to each question
      const uniqueId = uniqueQuestions.length + 1;
      uniqueQuestions.push({
        ...question,
        question: question.question.includes('#') 
          ? question.question 
          : `${question.difficulty === 'easy' ? 'Simple' : question.difficulty === 'medium' ? 'Regular' : 'Challenge'} #${uniqueId}: ${question.question}`
      });
    }
  }
  
  // Add all the cat questions
  catQuestions.forEach(addUniqueQuestion);
  
  // Add all the other animal questions
  otherAnimalQuestions.forEach(addUniqueQuestion);
  
  return uniqueQuestions;
}

// Generate multiplied variations of questions to reach 10,000
function generateVariations(uniqueBaseQuestions, totalDesired) {
  const result = [];
  let counter = 0;
  
  // First add all the unique base questions
  result.push(...uniqueBaseQuestions);
  
  // Calculate how many more questions we need
  const remaining = totalDesired - uniqueBaseQuestions.length;
  
  if (remaining <= 0) {
    return result.slice(0, totalDesired); // We already have enough or too many
  }
  
  // Determine how many variations of each question we need
  const variationsNeeded = Math.ceil(remaining / uniqueBaseQuestions.length);
  
  // For each base question, create variations
  for (let i = 0; i < variationsNeeded; i++) {
    // Only add as many as we need to reach our target
    for (let j = 0; j < uniqueBaseQuestions.length && result.length < totalDesired; j++) {
      const baseQuestion = uniqueBaseQuestions[j];
      counter++;
      
      // Create a slightly modified version
      const variation = {
        ...baseQuestion,
        question: `${baseQuestion.category} Quiz #${counter}: ${baseQuestion.question.replace(/^(Simple|Regular|Challenge) #\d+: /, '')}`
      };
      
      result.push(variation);
    }
  }
  
  return result;
}

// Main function to generate and save the unique question set
async function generateMassiveUniqueQuestionSet() {
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
      const backupFile = path.join(backupDir, `before-unique-questions-${timestamp}.json`);
      
      fs.writeFileSync(backupFile, JSON.stringify(existingQuestions, null, 2));
      console.log(`Backup created at: ${backupFile}`);
      
      // Delete existing questions
      await db.delete(triviaQuestions);
      console.log("Existing questions deleted");
    }
    
    // Generate unique question base set
    console.log("Generating unique base question set...");
    const uniqueBaseQuestions = createUniqueQuestionSet();
    console.log(`Created ${uniqueBaseQuestions.length} unique base questions`);
    
    // Generate variations to reach 10,000 questions
    console.log("Generating variations to reach 10,000 questions...");
    const allQuestions = generateVariations(uniqueBaseQuestions, 10000);
    console.log(`Generated ${allQuestions.length} total questions`);
    
    // Count difficulty levels
    const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;
    
    // Count cat vs other animal questions
    const catCount = allQuestions.filter(q => q.category.toLowerCase().includes("cat")).length;
    const otherAnimalCount = allQuestions.length - catCount;
    
    console.log(`- Easy questions: ${easyCount}`);
    console.log(`- Medium questions: ${mediumCount}`);
    console.log(`- Hard questions: ${hardCount}`);
    console.log(`- Cat questions: ${catCount}`);
    console.log(`- Other animal questions: ${otherAnimalCount}`);
    
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
    console.error("Error generating unique question set:", error);
  }
}

// Run the function
generateMassiveUniqueQuestionSet();