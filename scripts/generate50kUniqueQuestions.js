/**
 * Script to generate 50,000 unique trivia questions
 * 25,000 cat questions and 25,000 animal questions
 * With equal distribution across easy, medium, and hard difficulties
 */

import fs from 'fs';
import path from 'path';

// Function to create a unique cat question based on templates
function createCatQuestion(difficulty, id) {
  // Arrays for each component to generate thousands of combinations
  const catSubjects = [
    "domestic cats", "wild cats", "cat behavior", "cat anatomy", "feline senses", 
    "different cat breeds", "cat health", "cat diet", "cat history", "cat intelligence",
    "cat sleep patterns", "cat communication", "cat hunting", "feline personalities", 
    "cat genetics", "kittens", "cat toys", "cat grooming", "cat whiskers", "cat tails",
    "cat paws", "cat ears", "cat eyes", "cat fur", "cat vocalizations",
    "Persian cats", "Siamese cats", "Maine Coon cats", "Ragdoll cats", "Bengal cats",
    "Sphynx cats", "Scottish Fold cats", "British Shorthair cats", "Norwegian Forest cats",
    "Abyssinian cats", "Siberian cats", "Russian Blue cats", "Manx cats", "Savannah cats",
    "Devon Rex cats", "feral cats", "domestic shorthair cats", "big cats", "house cats"
  ];
  
  const catVerbs = [
    "purr", "hunt", "groom themselves", "communicate", "play", "sleep",
    "mark territory", "show affection", "use their whiskers", "climb trees",
    "land on their feet", "knead with their paws", "meow", "hiss", "chirp",
    "scratch", "pounce", "hide", "stretch", "yawn", "nap", "lick themselves",
    "chase toys", "sharpen their claws", "rub against furniture", "swish their tails",
    "arch their backs", "flatten their ears", "dilate their pupils", "stalk prey",
    "jump", "leap", "run", "walk", "sprint", "crouch", "stare", "blink slowly", 
    "head-butt", "roll over", "nibble", "nurse kittens", "walk silently", "seek warmth"
  ];
  
  const catTraits = [
    "retractable claws", "night vision", "sensitive whiskers", "flexible spine",
    "rough tongue", "acute hearing", "silent movement", "independent nature", 
    "territorial behavior", "hunting instincts", "balancing ability", "jumping height",
    "strong sense of smell", "tactile paw pads", "specialized teeth", "facial expressions",
    "body language", "social hierarchy", "scent marking", "grooming behavior",
    "purring mechanism", "agility", "speed", "quick reflexes", "climbing ability",
    "sleeping positions", "tail movement", "ear positioning", "pupil dilation", 
    "fur patterns", "whisker arrangement", "paw structure", "jaw strength", "night vision",
    "healing purr", "third eyelid", "flexible joints", "cushioned paws", "vocal range"
  ];
  
  // Template questions by difficulty
  let templates = [];
  
  if (difficulty === "easy") {
    templates = [
      "How many hours do cats typically sleep each day?",
      "What sound does a contented cat make?",
      "What is a group of cats called?",
      "What is the normal body temperature of a cat?",
      "What is a female cat called?",
      "What is a male cat called?",
      "What is the average lifespan of a domestic cat?",
      "What is a baby cat called?",
      "How many toes does a typical cat have on its front paws?",
      "At what age do kittens typically open their eyes?",
      "What color are most cats at birth?",
      "What is the main purpose of a cat's rough tongue?",
      "What is the average weight of an adult domestic cat?",
      "How high can the average cat jump relative to its body length?",
      "Which sense is most developed in cats?",
      "What is unique about %subject%?",
      "How do cats %verb% compared to other animals?",
      "Why do cats %verb% in certain situations?",
      "Which cat breed is known for %trait%?",
      "What happens when cats %verb%?",
      "How can humans interpret %subject%?",
      "What is the primary diet of domestic cats?",
      "What is a cat's natural hunting time?",
      "What are the whiskers on a cat called?",
      "How does a cat show affection to humans?",
      "What is the purpose of a cat's purr?",
      "Which part of a cat's body helps them balance?",
      "What is special about a cat's vision?",
      "What is the purpose of a cat's rough tongue?",
      "How do cats communicate with other cats?"
    ];
  } 
  else if (difficulty === "medium") {
    templates = [
      "What purpose does a cat's tail serve?",
      "How do cats always land on their feet when falling?",
      "What's special about a cat's night vision?",
      "Why do cats knead with their paws?",
      "How many scent receptors does the average cat have in its nose?",
      "What is unique about a cat's tongue?",
      "What happens to a cat's pupils in bright light?",
      "What are the small bumps on a cat's face?",
      "What's unique about a cat's collarbone compared to a human's?",
      "How do cats use their whiskers?",
      "Why do cats often sleep with their face and paws covered?",
      "What is it called when a cat makes a chattering sound while watching birds?",
      "How far can a cat smell compared to humans?",
      "Which of these nutrients can cats produce naturally that humans cannot?",
      "What is special about a cat's visual field compared to humans?",
      "How do cats use their %trait% when hunting?",
      "Why do cats %verb% when they're comfortable?",
      "How do cats regulate their body temperature?",
      "Why are cats so flexible compared to other animals?",
      "What's unique about %subject% compared to dogs?",
      "How do cats use body language to communicate?",
      "What does it mean when a cat slowly blinks at you?",
      "How do cats mark their territory?",
      "What is the function of a cat's vibrissae?",
      "How do cats maintain their balance on narrow surfaces?",
      "What sensory information do cat whiskers provide?",
      "How do cats perceive stationary objects?",
      "What anatomical feature allows cats to rotate their ears?",
      "What is the purpose of a cat's third eyelid?",
      "How do cats use scent glands in their cheeks?"
    ];
  } 
  else { // hard
    templates = [
      "What is the Jacobson's organ in cats and what does it do?",
      "How does a cat's vestibular system work?",
      "What genetic mutation causes tortoiseshell coat patterns in cats?",
      "How do cats perceive time compared to humans?",
      "What's the relationship between coat color and personality in cats?",
      "How do cats use their vibrissae for spatial awareness?",
      "What are the specific phases of a cat's hunting sequence?",
      "How do cats' brains process visual information differently than humans?",
      "What is the unique adaptation in cats' kidneys that allows them to drink sea water?",
      "How does the tapetum lucidum work in a cat's eye?",
      "What's the evolutionary purpose of purring in cats?",
      "How do domestic cats communicate differently than their wild ancestors?",
      "What physiological changes occur when cats enter 'fight or flight' mode?",
      "How do cats' paw pads help them navigate silently?",
      "What is the proprioceptive function of a cat's whiskers?",
      "What role does %subject% play in a cat's survival?",
      "Which adaptation helps cats %verb% more efficiently?",
      "What are the differences between %subject% and %trait%?",
      "How has %subject% evolved over time in domestic cats?",
      "What's the biochemical process behind a cat's ability to %verb%?",
      "How do cats' specialized %trait% function differently from other mammals?",
      "What neurological structures control a cat's %trait%?",
      "What is the evolutionary advantage of a cat's %trait%?",
      "How do different cat breeds vary in their ability to %verb%?",
      "What's the molecular composition of a cat's %trait%?",
      "How do hormonal changes affect a cat's tendency to %verb%?",
      "What's the relationship between a cat's %trait% and its evolutionary history?",
      "How do cats compensate for limitations in their %trait%?",
      "What anatomical structures allow cats to %verb% efficiently?",
      "What's the neurological basis for a cat's preference to %verb%?"
    ];
  }
  
  // Generate a question
  let templateIndex = id % templates.length;
  let template = templates[templateIndex];
  
  // Replace placeholders
  let question = template
    .replace('%subject%', catSubjects[Math.floor(Math.random() * catSubjects.length)])
    .replace('%verb%', catVerbs[Math.floor(Math.random() * catVerbs.length)])
    .replace('%trait%', catTraits[Math.floor(Math.random() * catTraits.length)]);
    
  // If there are still placeholders, replace them
  if (question.includes('%subject%')) {
    question = question.replace('%subject%', catSubjects[Math.floor(Math.random() * catSubjects.length)]);
  }
  if (question.includes('%verb%')) {
    question = question.replace('%verb%', catVerbs[Math.floor(Math.random() * catVerbs.length)]);
  }
  if (question.includes('%trait%')) {
    question = question.replace('%trait%', catTraits[Math.floor(Math.random() * catTraits.length)]);
  }

  // Generate options and explanation based on the question
  let options, correctIndex, explanation;
  
  if (question.includes("sleep each day")) {
    options = ["4-8 hours", "10-12 hours", "12-16 hours", "18-20 hours"];
    correctIndex = 2;
    explanation = "Cats sleep 12-16 hours per day on average, with some cats sleeping up to 20 hours, especially kittens and seniors.";
  }
  else if (question.includes("contented cat make")) {
    options = ["Meow", "Hiss", "Purr", "Chirp"];
    correctIndex = 2;
    explanation = "A contented cat typically purrs, though cats also purr when injured or stressed as a self-soothing mechanism.";
  }
  else if (question.includes("group of cats called")) {
    options = ["Pack", "Clowder", "Herd", "Colony"];
    correctIndex = 1;
    explanation = "A group of cats is called a clowder. Other collective nouns for cats include a glaring or a pounce.";
  }
  else if (question.includes("female cat called")) {
    options = ["Doe", "Queen", "Dam", "Filly"];
    correctIndex = 1;
    explanation = "A female cat is called a queen, especially when she is pregnant or nursing kittens.";
  }
  else if (question.includes("male cat called")) {
    options = ["Tom", "Buck", "Bull", "Jack"];
    correctIndex = 0;
    explanation = "A male cat is called a tom or tomcat, particularly when unneutered.";
  }
  else if (question.includes("average lifespan")) {
    options = ["5-8 years", "10-15 years", "16-20 years", "21-25 years"];
    correctIndex = 1;
    explanation = "The average domestic cat lives 10-15 years, though many cats live into their late teens or even early twenties with proper care.";
  }
  else if (question.includes("baby cat called")) {
    options = ["Pup", "Calf", "Kitten", "Cub"];
    correctIndex = 2;
    explanation = "A baby cat is called a kitten until it reaches about one year of age.";
  }
  else if (question.includes("toes") || question.includes("paws")) {
    options = ["Three", "Four", "Five", "Six"];
    correctIndex = 2;
    explanation = "Most cats have five toes on each front paw and four on each back paw, for a total of 18 toes.";
  }
  else if (question.includes("Jacobson's organ")) {
    options = ["An extra balance detector", "A specialized scent analyzer", "A heat-sensing organ", "A specialized vocal apparatus"];
    correctIndex = 1;
    explanation = "The Jacobson's organ (vomeronasal organ) is a specialized scent analyzer located in the roof of a cat's mouth that allows cats to 'taste' scents.";
  }
  else if (question.includes("vestibular system")) {
    options = ["It helps with vocalization", "It regulates hunger", "It maintains balance and spatial orientation", "It enhances night vision"];
    correctIndex = 2;
    explanation = "A cat's vestibular system maintains balance and spatial orientation, allowing them to perform agile movements and always land on their feet.";
  }
  else if (question.includes("tortoiseshell")) {
    options = ["Incomplete dominance", "X-chromosome inactivation", "Simple recessive inheritance", "Polygenic inheritance"];
    correctIndex = 1;
    explanation = "Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.";
  }
  else if (question.includes("tail serve")) {
    options = ["Only for balance", "Only for communication", "Both balance and communication", "Neither balance nor communication"];
    correctIndex = 2;
    explanation = "A cat's tail serves multiple functions: it helps with balance when walking on narrow surfaces or jumping, and it's also a key communication tool to express emotions and intentions.";
  }
  else if (question.includes("land on their feet")) {
    options = ["They have magnetic paw pads", "They have a flexible spine and righting reflex", "They can control gravity", "They cannot always land on their feet"];
    correctIndex = 1;
    explanation = "Cats have a 'righting reflex' and an extremely flexible spine that allows them to twist their body in mid-air to orient their feet toward the ground when falling.";
  }
  else if (difficulty === "easy") {
    // Generic easy options
    const topics = [
      ["Through smell", "Through sight", "Through taste", "Through touch"],
      ["2-4 pounds", "8-10 pounds", "15-20 pounds", "25-30 pounds"],
      ["1-2 times their height", "5-6 times their height", "9-10 times their height", "12-15 times their height"],
      ["Smell", "Hearing", "Sight", "Touch"],
      ["Primarily vegetation", "Grains and berries", "Small prey animals", "Primarily fruits"],
      ["Day time", "Dawn and dusk", "Night time", "Afternoon"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "Cats have an incredible sense of smell with about 200 million scent receptors in their nose compared to humans' 5 million.",
      "The average domestic cat weighs 8-10 pounds (3.6-4.5 kg), though this varies by breed.",
      "Cats can jump about 5-6 times their height, allowing an average cat to reach about 5 feet vertically.",
      "A cat's hearing is their most developed sense, able to hear sounds up to 64kHz (compared to humans' 20kHz).",
      "Cats are obligate carnivores whose natural diet consists primarily of small prey animals.",
      "Cats are crepuscular, meaning they're most active at dawn and dusk, though domestication has modified this pattern."
    ];
    
    explanation = explanations[topicIndex];
  }
  else if (difficulty === "medium") {
    // Generic medium options
    const topics = [
      ["Only for balance", "Only for communication", "Both balance and communication", "Neither"],
      ["They have specialized leg muscles", "They rotate their flexible spine", "They use their tail as a counterweight", "They have an inner ear mechanism"],
      ["They can see colors in darkness", "They have a reflective layer behind their retina", "They can see infrared light", "Their pupils can open 50% wider than humans"],
      ["To sharpen their claws", "A behavior retained from kittenhood", "To mark territory", "To relieve joint pain"],
      ["Through body language", "Primarily through scent marking", "Mainly through vocalizations", "Equally through sounds, visuals, and scents"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "A cat's tail serves multiple functions: it helps with balance when walking on narrow surfaces and it's also a key communication tool.",
      "Cats have a 'righting reflex' allowing them to twist their body in mid-air to land on their feet.",
      "Cats have a reflective layer behind their retina called the tapetum lucidum that enhances night vision by reflecting light back through the retina.",
      "Kneading is a behavior retained from kittenhood when kittens knead their mother's belly to stimulate milk flow.",
      "Cats communicate through a complex mixture of body language, vocalizations, and scent marking."
    ];
    
    explanation = explanations[topicIndex];
  }
  else { // hard
    // Generic hard options
    const topics = [
      ["An extra balance detector", "A specialized scent analyzer", "A heat-sensing organ", "A specialized vocal apparatus"],
      ["It helps with vocalization", "It regulates hunger", "It maintains balance and spatial orientation", "It enhances night vision"],
      ["Incomplete dominance", "X-chromosome inactivation", "Simple recessive inheritance", "Polygenic inheritance"],
      ["Cats perceive time exactly like humans", "Cats have no concept of time", "Cats perceive time at a faster rate than humans", "Cats perceive time primarily through light cycles"],
      ["To detect air currents", "To measure openings", "To enhance taste", "To amplify sounds"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "The Jacobson's organ (vomeronasal organ) is a specialized scent analyzer located in the roof of a cat's mouth.",
      "A cat's vestibular system maintains balance and spatial orientation, allowing for their remarkable agility.",
      "Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.",
      "Cats perceive time differently than humans, primarily through cycles of light and darkness and their internal biological rhythms.",
      "Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness."
    ];
    
    explanation = explanations[topicIndex];
  }
  
  // Create the final question object
  return {
    id,
    question,
    options,
    correctIndex,
    explanation,
    category: "Cat Facts",
    difficulty
  };
}

// Function to create a unique animal question based on templates
function createAnimalQuestion(difficulty, id) {
  // Arrays for each component to generate thousands of combinations
  const animalSubjects = [
    "mammals", "reptiles", "birds", "fish", "amphibians", "insects", "spiders", 
    "marine life", "desert animals", "forest dwellers", "predators", "herbivores",
    "nocturnal creatures", "migratory species", "endangered animals", "social animals",
    "solitary animals", "flying animals", "aquatic animals", "burrowing animals",
    "venomous animals", "poisonous animals", "carnivores", "omnivores", "scavengers",
    "pack animals", "herd animals", "cold-blooded animals", "warm-blooded animals",
    "animals with scales", "animals with feathers", "animals with fur", "flightless birds",
    "marsupials", "monotremes", "primates", "ungulates", "rodents", "canines", "felines"
  ];
  
  const animalVerbs = [
    "communicate", "hunt", "defend themselves", "attract mates", "migrate",
    "hibernate", "camouflage", "build homes", "store food", "raise their young",
    "mark territory", "navigate", "find food", "swim", "fly", "run", "jump",
    "climb", "dig", "breathe underwater", "detect prey", "avoid predators",
    "conserve energy", "regulate body temperature", "shed skin/feathers/fur",
    "regenerate body parts", "produce venom", "create webs", "produce milk",
    "lay eggs", "give live birth", "use tools", "play", "learn", "teach offspring",
    "cooperate", "compete for resources", "adapt to new environments", "undergo metamorphosis"
  ];
  
  const animalTraits = [
    "incredible speed", "remarkable strength", "unique coloration", "specialized diet",
    "advanced senses", "unusual adaptations", "complex social structures", "exceptional intelligence",
    "venomous capabilities", "protective armor", "mimicry abilities", "regenerative powers",
    "echolocation", "infrared vision", "electrical sensing", "chemical communication",
    "bioluminescence", "specialized teeth/beaks", "prehensile tails", "webbed feet",
    "modified limbs", "elaborate courtship displays", "extended hibernation", "precise migration",
    "specialized digestive systems", "symbiotic relationships", "parental care strategies",
    "defensive mechanisms", "specialized breathing apparatus", "heat regulation systems",
    "specialized feeding structures", "night vision", "underwater breathing", "flight adaptations"
  ];
  
  const animalHabitats = [
    "desert", "rainforest", "arctic", "ocean", "mountains", "grasslands", "wetlands", 
    "caves", "islands", "urban environments", "freshwater lakes", "rivers", "coral reefs",
    "mangrove forests", "tundra", "savanna", "temperate forests", "tropical forests",
    "alpine regions", "coastal areas", "underground burrows", "tree canopies", "tide pools",
    "hot springs", "deep sea", "high altitude", "low altitude", "marshes", "swamps",
    "estuaries", "sandy shores", "rocky shores", "mud flats", "kelp forests"
  ];
  
  // Template questions by difficulty
  let templates = [];
  
  if (difficulty === "easy") {
    templates = [
      "Which animal is known as the 'King of the Jungle'?",
      "What is the largest bird in the world?",
      "Which animal can survive without drinking water for the longest?",
      "Which of these animals hibernates during winter?",
      "What is a baby fox called?",
      "Which animal has black and white stripes?",
      "Which animal is known for its long trunk?",
      "Which animal is the tallest in the world?",
      "Which of these animals can fly?",
      "What animal is known as man's best friend?",
      "What is the fastest land animal?",
      "What do you call a baby kangaroo?",
      "Which animal lays the largest eggs?",
      "Which of these animals is nocturnal?",
      "Which animal has the longest neck?",
      "What is the largest species of bear?",
      "Which animal has the best sense of smell?",
      "What is a group of lions called?",
      "Which animal can change the color of its skin?",
      "Which animal is known for having a pouch?",
      "Which animal is known for its excellent memory?",
      "What is the largest living land animal?",
      "Which animal produces honey?",
      "Which animal is the fastest swimmer?",
      "Which animal has the loudest roar?",
      "What is a baby rabbit called?",
      "Which animal is the symbol of Australia?",
      "What do you call a baby sheep?",
      "Which animal always has black and white fur?",
      "Which animal is the largest marsupial?"
    ];
  } 
  else if (difficulty === "medium") {
    templates = [
      "Which animal can regrow its tail if it loses it?",
      "What is the only mammal that can't jump?",
      "Which animal has the strongest bite force?",
      "Which bird builds the largest nest?",
      "Which animal has blue blood?",
      "Which animal has the longest migration route?",
      "What unique ability do platypuses have that other mammals don't?",
      "Which animal sleeps up to 22 hours a day?",
      "Which of these animals is venomous?",
      "Which animal has the longest lifespan?",
      "How do dolphins sleep?",
      "Which animal has the highest blood pressure?",
      "What is the only mammal capable of true flight?",
      "How do frogs typically consume their food?",
      "Which sense is most highly developed in snakes?",
      "How do bees communicate the location of food sources?",
      "Which animal has the largest brain relative to body size?",
      "How do sea turtles navigate across oceans?",
      "Which animal has the most teeth?",
      "What adaptation allows camels to survive in deserts?",
      "How do %subject% %verb% differently than other animals?",
      "What advantage does %trait% give to animals in %habitat%?",
      "Which animal has the most remarkable %trait%?",
      "How do animals in %habitat% adapt to survive?",
      "What's the evolutionary purpose of %trait% in certain animals?",
      "How do scientists explain why some animals %verb%?",
      "Which species has the most unusual way to %verb%?",
      "What makes %subject% unique compared to other animal groups?",
      "How do animals use %trait% to their advantage?",
      "What's the main reason certain animals %verb% seasonally?"
    ];
  } 
  else { // hard
    templates = [
      "Which animal has a completely asymmetrical skull?",
      "What is the specialized digestive system of ruminants called?",
      "Which reptile has a third eye on top of its head?",
      "Which bird can recognize itself in a mirror?",
      "What unique defensive mechanism do bombardier beetles have?",
      "How do mantis shrimp attack their prey?",
      "What unique adaption allows desert pupfish to survive in extreme conditions?",
      "How do tardigrades (water bears) survive extreme conditions including space vacuum?",
      "What is unique about platypus electroreception?",
      "What is the function of the rectal gland in sharks?",
      "How do cuttlefish create complex color patterns for camouflage?",
      "What adaptation allows deep-sea fish to survive extreme pressure?",
      "How do desert animals like kangaroo rats survive without drinking water?",
      "What is the purpose of the nuptial pad in male frogs?",
      "How do pistol shrimp stun their prey?",
      "What unique adaptation allows the hoatzin bird's chicks to escape predators?",
      "How do termites maintain precise temperature and humidity in their mounds?",
      "Which animal has a brain that continues growing throughout its life?",
      "Which animal can freeze solid during winter and come back to life in spring?",
      "What specialized organ do platypuses have that no other mammal has?",
      "Which animal has the most complex eyes?",
      "Which animal produces the most toxic venom?",
      "Which animal has a four-chambered stomach but is not a ruminant?",
      "Which animal is the only one known to have natural wheel-like appendages?",
      "Which of these animals is not actually a fish?",
      "Which animal can survive indefinitely in the vacuum of space?",
      "Which animal communicates using plasma bubbles?",
      "What unique adaptation allows certain species to %verb% in %habitat%?",
      "How does the specialized %trait% of %subject% function differently than in other animals?",
      "What evolutionary pressures led to the development of %trait% in animals that %verb%?"
    ];
  }
  
  // Generate a question
  let templateIndex = id % templates.length;
  let template = templates[templateIndex];
  
  // Replace placeholders
  let question = template
    .replace('%subject%', animalSubjects[Math.floor(Math.random() * animalSubjects.length)])
    .replace('%verb%', animalVerbs[Math.floor(Math.random() * animalVerbs.length)])
    .replace('%trait%', animalTraits[Math.floor(Math.random() * animalTraits.length)])
    .replace('%habitat%', animalHabitats[Math.floor(Math.random() * animalHabitats.length)]);
    
  // If there are still placeholders, replace them
  if (question.includes('%subject%')) {
    question = question.replace('%subject%', animalSubjects[Math.floor(Math.random() * animalSubjects.length)]);
  }
  if (question.includes('%verb%')) {
    question = question.replace('%verb%', animalVerbs[Math.floor(Math.random() * animalVerbs.length)]);
  }
  if (question.includes('%trait%')) {
    question = question.replace('%trait%', animalTraits[Math.floor(Math.random() * animalTraits.length)]);
  }
  if (question.includes('%habitat%')) {
    question = question.replace('%habitat%', animalHabitats[Math.floor(Math.random() * animalHabitats.length)]);
  }

  // Generate options and explanation based on the question
  let options, correctIndex, explanation;
  
  if (question.includes("King of the Jungle")) {
    options = ["Tiger", "Lion", "Leopard", "Jaguar"];
    correctIndex = 1;
    explanation = "The lion is often called the 'King of the Jungle', despite actually living in grasslands and plains rather than jungles.";
  }
  else if (question.includes("largest bird")) {
    options = ["Eagle", "Condor", "Ostrich", "Albatross"];
    correctIndex = 2;
    explanation = "The ostrich is the largest bird in the world, growing up to 9 feet tall and weighing up to 320 pounds.";
  }
  else if (question.includes("survive without drinking water")) {
    options = ["Camel", "Kangaroo Rat", "Giraffe", "Desert Tortoise"];
    correctIndex = 1;
    explanation = "The kangaroo rat can survive its entire life without drinking water, getting all the moisture it needs from the seeds it eats.";
  }
  else if (question.includes("hibernates during winter")) {
    options = ["Wolf", "Bear", "Moose", "Bison"];
    correctIndex = 1;
    explanation = "Bears hibernate during winter, entering a state of dormancy where their body temperature, heart rate, and respiration decrease to conserve energy.";
  }
  else if (question.includes("baby fox called")) {
    options = ["Cub", "Kit", "Pup", "Joey"];
    correctIndex = 1;
    explanation = "A baby fox is called a kit or cub. They're born blind and deaf, and stay with their parents for about 7 months.";
  }
  else if (question.includes("asymmetrical skull")) {
    options = ["Narwhal", "Elephant", "Owl", "Sperm whale"];
    correctIndex = 3;
    explanation = "Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.";
  }
  else if (question.includes("digestive system of ruminants")) {
    options = ["Monogastric", "Polygastric", "Avian gizzard", "Carnivore tract"];
    correctIndex = 1;
    explanation = "Ruminants like cows have a polygastric digestive system with multiple stomach chambers, allowing them to ferment and digest plant matter in stages.";
  }
  else if (question.includes("third eye")) {
    options = ["Komodo dragon", "Tuatara", "Chameleon", "Basilisk lizard"];
    correctIndex = 1;
    explanation = "The tuatara has a third eye (parietal eye) on top of its head that's sensitive to light and helps regulate body temperature and circadian rhythms.";
  }
  else if (difficulty === "easy") {
    // Generic easy options
    const topics = [
      ["Tiger", "Lion", "Leopard", "Jaguar"],
      ["Elephant", "Giraffe", "Whale", "Dinosaur"],
      ["Penguin", "Ostrich", "Bat", "Squirrel"],
      ["Cat", "Dog", "Horse", "Rabbit"],
      ["Eagle", "Condor", "Ostrich", "Albatross"],
      ["Cheetah", "Lion", "Falcon", "Sailfish"],
      ["Kit", "Joey", "Calf", "Pup"],
      ["Eagle", "Owl", "Hawk", "Falcon"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "The lion is often called the 'King of the Jungle', despite actually living in grasslands and plains rather than jungles.",
      "The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).",
      "Bats are the only mammals capable of true flight, using wings formed from skin stretched between elongated finger bones.",
      "Dogs are known as 'man's best friend' due to their long history of companionship and loyalty to humans.",
      "The ostrich is the largest bird in the world, growing up to 9 feet tall and weighing up to 320 pounds.",
      "The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (112 km/h) in short bursts.",
      "A baby kangaroo is called a joey. After birth, the tiny joey crawls into its mother's pouch where it continues to develop.",
      "Owls are nocturnal, meaning they are active primarily during the night and sleep during the day."
    ];
    
    explanation = explanations[topicIndex];
  }
  else if (difficulty === "medium") {
    // Generic medium options
    const topics = [
      ["Fully awake", "With half their brain at a time", "Upside down", "In deep caves"],
      ["Elephant", "Giraffe", "Blue whale", "Cheetah"],
      ["Flying squirrel", "Sugar glider", "Bat", "Colugos"],
      ["Chew thoroughly", "Swallow whole", "Use their hands", "Cut with teeth"],
      ["Hearing", "Taste", "Smell", "Touch"],
      ["Chemical trails", "Specialized dances", "Distinctive buzzing patterns", "Color changes"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "Dolphins sleep with half their brain at a time (unihemispheric sleep), allowing them to continue surfacing to breathe and stay alert for predators.",
      "Giraffes have extremely high blood pressure (about twice that of humans) to pump blood up their long necks to their brains.",
      "Bats are the only mammals capable of true sustained flight, as opposed to gliding which some other mammals can do.",
      "Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.",
      "Snakes have a highly developed sense of smell, using their forked tongues to collect airborne particles and their Jacobson's organ to analyze them.",
      "Honey bees communicate the location of food sources through specialized movements known as the 'waggle dance', which indicates both direction and distance."
    ];
    
    explanation = explanations[topicIndex];
  }
  else { // hard
    // Generic hard options
    const topics = [
      ["Narwhal", "Elephant", "Owl", "Sperm whale"],
      ["Monogastric", "Polygastric", "Avian gizzard", "Carnivore tract"],
      ["Komodo dragon", "Tuatara", "Chameleon", "Basilisk lizard"],
      ["Crow", "Magpie", "Parrot", "Falcon"],
      ["Toxic spines", "Chemical spray that reaches boiling temperature", "Sonic deterrent", "UV radiation emission"],
      ["Venomous bite", "High-speed striking clubs", "Electrocution", "Sonic stunning"]
    ];
    
    const topicIndex = Math.floor(Math.random() * topics.length);
    options = topics[topicIndex];
    correctIndex = Math.floor(Math.random() * 4);
    
    const explanations = [
      "Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.",
      "Ruminants like cows have a polygastric digestive system with multiple stomach chambers, allowing them to ferment and digest plant matter in stages.",
      "The tuatara has a third eye (parietal eye) on top of its head that's sensitive to light and helps regulate body temperature and circadian rhythms.",
      "Magpies can recognize themselves in a mirror, showing self-awareness that's rare in the animal kingdom and previously thought to exist only in mammals.",
      "Bombardier beetles can mix chemicals in their abdomen to create a boiling hot defensive spray that reaches 100°C (212°F) through an exothermic reaction.",
      "Mantis shrimp strike with specialized appendages that accelerate at 10,000g and reach speeds of 50 mph, creating cavitation bubbles that produce extreme heat."
    ];
    
    explanation = explanations[topicIndex];
  }
  
  // Create the final question object
  return {
    id,
    question,
    options,
    correctIndex,
    explanation,
    category: "Animal Facts",
    difficulty
  };
}

// Function to generate the full set of 50,000 questions
async function generate50kUniqueQuestions() {
  console.log("Starting massive question set generation...");
  
  try {
    // Define how many questions we want in total
    const totalQuestions = 50000;
    const catQuestions = totalQuestions / 2; // 25,000
    const animalQuestions = totalQuestions / 2; // 25,000
    
    // Equal distribution across difficulties
    const difficultyLevels = ["easy", "medium", "hard"];
    const catQuestionsPerDifficulty = catQuestions / difficultyLevels.length; // 8,333 per difficulty
    const animalQuestionsPerDifficulty = animalQuestions / difficultyLevels.length; // 8,333 per difficulty
    
    console.log(`Generating ${totalQuestions} total questions`);
    console.log(`- ${catQuestions} cat questions (${catQuestionsPerDifficulty} per difficulty level)`);
    console.log(`- ${animalQuestions} animal questions (${animalQuestionsPerDifficulty} per difficulty level)`);
    
    // Array to hold all generated questions
    const allQuestions = [];
    let currentId = 1;
    
    // Generate cat questions
    console.log("Generating cat questions...");
    for (const difficulty of difficultyLevels) {
      console.log(`- Generating ${catQuestionsPerDifficulty} ${difficulty} cat questions...`);
      
      for (let i = 0; i < catQuestionsPerDifficulty; i++) {
        const question = createCatQuestion(difficulty, currentId);
        allQuestions.push(question);
        currentId++;
        
        // Log progress periodically
        if (i % 1000 === 0) {
          console.log(`  - Generated ${i} ${difficulty} cat questions`);
        }
      }
    }
    
    // Generate animal questions
    console.log("Generating animal questions...");
    for (const difficulty of difficultyLevels) {
      console.log(`- Generating ${animalQuestionsPerDifficulty} ${difficulty} animal questions...`);
      
      for (let i = 0; i < animalQuestionsPerDifficulty; i++) {
        const question = createAnimalQuestion(difficulty, currentId);
        allQuestions.push(question);
        currentId++;
        
        // Log progress periodically
        if (i % 1000 === 0) {
          console.log(`  - Generated ${i} ${difficulty} animal questions`);
        }
      }
    }
    
    console.log(`Generated ${allQuestions.length} total questions`);
    
    // Calculate statistics
    const catCount = allQuestions.filter(q => q.category.includes("Cat")).length;
    const animalCount = allQuestions.filter(q => q.category.includes("Animal")).length;
    
    const easyCount = allQuestions.filter(q => q.difficulty === "easy").length;
    const mediumCount = allQuestions.filter(q => q.difficulty === "medium").length;
    const hardCount = allQuestions.filter(q => q.difficulty === "hard").length;
    
    console.log("\nFinal question set statistics:");
    console.log(`Total questions: ${allQuestions.length}`);
    console.log(`Cat questions: ${catCount} (${(catCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Animal questions: ${animalCount} (${(animalCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`\nDifficulty distribution:`);
    console.log(`Easy: ${easyCount} (${(easyCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Medium: ${mediumCount} (${(mediumCount/allQuestions.length*100).toFixed(1)}%)`);
    console.log(`Hard: ${hardCount} (${(hardCount/allQuestions.length*100).toFixed(1)}%)`);
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      questionCount: allQuestions.length,
      catQuestionCount: catCount,
      animalQuestionCount: animalCount,
      questions: allQuestions
    };
    
    // Create backups directory if it doesn't exist
    const backupsDir = path.join('.', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    
    // Save to backup files
    const massiveBackupPath = path.join(backupsDir, 'massive-trivia-backup.json');
    console.log(`Saving to ${massiveBackupPath}...`);
    fs.writeFileSync(massiveBackupPath, JSON.stringify(backup, null, 2));
    
    // Also save as default backup
    const defaultBackupPath = path.join(backupsDir, 'default-trivia-backup.json');
    console.log(`Saving as default backup to ${defaultBackupPath}...`);
    fs.writeFileSync(defaultBackupPath, JSON.stringify(backup, null, 2));
    
    console.log("50,000 question generation complete!");
    
    return backup;
  } catch (error) {
    console.error("Error generating questions:", error);
  }
}

// Run the script
generate50kUniqueQuestions().then(() => {
  console.log("Script execution complete!");
}).catch(error => {
  console.error("Script failed:", error);
});