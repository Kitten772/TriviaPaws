-- TriviaPaws Sample Questions (100 questions)
-- Run this in your Render PostgreSQL console

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  "correctIndex" INTEGER NOT NULL,
  explanation TEXT,
  category TEXT,
  difficulty TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Begin transaction
BEGIN;

INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What sound does a contented cat make?', '["Meow","Hiss","Purr","Chirp"]', 2, 'A contented cat typically purrs, though cats also purr when injured or stressed as a self-soothing mechanism.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a group of cats called?', '["Pack","Clowder","Herd","Colony"]', 1, 'A group of cats is called a clowder. Other collective nouns for cats include a glaring or a pounce.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the normal body temperature of a cat?', '["Smell","Hearing","Sight","Touch"]', 2, 'A cat''s hearing is their most developed sense, able to hear sounds up to 64kHz (compared to humans'' 20kHz).', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a female cat called?', '["Doe","Queen","Dam","Filly"]', 1, 'A female cat is called a queen, especially when she is pregnant or nursing kittens.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a male cat called?', '["Tom","Buck","Bull","Jack"]', 0, 'A male cat is called a tom or tomcat, particularly when unneutered.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the average lifespan of a domestic cat?', '["5-8 years","10-15 years","16-20 years","21-25 years"]', 1, 'The average domestic cat lives 10-15 years, though many cats live into their late teens or even early twenties with proper care.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a baby cat called?', '["Pup","Calf","Kitten","Cub"]', 2, 'A baby cat is called a kitten until it reaches about one year of age.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How many toes does a typical cat have on its front paws?', '["Three","Four","Five","Six"]', 2, 'Most cats have five toes on each front paw and four on each back paw, for a total of 18 toes.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('At what age do kittens typically open their eyes?', '["Smell","Hearing","Sight","Touch"]', 2, 'A cat''s hearing is their most developed sense, able to hear sounds up to 64kHz (compared to humans'' 20kHz).', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What color are most cats at birth?', '["1-2 times their height","5-6 times their height","9-10 times their height","12-15 times their height"]', 0, 'Cats can jump about 5-6 times their height, allowing an average cat to reach about 5 feet vertically.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the main purpose of a cat''s rough tongue?', '["1-2 times their height","5-6 times their height","9-10 times their height","12-15 times their height"]', 0, 'Cats can jump about 5-6 times their height, allowing an average cat to reach about 5 feet vertically.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the average weight of an adult domestic cat?', '["1-2 times their height","5-6 times their height","9-10 times their height","12-15 times their height"]', 2, 'Cats can jump about 5-6 times their height, allowing an average cat to reach about 5 feet vertically.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How high can the average cat jump relative to its body length?', '["Primarily vegetation","Grains and berries","Small prey animals","Primarily fruits"]', 2, 'Cats are obligate carnivores whose natural diet consists primarily of small prey animals.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which sense is most developed in cats?', '["Smell","Hearing","Sight","Touch"]', 3, 'A cat''s hearing is their most developed sense, able to hear sounds up to 64kHz (compared to humans'' 20kHz).', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is unique about cat genetics?', '["Primarily vegetation","Grains and berries","Small prey animals","Primarily fruits"]', 2, 'Cats are obligate carnivores whose natural diet consists primarily of small prey animals.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats purr compared to other animals?', '["Through smell","Through sight","Through taste","Through touch"]', 3, 'Cats have an incredible sense of smell with about 200 million scent receptors in their nose compared to humans'' 5 million.', 'Cat Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What sensory information do cat whiskers provide?', '["They can see colors in darkness","They have a reflective layer behind their retina","They can see infrared light","Their pupils can open 50% wider than humans"]', 0, 'Cats have a reflective layer behind their retina called the tapetum lucidum that enhances night vision by reflecting light back through the retina.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats perceive stationary objects?', '["They have specialized leg muscles","They rotate their flexible spine","They use their tail as a counterweight","They have an inner ear mechanism"]', 1, 'Cats have a ''righting reflex'' allowing them to twist their body in mid-air to land on their feet.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What anatomical feature allows cats to rotate their ears?', '["Only for balance","Only for communication","Both balance and communication","Neither"]', 3, 'A cat''s tail serves multiple functions: it helps with balance when walking on narrow surfaces and it''s also a key communication tool.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the purpose of a cat''s third eyelid?', '["Only for balance","Only for communication","Both balance and communication","Neither"]', 2, 'A cat''s tail serves multiple functions: it helps with balance when walking on narrow surfaces and it''s also a key communication tool.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats use scent glands in their cheeks?', '["Only for balance","Only for communication","Both balance and communication","Neither"]', 1, 'A cat''s tail serves multiple functions: it helps with balance when walking on narrow surfaces and it''s also a key communication tool.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What purpose does a cat''s tail serve?', '["Only for balance","Only for communication","Both balance and communication","Neither balance nor communication"]', 2, 'A cat''s tail serves multiple functions: it helps with balance when walking on narrow surfaces or jumping, and it''s also a key communication tool to express emotions and intentions.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats always land on their feet when falling?', '["They have magnetic paw pads","They have a flexible spine and righting reflex","They can control gravity","They cannot always land on their feet"]', 1, 'Cats have a ''righting reflex'' and an extremely flexible spine that allows them to twist their body in mid-air to orient their feet toward the ground when falling.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s special about a cat''s night vision?', '["They have specialized leg muscles","They rotate their flexible spine","They use their tail as a counterweight","They have an inner ear mechanism"]', 2, 'Cats have a ''righting reflex'' allowing them to twist their body in mid-air to land on their feet.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Why do cats knead with their paws?', '["Three","Four","Five","Six"]', 2, 'Most cats have five toes on each front paw and four on each back paw, for a total of 18 toes.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How many scent receptors does the average cat have in its nose?', '["They can see colors in darkness","They have a reflective layer behind their retina","They can see infrared light","Their pupils can open 50% wider than humans"]', 2, 'Cats have a reflective layer behind their retina called the tapetum lucidum that enhances night vision by reflecting light back through the retina.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is unique about a cat''s tongue?', '["They can see colors in darkness","They have a reflective layer behind their retina","They can see infrared light","Their pupils can open 50% wider than humans"]', 2, 'Cats have a reflective layer behind their retina called the tapetum lucidum that enhances night vision by reflecting light back through the retina.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What happens to a cat''s pupils in bright light?', '["Only for balance","Only for communication","Both balance and communication","Neither"]', 0, 'A cat''s tail serves multiple functions: it helps with balance when walking on narrow surfaces and it''s also a key communication tool.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What are the small bumps on a cat''s face?', '["Through body language","Primarily through scent marking","Mainly through vocalizations","Equally through sounds, visuals, and scents"]', 0, 'Cats communicate through a complex mixture of body language, vocalizations, and scent marking.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s unique about a cat''s collarbone compared to a human''s?', '["They can see colors in darkness","They have a reflective layer behind their retina","They can see infrared light","Their pupils can open 50% wider than humans"]', 3, 'Cats have a reflective layer behind their retina called the tapetum lucidum that enhances night vision by reflecting light back through the retina.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats use their whiskers?', '["Through body language","Primarily through scent marking","Mainly through vocalizations","Equally through sounds, visuals, and scents"]', 0, 'Cats communicate through a complex mixture of body language, vocalizations, and scent marking.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Why do cats often sleep with their face and paws covered?', '["Three","Four","Five","Six"]', 2, 'Most cats have five toes on each front paw and four on each back paw, for a total of 18 toes.', 'Cat Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s the biochemical process behind a cat''s ability to walk?', '["An extra balance detector","A specialized scent analyzer","A heat-sensing organ","A specialized vocal apparatus"]', 1, 'The Jacobson''s organ (vomeronasal organ) is a specialized scent analyzer located in the roof of a cat''s mouth.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats'' specialized third eyelid function differently from other mammals?', '["Cats perceive time exactly like humans","Cats have no concept of time","Cats perceive time at a faster rate than humans","Cats perceive time primarily through light cycles"]', 2, 'Cats perceive time differently than humans, primarily through cycles of light and darkness and their internal biological rhythms.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What neurological structures control a cat''s climbing ability?', '["Incomplete dominance","X-chromosome inactivation","Simple recessive inheritance","Polygenic inheritance"]', 0, 'Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the evolutionary advantage of a cat''s climbing ability?', '["To detect air currents","To measure openings","To enhance taste","To amplify sounds"]', 2, 'Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do different cat breeds vary in their ability to scratch?', '["To detect air currents","To measure openings","To enhance taste","To amplify sounds"]', 0, 'Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s the molecular composition of a cat''s cushioned paws?', '["Three","Four","Five","Six"]', 2, 'Most cats have five toes on each front paw and four on each back paw, for a total of 18 toes.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do hormonal changes affect a cat''s tendency to flatten their ears?', '["To detect air currents","To measure openings","To enhance taste","To amplify sounds"]', 2, 'Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s the relationship between a cat''s hunting instincts and its evolutionary history?', '["Incomplete dominance","X-chromosome inactivation","Simple recessive inheritance","Polygenic inheritance"]', 0, 'Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats compensate for limitations in their independent nature?', '["It helps with vocalization","It regulates hunger","It maintains balance and spatial orientation","It enhances night vision"]', 0, 'A cat''s vestibular system maintains balance and spatial orientation, allowing for their remarkable agility.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What anatomical structures allow cats to dilate their pupils efficiently?', '["It helps with vocalization","It regulates hunger","It maintains balance and spatial orientation","It enhances night vision"]', 2, 'A cat''s vestibular system maintains balance and spatial orientation, allowing for their remarkable agility.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s the neurological basis for a cat''s preference to flatten their ears?', '["Cats perceive time exactly like humans","Cats have no concept of time","Cats perceive time at a faster rate than humans","Cats perceive time primarily through light cycles"]', 1, 'Cats perceive time differently than humans, primarily through cycles of light and darkness and their internal biological rhythms.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the Jacobson''s organ in cats and what does it do?', '["An extra balance detector","A specialized scent analyzer","A heat-sensing organ","A specialized vocal apparatus"]', 1, 'The Jacobson''s organ (vomeronasal organ) is a specialized scent analyzer located in the roof of a cat''s mouth that allows cats to ''taste'' scents.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How does a cat''s vestibular system work?', '["It helps with vocalization","It regulates hunger","It maintains balance and spatial orientation","It enhances night vision"]', 2, 'A cat''s vestibular system maintains balance and spatial orientation, allowing them to perform agile movements and always land on their feet.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What genetic mutation causes tortoiseshell coat patterns in cats?', '["Incomplete dominance","X-chromosome inactivation","Simple recessive inheritance","Polygenic inheritance"]', 1, 'Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats perceive time compared to humans?', '["To detect air currents","To measure openings","To enhance taste","To amplify sounds"]', 0, 'Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What''s the relationship between coat color and personality in cats?', '["It helps with vocalization","It regulates hunger","It maintains balance and spatial orientation","It enhances night vision"]', 1, 'A cat''s vestibular system maintains balance and spatial orientation, allowing for their remarkable agility.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cats use their vibrissae for spatial awareness?', '["Incomplete dominance","X-chromosome inactivation","Simple recessive inheritance","Polygenic inheritance"]', 0, 'Tortoiseshell coat patterns result from X-chromosome inactivation (lyonization), which is why almost all tortoiseshell cats are female.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What are the specific phases of a cat''s hunting sequence?', '["To detect air currents","To measure openings","To enhance taste","To amplify sounds"]', 1, 'Cat whiskers (vibrissae) are sensitive enough to detect slight changes in air currents, helping them navigate in darkness.', 'Cat Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which of these animals is nocturnal?', '["Elephant","Giraffe","Whale","Dinosaur"]', 2, 'The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the longest neck?', '["Kit","Joey","Calf","Pup"]', 0, 'A baby kangaroo is called a joey. After birth, the tiny joey crawls into its mother''s pouch where it continues to develop.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the largest species of bear?', '["Cheetah","Lion","Falcon","Sailfish"]', 0, 'The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (112 km/h) in short bursts.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the best sense of smell?', '["Eagle","Owl","Hawk","Falcon"]', 2, 'Owls are nocturnal, meaning they are active primarily during the night and sleep during the day.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a group of lions called?', '["Cheetah","Lion","Falcon","Sailfish"]', 2, 'The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (112 km/h) in short bursts.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal can change the color of its skin?', '["Penguin","Ostrich","Bat","Squirrel"]', 1, 'Bats are the only mammals capable of true flight, using wings formed from skin stretched between elongated finger bones.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal is known for having a pouch?', '["Elephant","Giraffe","Whale","Dinosaur"]', 3, 'The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal is known for its excellent memory?', '["Kit","Joey","Calf","Pup"]', 3, 'A baby kangaroo is called a joey. After birth, the tiny joey crawls into its mother''s pouch where it continues to develop.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the largest living land animal?', '["Elephant","Giraffe","Whale","Dinosaur"]', 3, 'The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal produces honey?', '["Kit","Joey","Calf","Pup"]', 0, 'A baby kangaroo is called a joey. After birth, the tiny joey crawls into its mother''s pouch where it continues to develop.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal is the fastest swimmer?', '["Tiger","Lion","Leopard","Jaguar"]', 0, 'The lion is often called the ''King of the Jungle'', despite actually living in grasslands and plains rather than jungles.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the loudest roar?', '["Tiger","Lion","Leopard","Jaguar"]', 3, 'The lion is often called the ''King of the Jungle'', despite actually living in grasslands and plains rather than jungles.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is a baby rabbit called?', '["Kit","Joey","Calf","Pup"]', 3, 'A baby kangaroo is called a joey. After birth, the tiny joey crawls into its mother''s pouch where it continues to develop.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal is the symbol of Australia?', '["Cheetah","Lion","Falcon","Sailfish"]', 0, 'The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (112 km/h) in short bursts.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What do you call a baby sheep?', '["Elephant","Giraffe","Whale","Dinosaur"]', 2, 'The giraffe is the tallest living animal, with adult males reaching heights of up to 18 feet (5.5 meters).', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal always has black and white fur?', '["Penguin","Ostrich","Bat","Squirrel"]', 2, 'Bats are the only mammals capable of true flight, using wings formed from skin stretched between elongated finger bones.', 'Animal Facts', 'easy')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal sleeps up to 22 hours a day?', '["Chew thoroughly","Swallow whole","Use their hands","Cut with teeth"]', 3, 'Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which of these animals is venomous?', '["Chew thoroughly","Swallow whole","Use their hands","Cut with teeth"]', 0, 'Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the longest lifespan?', '["Hearing","Taste","Smell","Touch"]', 3, 'Snakes have a highly developed sense of smell, using their forked tongues to collect airborne particles and their Jacobson''s organ to analyze them.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do dolphins sleep?', '["Chew thoroughly","Swallow whole","Use their hands","Cut with teeth"]', 1, 'Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the highest blood pressure?', '["Elephant","Giraffe","Blue whale","Cheetah"]', 3, 'Giraffes have extremely high blood pressure (about twice that of humans) to pump blood up their long necks to their brains.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the only mammal capable of true flight?', '["Flying squirrel","Sugar glider","Bat","Colugos"]', 0, 'Bats are the only mammals capable of true sustained flight, as opposed to gliding which some other mammals can do.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do frogs typically consume their food?', '["Hearing","Taste","Smell","Touch"]', 1, 'Snakes have a highly developed sense of smell, using their forked tongues to collect airborne particles and their Jacobson''s organ to analyze them.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which sense is most highly developed in snakes?', '["Fully awake","With half their brain at a time","Upside down","In deep caves"]', 2, 'Dolphins sleep with half their brain at a time (unihemispheric sleep), allowing them to continue surfacing to breathe and stay alert for predators.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do bees communicate the location of food sources?', '["Hearing","Taste","Smell","Touch"]', 1, 'Snakes have a highly developed sense of smell, using their forked tongues to collect airborne particles and their Jacobson''s organ to analyze them.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the largest brain relative to body size?', '["Chew thoroughly","Swallow whole","Use their hands","Cut with teeth"]', 2, 'Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do sea turtles navigate across oceans?', '["Flying squirrel","Sugar glider","Bat","Colugos"]', 0, 'Bats are the only mammals capable of true sustained flight, as opposed to gliding which some other mammals can do.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the most teeth?', '["Elephant","Giraffe","Blue whale","Cheetah"]', 3, 'Giraffes have extremely high blood pressure (about twice that of humans) to pump blood up their long necks to their brains.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What adaptation allows camels to survive in deserts?', '["Fully awake","With half their brain at a time","Upside down","In deep caves"]', 0, 'Dolphins sleep with half their brain at a time (unihemispheric sleep), allowing them to continue surfacing to breathe and stay alert for predators.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do solitary animals migrate differently than other animals?', '["Fully awake","With half their brain at a time","Upside down","In deep caves"]', 3, 'Dolphins sleep with half their brain at a time (unihemispheric sleep), allowing them to continue surfacing to breathe and stay alert for predators.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What advantage does protective armor give to animals in coastal areas?', '["Chemical trails","Specialized dances","Distinctive buzzing patterns","Color changes"]', 2, 'Honey bees communicate the location of food sources through specialized movements known as the ''waggle dance'', which indicates both direction and distance.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has the most remarkable protective armor?', '["Chew thoroughly","Swallow whole","Use their hands","Cut with teeth"]', 0, 'Most frogs consume their prey whole, using their sticky tongue to catch it and their eyes to push it down their throat.', 'Animal Facts', 'medium')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the specialized digestive system of ruminants called?', '["Monogastric","Polygastric","Avian gizzard","Carnivore tract"]', 1, 'Ruminants like cows have a polygastric digestive system with multiple stomach chambers, allowing them to ferment and digest plant matter in stages.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which reptile has a third eye on top of its head?', '["Komodo dragon","Tuatara","Chameleon","Basilisk lizard"]', 1, 'The tuatara has a third eye (parietal eye) on top of its head that''s sensitive to light and helps regulate body temperature and circadian rhythms.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which bird can recognize itself in a mirror?', '["Komodo dragon","Tuatara","Chameleon","Basilisk lizard"]', 0, 'The tuatara has a third eye (parietal eye) on top of its head that''s sensitive to light and helps regulate body temperature and circadian rhythms.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What unique defensive mechanism do bombardier beetles have?', '["Narwhal","Elephant","Owl","Sperm whale"]', 1, 'Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do mantis shrimp attack their prey?', '["Venomous bite","High-speed striking clubs","Electrocution","Sonic stunning"]', 0, 'Mantis shrimp strike with specialized appendages that accelerate at 10,000g and reach speeds of 50 mph, creating cavitation bubbles that produce extreme heat.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What unique adaption allows desert pupfish to survive in extreme conditions?', '["Narwhal","Elephant","Owl","Sperm whale"]', 1, 'Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do tardigrades (water bears) survive extreme conditions including space vacuum?', '["Komodo dragon","Tuatara","Chameleon","Basilisk lizard"]', 3, 'The tuatara has a third eye (parietal eye) on top of its head that''s sensitive to light and helps regulate body temperature and circadian rhythms.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is unique about platypus electroreception?', '["Crow","Magpie","Parrot","Falcon"]', 1, 'Magpies can recognize themselves in a mirror, showing self-awareness that''s rare in the animal kingdom and previously thought to exist only in mammals.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the function of the rectal gland in sharks?', '["Toxic spines","Chemical spray that reaches boiling temperature","Sonic deterrent","UV radiation emission"]', 2, 'Bombardier beetles can mix chemicals in their abdomen to create a boiling hot defensive spray that reaches 100°C (212°F) through an exothermic reaction.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do cuttlefish create complex color patterns for camouflage?', '["Narwhal","Elephant","Owl","Sperm whale"]', 3, 'Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What adaptation allows deep-sea fish to survive extreme pressure?', '["Narwhal","Elephant","Owl","Sperm whale"]', 2, 'Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do desert animals like kangaroo rats survive without drinking water?', '["Camel","Kangaroo Rat","Giraffe","Desert Tortoise"]', 1, 'The kangaroo rat can survive its entire life without drinking water, getting all the moisture it needs from the seeds it eats.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What is the purpose of the nuptial pad in male frogs?', '["Toxic spines","Chemical spray that reaches boiling temperature","Sonic deterrent","UV radiation emission"]', 3, 'Bombardier beetles can mix chemicals in their abdomen to create a boiling hot defensive spray that reaches 100°C (212°F) through an exothermic reaction.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do pistol shrimp stun their prey?', '["Venomous bite","High-speed striking clubs","Electrocution","Sonic stunning"]', 2, 'Mantis shrimp strike with specialized appendages that accelerate at 10,000g and reach speeds of 50 mph, creating cavitation bubbles that produce extreme heat.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('What unique adaptation allows the hoatzin bird''s chicks to escape predators?', '["Toxic spines","Chemical spray that reaches boiling temperature","Sonic deterrent","UV radiation emission"]', 0, 'Bombardier beetles can mix chemicals in their abdomen to create a boiling hot defensive spray that reaches 100°C (212°F) through an exothermic reaction.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('How do termites maintain precise temperature and humidity in their mounds?', '["Narwhal","Elephant","Owl","Sperm whale"]', 3, 'Sperm whales have a highly asymmetrical skull, with the blowhole shifted to the left side, possibly related to their echolocation abilities.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal has a brain that continues growing throughout its life?', '["Venomous bite","High-speed striking clubs","Electrocution","Sonic stunning"]', 3, 'Mantis shrimp strike with specialized appendages that accelerate at 10,000g and reach speeds of 50 mph, creating cavitation bubbles that produce extreme heat.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;
INSERT INTO trivia_questions (question, options, "correctIndex", explanation, category, difficulty)
VALUES ('Which animal can freeze solid during winter and come back to life in spring?', '["Komodo dragon","Tuatara","Chameleon","Basilisk lizard"]', 0, 'The tuatara has a third eye (parietal eye) on top of its head that''s sensitive to light and helps regulate body temperature and circadian rhythms.', 'Animal Facts', 'hard')
ON CONFLICT DO NOTHING;

-- Commit transaction
COMMIT;

-- Verify count
SELECT COUNT(*) FROM trivia_questions;
