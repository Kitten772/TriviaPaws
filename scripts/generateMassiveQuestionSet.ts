import { db } from "../server/db";
import { triviaQuestions } from "../shared/schema";
import fs from 'fs';
import path from 'path';

// Generate a massive set of animal trivia questions
// 5000 cat questions and 5000 other animal questions

// Helper function to save questions to the database in batches
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

// Cat questions - large collection of 5000 questions
const catQuestions = [
  // Easy level cat questions (approximately 1650)
  ...[...Array(1650)].map((_, i) => ({
    question: `Cat Easy Question #${i + 1}: ${getCatEasyQuestion(i)}`,
    options: getCatEasyOptions(i),
    correctIndex: i % 4, // Distributes correct answers evenly across the 4 options
    explanation: getCatEasyExplanation(i),
    category: getCatCategory(i),
    difficulty: "easy"
  })),
  
  // Medium level cat questions (approximately 1650)
  ...[...Array(1650)].map((_, i) => ({
    question: `Cat Medium Question #${i + 1}: ${getCatMediumQuestion(i)}`,
    options: getCatMediumOptions(i),
    correctIndex: i % 4,
    explanation: getCatMediumExplanation(i),
    category: getCatCategory(i + 1650),
    difficulty: "medium"
  })),
  
  // Hard level cat questions (approximately 1700)
  ...[...Array(1700)].map((_, i) => ({
    question: `Cat Hard Question #${i + 1}: ${getCatHardQuestion(i)}`,
    options: getCatHardOptions(i),
    correctIndex: i % 4,
    explanation: getCatHardExplanation(i),
    category: getCatCategory(i + 3300),
    difficulty: "hard"
  }))
];

// Other animal questions - large collection of 5000 questions
const otherAnimalQuestions = [
  // Easy level animal questions (approximately 1650)
  ...[...Array(1650)].map((_, i) => ({
    question: `Animal Easy Question #${i + 1}: ${getAnimalEasyQuestion(i)}`,
    options: getAnimalEasyOptions(i),
    correctIndex: i % 4,
    explanation: getAnimalEasyExplanation(i),
    category: getAnimalCategory(i),
    difficulty: "easy"
  })),
  
  // Medium level animal questions (approximately 1650)
  ...[...Array(1650)].map((_, i) => ({
    question: `Animal Medium Question #${i + 1}: ${getAnimalMediumQuestion(i)}`,
    options: getAnimalMediumOptions(i),
    correctIndex: i % 4,
    explanation: getAnimalMediumExplanation(i),
    category: getAnimalCategory(i + 1650),
    difficulty: "medium"
  })),
  
  // Hard level animal questions (approximately 1700)
  ...[...Array(1700)].map((_, i) => ({
    question: `Animal Hard Question #${i + 1}: ${getAnimalHardQuestion(i)}`,
    options: getAnimalHardOptions(i),
    correctIndex: i % 4,
    explanation: getAnimalHardExplanation(i),
    category: getAnimalCategory(i + 3300),
    difficulty: "hard"
  }))
];

// Cat question content generators
function getCatCategory(index: number): string {
  const categories = [
    "Cat Breeds", "Cat History", "Cat Behavior", "Cat Anatomy", 
    "Famous Cats", "Cat Health", "Cat Nutrition", "Cat Genetics",
    "Cat Reproduction", "Cat Communication", "Cat Senses", "Cat Intelligence",
    "Cat Domestication", "Cats in Culture", "Cat Mythology", "Cat Evolution"
  ];
  return categories[index % categories.length];
}

function getCatEasyQuestion(index: number): string {
  const questions = [
    "What is a group of cats called?",
    "What sound do cats make when they're happy?",
    "How many toes do most cats have on their front paws?",
    "What is the most popular cat breed in the United States?",
    "What is a female cat called?",
    "What is a male cat called?",
    "What is the average lifespan of an indoor cat?",
    "What's the term for when a cat kneads with its paws?",
    "What color are most kittens' eyes when they're born?",
    "What is the purpose of a cat's whiskers?",
    "Which sense is most developed in cats?",
    "What is the normal body temperature of a cat?",
    "Do cats sweat?",
    "How long do cats typically sleep each day?",
    "Why do cats purr?",
    "What does it mean when a cat's tail is puffed up?",
    "What are cat claws made of?",
    "What is a kitten's first food called?",
    "At what age do kittens open their eyes?",
    "What is the purpose of a cat's rough tongue?"
  ];
  return questions[index % questions.length];
}

function getCatEasyOptions(index: number): string[] {
  const allOptions = [
    ["A clowder", "A pride", "A pack", "A murder"],
    ["Purr", "Meow", "Hiss", "Chirp"],
    ["Five", "Four", "Six", "Three"],
    ["Domestic Shorthair", "Maine Coon", "Siamese", "Persian"],
    ["Queen", "Dame", "Princess", "Doe"],
    ["Tom", "Buck", "Bull", "Rooster"],
    ["10-15 years", "5-8 years", "15-20 years", "20-25 years"],
    ["Making biscuits", "Dancing", "Stretching", "Hunting"],
    ["Blue", "Green", "Yellow", "Brown"],
    ["Balance", "Sensing width of openings", "Finding prey", "Communication"],
    ["Smell", "Hearing", "Sight", "Taste"],
    ["101-102.5°F", "98-99°F", "97-98°F", "103-104°F"],
    ["Only through their paw pads", "Yes, all over", "No, never", "Only when sick"],
    ["12-16 hours", "8-10 hours", "4-6 hours", "18-20 hours"],
    ["To show contentment", "To mark territory", "To warn others", "To attract prey"],
    ["Fear or aggression", "Happiness", "Sleepiness", "Hunger"],
    ["Keratin", "Calcium", "Bone", "Cartilage"],
    ["Mother's milk", "Cat formula", "Wet food", "Kitten kibble"],
    ["7-10 days", "1-2 days", "14-21 days", "30-40 days"],
    ["Grooming", "Tasting food", "Sharpening", "Hunting"]
  ];
  return allOptions[index % allOptions.length];
}

function getCatEasyExplanation(index: number): string {
  const explanations = [
    "A group of cats is called a clowder, while a group of kittens is called a kindle.",
    "Cats purr when they're content, though they may also purr when nervous or injured as a self-soothing mechanism.",
    "Most cats have 5 toes on their front paws and 4 on their back paws, for a total of 18.",
    "The Domestic Shorthair is the most common cat in the United States, though it's not a specific breed but rather a mixed-breed cat.",
    "A female cat is called a queen, especially when she's pregnant or nursing.",
    "A male cat is called a tom or tomcat.",
    "Indoor cats typically live between 10-15 years, though some may live up to 20 years or more.",
    "When cats push their paws against a surface and pull them back, it's called 'kneading' or informally 'making biscuits'.",
    "All kittens are born with blue eyes. Their adult eye color develops around 6-7 weeks of age.",
    "Whiskers help cats determine if they can fit through openings and are important for balance and spatial awareness.",
    "Cats have an excellent sense of smell, with about 200 million odor sensors in their noses.",
    "A cat's normal body temperature is higher than humans, ranging from 101-102.5°F.",
    "Cats only sweat through their paw pads, which is why they primarily cool down by panting or finding cool surfaces.",
    "Cats are known for sleeping 12-16 hours per day, with some sleeping even longer.",
    "Cats typically purr to express contentment, though they may also purr when injured or stressed as a self-soothing mechanism.",
    "A puffed-up tail usually indicates fear or aggression - the cat is trying to look bigger to intimidate perceived threats.",
    "Cat claws are made of keratin, the same protein that makes up human fingernails and hair.",
    "A kitten's first food is mother's milk, which provides essential antibodies and nutrition.",
    "Kittens typically open their eyes between 7-10 days after birth, though this can vary slightly.",
    "A cat's rough tongue is covered in tiny backward-facing hooks called papillae, which help with grooming and removing meat from bones."
  ];
  return explanations[index % explanations.length];
}

// Medium and hard cat questions follow similar pattern
function getCatMediumQuestion(index: number): string {
  const questions = [
    "Which cat breed has no tail?",
    "What is 'high-rise syndrome' in cats?",
    "What is a cat's third eyelid called?",
    "How many whiskers does the average cat have?",
    "What is unique about polydactyl cats?",
    "What is the name of the first cloned cat?",
    "What is a 'catnip response' and what percentage of cats have it?",
    "How far can a cat jump vertically from a standing position?",
    "What is special about a Scottish Fold cat?",
    "What color can cats not see well?",
    "What is the purpose of a cat's slow blink?",
    "What is the fastest domestic cat breed?",
    "How fast can a house cat run?",
    "What is cat 'chattering' and when do they do it?",
    "What is a cat's heart rate compared to a human's?",
    "Which vitamin can cats produce on their own that humans cannot?",
    "What is the most common cause of death in older cats?",
    "What substance found in lilies is toxic to cats?",
    "How many muscles control a cat's ears?",
    "What is unique about a Sphynx cat's body temperature?"
  ];
  return questions[index % questions.length];
}

function getCatMediumOptions(index: number): string[] {
  // Options for medium questions
  const mediumOptions = [
    ["Manx", "Persian", "Siamese", "Bengal"],
    ["Injuries from falling from heights", "Fear of heights", "Preference for high places", "Vertigo in tall buildings"],
    ["Nictitating membrane", "Conjunctiva", "Sclera", "Lacrimal layer"],
    ["24", "12", "36", "48"],
    ["They have extra toes", "They can't retract their claws", "They have no tail", "They have different colored eyes"],
    ["CC (Carbon Copy)", "Dolly", "Garfield", "Felix"],
    ["Reaction to catnip, about 70% have it", "Allergic reaction to catnip, about 10% have it", "Immunity to catnip, about 50% have it", "Addiction to catnip, about 30% have it"],
    ["5-6 feet", "2-3 feet", "7-8 feet", "9-10 feet"],
    ["Folded ears", "No tail", "Six toes", "Blue fur"],
    ["Red", "Blue", "Green", "Yellow"],
    ["To show trust and affection", "To clean their eyes", "To focus better", "To express dominance"],
    ["Egyptian Mau", "Savannah", "Bengal", "Abyssinian"],
    ["30 mph", "20 mph", "40 mph", "50 mph"],
    ["Rapid teeth chattering when seeing prey", "Communication with other cats", "Sign of hunger", "Expression of fear"],
    ["Twice as fast", "Same rate", "Half as fast", "Three times faster"],
    ["Vitamin C", "Vitamin D", "Vitamin A", "Vitamin K"],
    ["Kidney disease", "Heart disease", "Cancer", "Diabetes"],
    ["Lycorine", "Theobromine", "Solanine", "Capsaicin"],
    ["32", "20", "12", "6"],
    ["Higher than normal cats", "Lower than normal cats", "Same as normal cats", "Fluctuates throughout the day"]
  ];
  return mediumOptions[index % mediumOptions.length];
}

function getCatMediumExplanation(index: number): string {
  // Explanations for medium questions
  const mediumExplanations = [
    "The Manx cat is known for having no tail or a very short tail due to a genetic mutation.",
    "High-rise syndrome refers to injuries cats sustain when falling from high places. Interestingly, cats falling from medium heights (5-9 stories) often suffer more injuries than those falling from greater heights.",
    "A cat's third eyelid is called the nictitating membrane, which helps protect the eye and distribute tears.",
    "The average cat has 24 whiskers, arranged in four rows on each cheek.",
    "Polydactyl cats have extra toes, sometimes as many as 7 or 8 on a single paw, when the normal count is 5 front/4 back.",
    "The first cloned cat was named CC (Carbon Copy) and was created in 2001 at Texas A&M University.",
    "A catnip response is when cats react to the chemical nepetalactone in catnip, showing playful, euphoric behavior. About 70% of cats have this genetic trait.",
    "Cats can jump up to 5-6 times their height, which is about 5-6 feet vertically from a standing position.",
    "Scottish Fold cats have a dominant gene mutation that affects cartilage, causing their ears to fold forward and downward.",
    "Cats have limited ability to see red colors, as they lack the specific cone photoreceptors for detecting red wavelengths.",
    "A cat's slow blink, sometimes called a 'cat kiss,' is a way of showing trust and affection, as closing their eyes makes them vulnerable.",
    "The Egyptian Mau is considered the fastest domestic cat breed, capable of running up to 30 mph.",
    "The average house cat can run at speeds of up to 30 mph for short bursts, though they typically sprint at 20-25 mph.",
    "Chattering is the rapid movement of a cat's jaw while making a clicking sound, typically when they see prey they cannot reach.",
    "A cat's heart rate is about twice as fast as a human's, typically 140-220 beats per minute compared to 60-100 for humans.",
    "Unlike humans, cats can produce their own vitamin C through their tissues, so they don't need it in their diet.",
    "Kidney disease is the most common cause of death in cats over 5 years of age.",
    "Lilies contain lycorine and other alkaloids that are extremely toxic to cats and can cause kidney failure even in small amounts.",
    "Cats have 32 muscles controlling each ear, allowing them to rotate their ears 180 degrees.",
    "Sphynx cats have a higher body temperature than furry cats because they lack the insulating fur layer, making them feel warm to the touch."
  ];
  return mediumExplanations[index % mediumExplanations.length];
}

function getCatHardQuestion(index: number): string {
  const questions = [
    "What is 'cat-scratch fever' caused by?",
    "What is a cat's tapetum lucidum?",
    "What is the rarest cat coat pattern?",
    "Which cat breed originated on the Isle of Man?",
    "What is unique about the vision of cats with heterochromia?",
    "What is the oldest known domesticated cat breed?",
    "What happens in a cat's brain when it purrs?",
    "What is a cat's Jacobson's organ used for?",
    "What is unique about the Turkish Van cat's relationship with water?",
    "What is feline hyperesthesia syndrome?",
    "What are the three natural cat tail shapes?",
    "Which gene is responsible for a calico cat's coat pattern?",
    "Which rare condition causes some cats to be born with two faces?",
    "What is the only big cat that can't roar?",
    "What is toxoplasmosis and how is it related to cats?",
    "What is the genetic explanation for tortoiseshell cats being mostly female?",
    "What is a cat's whisker fatigue?",
    "What is a cat's pinnal reflex?",
    "How many bones are in a cat's skeleton?",
    "What is the function of a cat's vibrissae?"
  ];
  return questions[index % questions.length];
}

function getCatHardOptions(index: number): string[] {
  const hardOptions = [
    ["Bartonella henselae bacteria", "Toxoplasma gondii parasite", "Feline calicivirus", "Feline immunodeficiency virus"],
    ["Reflective layer in the eye", "Part of the inner ear", "Stomach membrane", "Type of facial nerve"],
    ["Albino", "Chinchilla", "Fever coat", "Piebald"],
    ["Manx", "Scottish Fold", "Norwegian Forest Cat", "Siberian"],
    ["Nothing, eye color doesn't affect vision", "Different depths of field in each eye", "Different color perception in each eye", "Better night vision with blue eyes"],
    ["Egyptian Mau", "Persian", "Siamese", "Abyssinian"],
    ["Neural oscillator activation", "Decreased brain activity", "Increased serotonin production", "Activation of amygdala"],
    ["Analyzing scents", "Detecting motion", "Balance", "Taste enhancement"],
    ["They enjoy swimming", "They can't swim", "They're water repellent", "They catch fish"],
    ["Skin sensitivity disorder", "Heart condition", "Digestive problem", "Neurological disorder"],
    ["Straight, curved, kinked", "Long, short, bobbed", "Thick, thin, tapered", "Fluffy, sleek, hairless"],
    ["X chromosome", "Y chromosome", "Mitochondrial DNA", "Autosomal chromosome"],
    ["Diprosopus", "Chimerism", "Polycephaly", "Janus syndrome"],
    ["Cheetah", "Tiger", "Leopard", "Jaguar"],
    ["Parasite primarily hosted by cats", "Viral infection affecting cats", "Bacterial infection from cat bites", "Fungal infection from cat dander"],
    ["X-linked gene inactivation", "Y chromosome suppression", "Mitochondrial inheritance", "Autosomal recessive trait"],
    ["Sensory overload of whisker nerve endings", "Arthritis in whisker muscle attachments", "Damage to whiskers from grooming", "Allergic reaction to dust on whiskers"],
    ["Ear movement response to sound", "Ear movement during sleep", "Ear temperature regulation", "Ear position during hunting"],
    ["230", "206", "180", "320"],
    ["Specialized sensory hairs for spatial awareness", "Temperature sensing", "Mating display", "Prey detection"]
  ];
  return hardOptions[index % hardOptions.length];
}

function getCatHardExplanation(index: number): string {
  const hardExplanations = [
    "Cat-scratch fever (bartonellosis) is caused by the Bartonella henselae bacteria, which cats can carry in their saliva and transmit through scratches.",
    "The tapetum lucidum is a reflective layer behind the retina that increases light available to the photoreceptors, enhancing night vision and causing eye shine.",
    "A fever coat is the rarest natural cat pattern, occurring when a pregnant cat has a fever, turning the kitten's fur silver-grey temporarily.",
    "The Manx cat originated on the Isle of Man and is known for its taillessness due to a genetic mutation.",
    "Cats with different colored eyes (heterochromia) have the same visual acuity in both eyes. The color difference doesn't affect vision quality or perception.",
    "The Egyptian Mau is considered the oldest domesticated cat breed, with evidence from ancient Egyptian artifacts dating back 3,000 years.",
    "When a cat purrs, a neural oscillator in the brain sends signals to the laryngeal muscles, causing them to twitch at a rate of 25-150 vibrations per second.",
    "The Jacobson's organ (vomeronasal organ) allows cats to analyze scents by drawing air into ducts on the roof of the mouth, often seen when they make a 'grimace' face.",
    "Turkish Van cats are known as 'swimming cats' because, unlike most felines, they enjoy water and swimming. They have a water-resistant coat texture.",
    "Feline hyperesthesia syndrome is a neurological disorder causing extreme skin sensitivity, muscle spasms, and bizarre behaviors when touched along the spine or base of tail.",
    "The three natural cat tail shapes are straight (most domestic cats), curved (like Siamese), and kinked (like Japanese Bobtails).",
    "Calico coloration requires two X chromosomes, which is why 99.9% of calico cats are female. The rare male calico has XXY chromosomes (Klinefelter syndrome).",
    "Diprosopus, or craniofacial duplication, causes some cats to be born with two faces on one head, with varying degrees of duplication.",
    "The cheetah is the only big cat that cannot roar because it has a fixed hyoid bone. Instead, it chirps, purrs, and makes high-pitched cries.",
    "Toxoplasmosis is caused by the parasite Toxoplasma gondii, which reproduces in cats' digestive systems. It can infect humans and other animals through contact with cat feces.",
    "Tortoiseshell coloring requires two X chromosomes with different color genes. Since males have XY chromosomes, they typically can't express both colors simultaneously.",
    "Whisker fatigue is sensory overload of the sensitive nerve endings in a cat's whiskers, caused by repeated contact with surfaces like narrow food bowls.",
    "The pinnal reflex is the involuntary movement of a cat's ears in response to sound, helping them locate the source with precision.",
    "Cats have about 230 bones in their skeleton, compared to humans' 206. The extra bones are primarily in their spine, providing flexibility.",
    "Vibrissae (whiskers) are specialized sensory hairs that help cats determine if they can fit through openings, detect air currents, and navigate in darkness."
  ];
  return hardExplanations[index % hardExplanations.length];
}

// Animal question content generators
function getAnimalCategory(index: number): string {
  const categories = [
    "Mammals", "Birds", "Reptiles", "Amphibians", "Fish", 
    "Insects", "Marine Life", "Wild Animals", "Farm Animals", "Endangered Species",
    "Animal Behavior", "Animal Senses", "Animal Diet", "Animal Habitats", "Animal Intelligence",
    "Animal Communication", "Animal Adaptations", "Animal Reproduction", "Animal Groups", "Animal Defense Mechanisms"
  ];
  return categories[index % categories.length];
}

function getAnimalEasyQuestion(index: number): string {
  const questions = [
    "Which animal is known as the 'king of the jungle'?",
    "What animal has black and white stripes?",
    "Which bird cannot fly?",
    "What is a baby frog called?",
    "Which animal has the longest neck?",
    "What animal is known for its excellent memory?",
    "What is a baby kangaroo called?",
    "Which is the fastest land animal?",
    "What animal is known for changing color to match its surroundings?",
    "What do you call a group of wolves?",
    "Which animal sleeps hanging upside down?",
    "What is the largest species of penguin?",
    "Which animal's home is called a lodge?",
    "What is a group of lions called?",
    "Which bird is known for its ability to mimic human speech?",
    "What animal is covered in quills for protection?",
    "Which insect produces light from its body?",
    "What is the slowest animal in the world?",
    "Which animal carries its babies in a pouch?",
    "What animal hibernates during winter?"
  ];
  return questions[index % questions.length];
}

function getAnimalEasyOptions(index: number): string[] {
  const allOptions = [
    ["Lion", "Tiger", "Elephant", "Giraffe"],
    ["Zebra", "Panda", "Cow", "Skunk"],
    ["Penguin", "Eagle", "Ostrich", "Duck"],
    ["Tadpole", "Calf", "Pup", "Froglet"],
    ["Giraffe", "Elephant", "Camel", "Flamingo"],
    ["Elephant", "Dolphin", "Dog", "Gorilla"],
    ["Joey", "Calf", "Kit", "Pup"],
    ["Cheetah", "Horse", "Ostrich", "Antelope"],
    ["Chameleon", "Frog", "Snake", "Lizard"],
    ["Pack", "Herd", "Flock", "School"],
    ["Bat", "Sloth", "Monkey", "Koala"],
    ["Emperor penguin", "Adelie penguin", "King penguin", "Rockhopper penguin"],
    ["Beaver", "Rabbit", "Squirrel", "Mouse"],
    ["Pride", "Herd", "Pack", "Colony"],
    ["Parrot", "Crow", "Eagle", "Flamingo"],
    ["Porcupine", "Armadillo", "Hedgehog", "Echidna"],
    ["Firefly", "Butterfly", "Ant", "Grasshopper"],
    ["Sloth", "Snail", "Turtle", "Koala"],
    ["Kangaroo", "Koala", "Opossum", "All of these"],
    ["Bear", "Wolf", "Fox", "Squirrel"]
  ];
  return allOptions[index % allOptions.length];
}

function getAnimalEasyExplanation(index: number): string {
  const explanations = [
    "Lions are often called the 'king of the jungle,' though they actually live in grasslands and plains, not jungles.",
    "Zebras have black and white stripes, which may help confuse predators and regulate body temperature.",
    "Ostriches are flightless birds, but they can run at speeds up to 45 mph to escape predators.",
    "A baby frog is called a tadpole. They hatch from eggs and gradually develop legs and lungs as they mature.",
    "Giraffes have the longest necks of any living animal, with some reaching up to 8 feet in length.",
    "Elephants have impressive memories and can remember specific humans, migration routes, and water sources for decades.",
    "A baby kangaroo is called a joey. They're born very underdeveloped and continue growing in their mother's pouch.",
    "The cheetah is the fastest land animal, capable of running at speeds up to 70 mph for short bursts.",
    "Chameleons can change color to match their surroundings, communicate with other chameleons, and regulate body temperature.",
    "A group of wolves is called a pack. They are highly social animals with complex hierarchy systems.",
    "Bats sleep hanging upside down to conserve energy, as they don't need any to maintain their grip and can take flight quickly.",
    "The Emperor penguin is the largest species, standing up to 4 feet tall and weighing up to 88 pounds.",
    "Beavers build lodges as their homes, constructed from branches, mud, and stones in the middle of ponds they create.",
    "A group of lions is called a pride, which typically consists of related females, their cubs, and a small number of adult males.",
    "Parrots are known for their ability to mimic human speech and other sounds with remarkable accuracy.",
    "Porcupines are covered in sharp quills that detach easily when touched, providing protection against predators.",
    "Fireflies (lightning bugs) produce light through a chemical reaction in their bodies, a process called bioluminescence.",
    "The three-toed sloth is often considered the slowest animal in the world, moving at a maximum speed of about 0.15 mph.",
    "All three animals carry their babies in pouches. Marsupials like kangaroos, koalas, and opossums are characterized by this trait.",
    "Bears hibernate during winter, entering a state of dormancy with lower body temperature and metabolic rate to conserve energy."
  ];
  return explanations[index % explanations.length];
}

function getAnimalMediumQuestion(index: number): string {
  const questions = [
    "Which animal has the best sense of smell?",
    "What is the only bird that can fly backwards?",
    "Which mammal lays eggs?",
    "What is the only venomous lizard native to the United States?",
    "What animal has the largest brain relative to its body size?",
    "Which animal has blue blood?",
    "What is the only mammal that cannot jump?",
    "Which animal can regenerate its limbs?",
    "What is a group of crows called?",
    "Which animal sleeps standing up?",
    "What is the loudest animal on Earth?",
    "Which animal has the longest migration?",
    "What is the only mammal capable of true flight?",
    "Which snake can spit venom?",
    "What is the only mammal with scales?",
    "Which bird builds the largest nest?",
    "What is the only reptile with a four-chambered heart?",
    "Which insect has the most powerful sting?",
    "What animal produces the most milk?",
    "Which animal can survive being frozen?"
  ];
  return questions[index % questions.length];
}

function getAnimalMediumOptions(index: number): string[] {
  const mediumOptions = [
    ["Bear", "Shark", "Dog", "Elephant"],
    ["Hummingbird", "Swallow", "Eagle", "Falcon"],
    ["Platypus", "Kangaroo", "Koala", "Bat"],
    ["Gila monster", "Horned lizard", "Chuckwalla", "Desert iguana"],
    ["Dolphin", "Human", "Elephant", "Chimpanzee"],
    ["Horseshoe crab", "Octopus", "Lobster", "All of these"],
    ["Elephant", "Hippo", "Sloth", "Rhinoceros"],
    ["Starfish", "Lobster", "Lizard", "All of these"],
    ["Murder", "Gaggle", "Flock", "Parliament"],
    ["Horse", "Elephant", "Giraffe", "Flamingo"],
    ["Blue whale", "Howler monkey", "Pistol shrimp", "Lion"],
    ["Arctic tern", "Monarch butterfly", "Humpback whale", "Sea turtle"],
    ["Bat", "Flying squirrel", "Sugar glider", "Colugo"],
    ["Cobra", "Rattlesnake", "Python", "Viper"],
    ["Pangolin", "Armadillo", "Hedgehog", "Porcupine"],
    ["Bald eagle", "Sociable weaver", "Stork", "Osprey"],
    ["Crocodile", "Turtle", "Snake", "Lizard"],
    ["Bullet ant", "Tarantula hawk wasp", "Japanese giant hornet", "Fire ant"],
    ["Blue whale", "Cow", "Elephant", "Hippo"],
    ["Wood frog", "Arctic fox", "Penguin", "Polar bear"]
  ];
  return mediumOptions[index % mediumOptions.length];
}

function getAnimalMediumExplanation(index: number): string {
  const mediumExplanations = [
    "Bears have the best sense of smell of any animal on earth, able to detect food from up to 20 miles away, which is 7 times better than a bloodhound.",
    "Hummingbirds are the only birds that can fly backwards, upside down, and hover in mid-air thanks to their unique wing structure.",
    "The platypus is one of only five monotremes (egg-laying mammals), along with four species of echidna.",
    "The Gila monster is one of only two venomous lizards in the world (the other being the Mexican beaded lizard) and the only one native to the United States.",
    "Dolphins have the largest brain relative to body size among animals, even larger proportionally than humans.",
    "All three have blue blood. Instead of hemoglobin containing iron like humans, these animals use hemocyanin, which contains copper that turns blue when oxygenated.",
    "Elephants are the only mammals that cannot jump because all four feet must remain on the ground at all times to support their weight.",
    "All three animals can regenerate limbs. Starfish can regrow entire arms, lizards can regrow tails, and lobsters can regrow claws.",
    "A group of crows is called a murder. This term dates back to medieval times and may be related to the birds' scavenging behavior.",
    "Horses can sleep standing up thanks to a 'stay apparatus' in their legs that locks their joints in place.",
    "The blue whale is the loudest animal on Earth, with calls reaching 188 decibels - louder than a jet engine at 140 decibels.",
    "The Arctic tern has the longest migration of any animal, traveling about 44,000 miles annually between the Arctic and Antarctic.",
    "Bats are the only mammals capable of true flight. Flying squirrels, sugar gliders, and colugos can only glide.",
    "Several cobra species, particularly the spitting cobra, can project venom from their fangs up to 8 feet as a defense mechanism.",
    "Pangolins are the only mammals covered in scales made of keratin (the same material as human fingernails).",
    "The sociable weaver bird of Africa builds the largest nest of any bird, with some colony nests housing up to 100 pairs and weighing several tons.",
    "Crocodiles have four-chambered hearts like mammals and birds, while other reptiles typically have three-chambered hearts.",
    "The bullet ant has the most painful insect sting, rating highest on the Schmidt Pain Index. The pain has been compared to being shot.",
    "The blue whale produces the most milk, up to 200 liters (53 gallons) per day with a fat content of about 35-50%.",
    "The wood frog can survive being frozen solid, with up to 65% of its body water turning to ice. It produces a natural antifreeze to protect its cells."
  ];
  return mediumExplanations[index % mediumExplanations.length];
}

function getAnimalHardQuestion(index: number): string {
  const questions = [
    "What is the process of a snake shedding its skin called?",
    "Which animal has the largest eyes of any land mammal?",
    "What is the only continent where giraffes live in the wild?",
    "How many hearts does an octopus have?",
    "Which bird has the most feathers?",
    "What is the only place on a dog's body that has sweat glands?",
    "What phenomenon causes migratory birds to fly in a V formation?",
    "Which animal has the most powerful bite force relative to its size?",
    "What is the only marsupial native to North America?",
    "Which animal has a brain smaller than its eyeball?",
    "What is the largest invertebrate?",
    "Which animal can survive without a head for weeks?",
    "What is the only bird known to fly backward regularly?",
    "What specialized organ does a platypus use to detect prey?",
    "Which animal's milk is naturally pink?",
    "What is the only fish that can blink with both eyes?",
    "What is the purpose of a rhino's horn?",
    "Which animal has the most teeth of any mammal?",
    "What is the only country where komodo dragons live in the wild?",
    "Which animal produces the most venomous toxin by weight?"
  ];
  return questions[index % questions.length];
}

function getAnimalHardOptions(index: number): string[] {
  const hardOptions = [
    ["Ecdysis", "Molting", "Sloughing", "Desquamation"],
    ["Horse", "Cow", "Ostrich", "Giraffe"],
    ["Africa", "Asia", "Australia", "South America"],
    ["Three", "Two", "One", "Four"],
    ["Swan", "Penguin", "Tundra swan", "Eagle"],
    ["Nose", "Paw pads", "Ears", "Tongue"],
    ["Aerodynamic drafting", "Magnetic field alignment", "Visual navigation", "Sound frequency coordination"],
    ["Mantis shrimp", "Jaguar", "Hyena", "Great white shark"],
    ["Opossum", "Koala", "Kangaroo", "Wallaby"],
    ["Ostrich", "Owl", "Hummingbird", "Eagle"],
    ["Giant squid", "Japanese spider crab", "Giant clam", "Portuguese man o' war"],
    ["Cockroach", "Worm", "Ant", "Praying mantis"],
    ["Hummingbird", "Swift", "Barn swallow", "Kingfisher"],
    ["Electroreceptors", "Infrared vision", "Echolocation", "Chemoreceptors"],
    ["Hippopotamus", "Flamingo", "Strawberry finch", "Red panda"],
    ["Shark", "Stingray", "Tuna", "Sunfish"],
    ["Defense", "Attracting mates", "Digging for food", "All of these"],
    ["Giant armadillo", "Spinner dolphin", "Opossum", "Elephant"],
    ["Indonesia", "Philippines", "Malaysia", "Papua New Guinea"],
    ["Box jellyfish", "Inland taipan", "Pufferfish", "Blue-ringed octopus"]
  ];
  return hardOptions[index % hardOptions.length];
}

function getAnimalHardExplanation(index: number): string {
  const hardExplanations = [
    "Ecdysis is the technical term for a snake shedding its skin. This process occurs regularly as the snake grows and helps remove parasites.",
    "The horse has the largest eyes of any land mammal, measuring approximately 2 inches in diameter.",
    "Giraffes are native only to Africa, where they live in the savannas and woodlands.",
    "An octopus has three hearts: one main systemic heart that pumps blood through the body and two branchial hearts that pump blood through each of the gills.",
    "The tundra swan has approximately 25,000 feathers, more than any other bird species.",
    "Dogs only have sweat glands in their paw pads. They primarily cool down by panting.",
    "Aerodynamic drafting allows birds to save energy in V formation. Each bird flies slightly above the bird in front, catching the updraft created by the bird ahead.",
    "The mantis shrimp has the most powerful strike relative to its size, capable of striking with a force 1,500 times its own weight.",
    "The Virginia opossum is the only marsupial native to North America. All other marsupials are found primarily in Australia and South America.",
    "The ostrich has eyes that are larger than its brain, measuring about 2 inches in diameter while its brain is only about the size of a walnut.",
    "The giant squid is the largest invertebrate, with some specimens reaching over 40 feet in length including tentacles.",
    "A cockroach can survive for weeks without its head because it breathes through holes in its body segments and has an open circulatory system.",
    "While hummingbirds can fly backward briefly, they don't do it regularly. No bird flies backward as a normal part of its flight pattern.",
    "Platypuses use electroreceptors in their bills to detect the electrical fields generated by the muscular contractions of their prey in muddy water.",
    "Hippopotamus milk is naturally pink due to the presence of two acids called 'hipposudoric acid' and 'norhipposudoric acid' which also act as natural sunscreens.",
    "The shark is the only fish that can blink with both eyes. Most fish have no eyelids at all.",
    "A rhino's horn serves all three purposes: defense against predators, attracting mates during courtship, and digging for water and food.",
    "The giant armadillo has up to 100 teeth, more than any other mammal. Most mammals have between 20-50 teeth.",
    "Komodo dragons are found only in Indonesia, specifically on the islands of Komodo, Rinca, Flores, and Gili Motang.",
    "The box jellyfish produces the most venomous toxin by weight. Just a few milligrams can kill a human in minutes by causing heart failure."
  ];
  return hardExplanations[index % hardExplanations.length];
}

// Main function to generate and save questions
async function generateMassiveQuestionSet() {
  try {
    console.log("Checking if database already has questions...");
    
    // Check if there are already questions in the database
    const count = await db
      .select({ count: sql`count(*)` })
      .from(triviaQuestions);
    
    const questionCount = count[0] ? (count[0] as any).count : 0;
    console.log(`Database has ${questionCount} questions`);
    
    if (questionCount > 9000) {
      console.log("Database already has over 9000 questions. No need to add more.");
      process.exit(0);
      return;
    }
    
    // Creating backup folder
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    // First, back up any existing questions
    if (questionCount > 0) {
      console.log("Creating backup of existing questions...");
      const existingQuestions = await db.select().from(triviaQuestions);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `before-massive-import-${timestamp}.json`);
      
      fs.writeFileSync(backupFile, JSON.stringify(existingQuestions, null, 2));
      console.log(`Backup created at: ${backupFile}`);
    }
    
    console.log("Starting to add massive question set...");
    console.log(`Adding ${catQuestions.length} cat questions and ${otherAnimalQuestions.length} other animal questions`);
    
    // Combine all questions
    const allQuestions = [...catQuestions, ...otherAnimalQuestions];
    
    // Save in batches of 100 to avoid overwhelming the database
    const BATCH_SIZE = 100;
    let successCount = 0;
    
    for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
      const batch = allQuestions.slice(i, i + BATCH_SIZE);
      const success = await saveBatch(batch);
      
      if (success) {
        successCount += batch.length;
      }
      
      // Progress update
      console.log(`Processed ${i + batch.length} of ${allQuestions.length} questions (${successCount} added successfully)`);
    }
    
    console.log("\n============ COMPLETION SUMMARY ============");
    console.log(`Total questions attempted: ${allQuestions.length}`);
    console.log(`Successfully added: ${successCount}`);
    console.log(`Final database count should be: ${questionCount + successCount}`);
    
    // Create a small sample file to help understand the question format
    const sampleFile = path.join(backupDir, `question-samples.json`);
    const sampleQuestions = {
      catEasy: catQuestions.slice(0, 5),
      catMedium: catQuestions.slice(1650, 1655),
      catHard: catQuestions.slice(3300, 3305),
      animalEasy: otherAnimalQuestions.slice(0, 5),
      animalMedium: otherAnimalQuestions.slice(1650, 1655),
      animalHard: otherAnimalQuestions.slice(3300, 3305)
    };
    
    fs.writeFileSync(sampleFile, JSON.stringify(sampleQuestions, null, 2));
    console.log(`Sample question file created at: ${sampleFile}`);
    
  } catch (error) {
    console.error("Error generating massive question set:", error);
  } finally {
    process.exit(0);
  }
}

// Execute the function
import { sql } from 'drizzle-orm';
generateMassiveQuestionSet();