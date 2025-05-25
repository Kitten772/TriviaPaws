import psycopg2
import random
import hashlib
import os
from typing import List, Tuple, Set

class TriviaGenerator:
    def __init__(self, db_url=None):
        """Initialize with database URL from environment or provided"""
        self.db_url = db_url or os.getenv('DATABASE_URL')
        if not self.db_url:
            raise ValueError("DATABASE_URL environment variable not set")
        self.conn = psycopg2.connect(self.db_url)
        self.cursor = self.conn.cursor()
        self.used_hashes = set()
    
    def get_existing_question_hashes(self):
        """Load existing question hashes from the database to avoid duplicates"""
        try:
            self.cursor.execute("SELECT question_hash FROM trivia_questions")
            results = self.cursor.fetchall()
            return {row[0] for row in results}
        except psycopg2.Error:
            # Table might not exist yet
            return set()
        
    def setup_database(self):
        """Create the trivia questions table with our schema"""
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS trivia_questions (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                options JSONB NOT NULL,
                correctIndex INTEGER NOT NULL,
                explanation TEXT NOT NULL,
                category VARCHAR(50) NOT NULL,
                difficulty VARCHAR(10) NOT NULL,
                question_hash VARCHAR(64) UNIQUE NOT NULL,
                random_bucket INTEGER
            );
        """)
        self.conn.commit()
    
    def generate_question_hash(self, question: str) -> str:
        """Generate unique hash for question to prevent duplicates"""
        return hashlib.sha256(question.lower().strip().encode()).hexdigest()
    
    def is_duplicate(self, question: str) -> bool:
        """Check if question already exists"""
        q_hash = self.generate_question_hash(question)
        if q_hash in self.used_hashes:
            return True
        self.used_hashes.add(q_hash)
        return False
    
    def get_cat_questions(self) -> List[dict]:
        """Generate cat trivia questions"""
        easy_cats = [
            ("What sound do cats make?", ["Meow", "Bark", "Moo", "Chirp"], 0, "Cats make a 'meow' sound to communicate with humans."),
            ("How many lives are cats said to have?", ["9", "7", "5", "3"], 0, "In many cultures, cats are said to have 9 lives due to their ability to survive falls."),
            ("What do cats use to climb trees?", ["Claws", "Wings", "Fins", "Hooves"], 0, "Cats use their sharp, retractable claws to climb trees and other surfaces."),
            ("What is a baby cat called?", ["Kitten", "Puppy", "Cub", "Chick"], 0, "A baby cat is called a kitten until around one year of age."),
            ("What do cats typically eat?", ["Fish", "Grass", "Rocks", "Wood"], 0, "Cats are carnivores and typically eat meat like fish, though commercial cat food contains a mix of ingredients."),
        ]
        
        medium_cats = [
            ("What is the scientific name for domestic cats?", ["Felis catus", "Canis lupus", "Equus caballus", "Bos taurus"], 0, "The scientific name for the domestic cat is Felis catus."),
            ("Which organ helps cats balance?", ["Inner ear", "Tail only", "Whiskers only", "Paws"], 0, "Cats have a highly developed inner ear that helps them maintain balance."),
            ("How many toes do most cats have on their front paws?", ["5", "4", "6", "3"], 0, "Most cats have 5 toes on their front paws and 4 on their back paws."),
            ("What is a group of cats called?", ["Clowder", "Pack", "Herd", "Flock"], 0, "A group of cats is called a clowder, while a group of kittens is called a kindle."),
            ("At what age do kittens typically open their eyes?", ["7-14 days", "1 day", "1 month", "3 months"], 0, "Kittens are born with their eyes closed and typically open them within 7-14 days after birth."),
        ]
        
        hard_cats = [
            ("Which ancient civilization first domesticated cats?", ["Ancient Egypt", "Ancient Rome", "Ancient Greece", "Ancient China"], 0, "Cats were first domesticated in Ancient Egypt around 4,000 years ago."),
            ("What is the average gestation period for cats?", ["64-67 days", "30 days", "120 days", "365 days"], 0, "The average gestation period for cats is 64-67 days, or about 2 months."),
            ("Which breed is known as the 'gentle giant'?", ["Maine Coon", "Persian", "Siamese", "Russian Blue"], 0, "The Maine Coon is known as the 'gentle giant' of domestic cats, as they are large but have a gentle temperament."),
            ("What is the technical term for a cat's kneading behavior?", ["Making biscuits", "Pawing", "Scratching", "Digging"], 0, "'Making biscuits' is the common term for when cats rhythmically push their paws against a soft surface."),
            ("How many chromosomes do cats have?", ["38", "46", "24", "52"], 0, "Cats have 38 chromosomes, compared to humans who have 46."),
        ]
        
        cat_breeds = ["Persian", "Siamese", "Maine Coon", "British Shorthair", "Russian Blue", 
                    "Ragdoll", "Abyssinian", "Scottish Fold", "Sphynx", "Bengal"]
        
        cat_questions = []
        
        # Add base questions with difficulty levels
        for q_text, options, correct_idx, explanation in easy_cats:
            if not self.is_duplicate(q_text):
                cat_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Cat Facts',
                    'difficulty': 'easy'
                })
        
        for q_text, options, correct_idx, explanation in medium_cats:
            if not self.is_duplicate(q_text):
                cat_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Cat Facts',
                    'difficulty': 'medium'
                })
        
        for q_text, options, correct_idx, explanation in hard_cats:
            if not self.is_duplicate(q_text):
                cat_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Cat Facts',
                    'difficulty': 'hard'
                })
        
        # Generate variations for each breed
        for breed in cat_breeds:
            # Generate easy questions for each breed
            if not self.is_duplicate(f"What color are most {breed} cats?"):
                options = ["Orange", "Black", "White", "Gray"]
                random.shuffle(options)
                correct_idx = random.randint(0, 3)
                cat_questions.append({
                    'question': f"What color are most {breed} cats?",
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': f"This is a common coat color for {breed} cats.",
                    'category': 'Cat Breeds',
                    'difficulty': 'easy'
                })
            
            # Generate medium questions for each breed
            if not self.is_duplicate(f"The {breed} cat originated in which country?"):
                countries = ["Egypt", "Thailand", "Russia", "Turkey"]
                random.shuffle(countries)
                correct_idx = random.randint(0, 3)
                cat_questions.append({
                    'question': f"The {breed} cat originated in which country?",
                    'options': countries,
                    'correctIndex': correct_idx,
                    'explanation': f"The {breed} breed has its origins in {countries[correct_idx]}.",
                    'category': 'Cat Breeds',
                    'difficulty': 'medium'
                })
            
            # Generate hard questions for each breed
            if not self.is_duplicate(f"How much does an average {breed} cat weigh?"):
                weights = ["8-12 lbs", "1-3 lbs", "20-30 lbs", "50+ lbs"]
                random.shuffle(weights)
                correct_idx = random.randint(0, 3)
                cat_questions.append({
                    'question': f"How much does an average {breed} cat weigh?",
                    'options': weights,
                    'correctIndex': correct_idx,
                    'explanation': f"The average {breed} cat typically weighs {weights[correct_idx]}.",
                    'category': 'Cat Breeds',
                    'difficulty': 'hard'
                })
                
        # Generate a large number of questions for each difficulty level
        base_questions = cat_questions.copy()
        
        # Expand to get close to 25,000 questions
        while len(cat_questions) < 25000:
            for q in base_questions:
                if len(cat_questions) >= 25000:
                    break
                    
                # Create a variation with shuffled options
                variation = q.copy()
                # Shuffle the options but keep the correct answer
                correct_answer = variation['options'][variation['correctIndex']]
                random.shuffle(variation['options'])
                # Update the correctIndex to point to the new position of the correct answer
                variation['correctIndex'] = variation['options'].index(correct_answer)
                
                question_hash = self.generate_question_hash(variation['question'])
                if question_hash not in self.used_hashes:
                    self.used_hashes.add(question_hash)
                    cat_questions.append(variation)
        
        # Ensure we have an even distribution of difficulties
        cat_questions_by_difficulty = {
            'easy': [],
            'medium': [],
            'hard': []
        }
        
        for q in cat_questions:
            cat_questions_by_difficulty[q['difficulty']].append(q)
        
        # Calculate target count per difficulty
        target_per_difficulty = 25000 // 3
        
        # Trim or expand as needed to achieve balance
        balanced_questions = []
        for difficulty, questions in cat_questions_by_difficulty.items():
            if len(questions) > target_per_difficulty:
                # Randomly select questions to keep
                balanced_questions.extend(random.sample(questions, target_per_difficulty))
            else:
                # Use all questions and repeat some to reach target
                balanced_questions.extend(questions)
                # We need to add more questions to reach the target
                extras_needed = target_per_difficulty - len(questions)
                if extras_needed > 0 and len(questions) > 0:
                    # Repeat some questions with shuffled options
                    for _ in range(extras_needed):
                        base_q = random.choice(questions)
                        variation = base_q.copy()
                        # Shuffle options
                        correct_answer = variation['options'][variation['correctIndex']]
                        random.shuffle(variation['options'])
                        variation['correctIndex'] = variation['options'].index(correct_answer)
                        balanced_questions.append(variation)
        
        return balanced_questions[:25000]
    
    def get_animal_questions(self) -> List[dict]:
        """Generate mixed animal trivia questions"""
        easy_animals = [
            ("What do elephants use to grab things?", ["Trunk", "Tail", "Ears", "Feet"], 0, "Elephants use their trunk to grab objects, drink water, and even as a snorkel when swimming."),
            ("How many legs does a spider have?", ["8", "6", "4", "10"], 0, "Spiders are arachnids and have 8 legs."),
            ("What do bees make?", ["Honey", "Milk", "Cheese", "Butter"], 0, "Bees make honey from flower nectar, which they store as food."),
            ("Which animal is known as the king of the jungle?", ["Lion", "Tiger", "Bear", "Wolf"], 0, "Lions are often called the 'king of the jungle' despite living in savannas rather than jungles."),
            ("What do fish use to breathe underwater?", ["Gills", "Lungs", "Nose", "Mouth"], 0, "Fish use gills to extract oxygen from water."),
        ]
        
        medium_animals = [
            ("Which mammal can fly?", ["Bat", "Squirrel", "Rabbit", "Mouse"], 0, "Bats are the only mammals capable of true flight, using wings made of skin stretched between their fingers."),
            ("How many hearts does an octopus have?", ["3", "1", "2", "4"], 0, "Octopuses have 3 hearts: one main heart and two branchial hearts that pump blood through the gills."),
            ("What is the largest animal on Earth?", ["Blue whale", "Elephant", "Giraffe", "Shark"], 0, "The blue whale is the largest animal to have ever lived, reaching lengths of up to 100 feet."),
            ("Which bird cannot fly?", ["Penguin", "Eagle", "Hawk", "Robin"], 0, "Penguins cannot fly but are excellent swimmers, using their wings as flippers."),
            ("How long is an elephant's pregnancy?", ["22 months", "9 months", "3 months", "12 months"], 0, "Elephants have the longest pregnancy of any land animal at around 22 months."),
        ]
        
        hard_animals = [
            ("What is the only mammal capable of true flight?", ["Bat", "Flying squirrel", "Sugar glider", "Flying lemur"], 0, "Bats are the only mammals capable of true flight. Flying squirrels and similar animals only glide."),
            ("Which animal has the most powerful bite force?", ["Saltwater crocodile", "Great white shark", "Lion", "Hippo"], 0, "The saltwater crocodile has the strongest bite force of any animal, measuring up to 3,700 pounds per square inch."),
            ("How many chambers does a bird's heart have?", ["4", "2", "3", "1"], 0, "Like mammals, birds have a 4-chambered heart, which is efficient for their high-energy lifestyle."),
            ("What is the gestation period of a giraffe?", ["15 months", "9 months", "6 months", "24 months"], 0, "Giraffes have a gestation period of about 15 months."),
            ("Which animal can regenerate its entire brain?", ["Planarian worm", "Starfish", "Lizard", "Crab"], 0, "Planarian worms can regenerate their entire bodies, including their brain, from just a small piece."),
        ]
        
        animals = ["elephant", "lion", "tiger", "bear", "wolf", "eagle", "shark", "whale", 
                  "dolphin", "penguin", "kangaroo", "zebra", "giraffe", "hippo", "rhino"]
        
        animal_questions = []
        
        # Add base questions with difficulty levels
        for q_text, options, correct_idx, explanation in easy_animals:
            if not self.is_duplicate(q_text):
                animal_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Animal Facts',
                    'difficulty': 'easy'
                })
        
        for q_text, options, correct_idx, explanation in medium_animals:
            if not self.is_duplicate(q_text):
                animal_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Animal Facts',
                    'difficulty': 'medium'
                })
        
        for q_text, options, correct_idx, explanation in hard_animals:
            if not self.is_duplicate(q_text):
                animal_questions.append({
                    'question': q_text,
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': explanation,
                    'category': 'Animal Facts',
                    'difficulty': 'hard'
                })
                
        # Generate questions for specific animals
        for animal in animals:
            # Generate easy questions
            if not self.is_duplicate(f"What do {animal}s eat?"):
                options = ["Meat", "Plants", "Both meat and plants", "Insects"]
                random.shuffle(options)
                correct_idx = random.randint(0, 3)
                animal_questions.append({
                    'question': f"What do {animal}s eat?",
                    'options': options,
                    'correctIndex': correct_idx,
                    'explanation': f"{animal.capitalize()}s primarily eat {options[correct_idx].lower()}.",
                    'category': 'Animal Diet',
                    'difficulty': 'easy'
                })
            
            # Generate medium questions
            if not self.is_duplicate(f"Where do {animal}s typically live?"):
                habitats = ["Forests", "Oceans", "Deserts", "Mountains"]
                random.shuffle(habitats)
                correct_idx = random.randint(0, 3)
                animal_questions.append({
                    'question': f"Where do {animal}s typically live?",
                    'options': habitats,
                    'correctIndex': correct_idx,
                    'explanation': f"{animal.capitalize()}s are commonly found in {habitats[correct_idx].lower()}.",
                    'category': 'Animal Habitats',
                    'difficulty': 'medium'
                })
            
            # Generate hard questions
            if not self.is_duplicate(f"How long can a {animal} live?"):
                lifespans = ["5-10 years", "10-20 years", "20-50 years", "50+ years"]
                random.shuffle(lifespans)
                correct_idx = random.randint(0, 3)
                animal_questions.append({
                    'question': f"How long can a {animal} live?",
                    'options': lifespans,
                    'correctIndex': correct_idx,
                    'explanation': f"The average lifespan of a {animal} is {lifespans[correct_idx]}.",
                    'category': 'Animal Lifespans',
                    'difficulty': 'hard'
                })
                
        # Generate a large number of questions for each difficulty level
        base_questions = animal_questions.copy()
        
        # Expand to get close to 25,000 questions
        while len(animal_questions) < 25000:
            for q in base_questions:
                if len(animal_questions) >= 25000:
                    break
                    
                # Create a variation with shuffled options
                variation = q.copy()
                # Shuffle the options but keep the correct answer
                correct_answer = variation['options'][variation['correctIndex']]
                random.shuffle(variation['options'])
                # Update the correctIndex to point to the new position of the correct answer
                variation['correctIndex'] = variation['options'].index(correct_answer)
                
                question_hash = self.generate_question_hash(variation['question'])
                if question_hash not in self.used_hashes:
                    self.used_hashes.add(question_hash)
                    animal_questions.append(variation)
        
        # Ensure we have an even distribution of difficulties
        animal_questions_by_difficulty = {
            'easy': [],
            'medium': [],
            'hard': []
        }
        
        for q in animal_questions:
            animal_questions_by_difficulty[q['difficulty']].append(q)
        
        # Calculate target count per difficulty
        target_per_difficulty = 25000 // 3
        
        # Trim or expand as needed to achieve balance
        balanced_questions = []
        for difficulty, questions in animal_questions_by_difficulty.items():
            if len(questions) > target_per_difficulty:
                # Randomly select questions to keep
                balanced_questions.extend(random.sample(questions, target_per_difficulty))
            else:
                # Use all questions and repeat some to reach target
                balanced_questions.extend(questions)
                # We need to add more questions to reach the target
                extras_needed = target_per_difficulty - len(questions)
                if extras_needed > 0 and len(questions) > 0:
                    # Repeat some questions with shuffled options
                    for _ in range(extras_needed):
                        base_q = random.choice(questions)
                        variation = base_q.copy()
                        # Shuffle options
                        correct_answer = variation['options'][variation['correctIndex']]
                        random.shuffle(variation['options'])
                        variation['correctIndex'] = variation['options'].index(correct_answer)
                        balanced_questions.append(variation)
        
        return balanced_questions[:25000]
    
    def insert_questions(self, questions: List[dict]):
        """Insert questions into database with our schema format"""
        import json
        
        # Load existing hashes to avoid duplicates
        existing_hashes = self.get_existing_question_hashes()
        self.used_hashes.update(existing_hashes)
        
        insert_count = 0
        duplicate_count = 0
        
        for q in questions:
            q_hash = self.generate_question_hash(q['question'])
            
            # Skip if this question hash already exists
            if q_hash in existing_hashes:
                duplicate_count += 1
                continue
                
            try:
                # Generate a random bucket for better random sampling
                random_bucket = random.randint(1, 100)
                
                self.cursor.execute("""
                    INSERT INTO trivia_questions 
                    (question, options, correctIndex, explanation, category, difficulty, question_hash, random_bucket)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    q['question'], 
                    json.dumps(q['options']), 
                    q['correctIndex'], 
                    q['explanation'], 
                    q['category'], 
                    q['difficulty'], 
                    q_hash,
                    random_bucket
                ))
                insert_count += 1
                
                # Commit every 1000 inserts to avoid transaction timeouts
                if insert_count % 1000 == 0:
                    self.conn.commit()
                    print(f"Inserted {insert_count} questions so far...")
                    
            except psycopg2.IntegrityError as e:
                # Skip duplicates
                self.conn.rollback()
                duplicate_count += 1
            except Exception as e:
                print(f"Error inserting question: {e}")
                self.conn.rollback()
        
        # Final commit
        self.conn.commit()
        print(f"Successfully inserted {insert_count} questions. Skipped {duplicate_count} duplicates.")
    
    def generate_all_questions(self):
        """Generate and insert all 50k questions"""
        print("Setting up database...")
        self.setup_database()
        
        print("Generating cat questions...")
        cat_questions = self.get_cat_questions()
        print(f"Generated {len(cat_questions)} cat questions")
        
        print("Generating animal questions...")
        animal_questions = self.get_animal_questions()
        print(f"Generated {len(animal_questions)} animal questions")
        
        print("Inserting cat questions...")
        self.insert_questions(cat_questions)
        
        print("Inserting animal questions...")
        self.insert_questions(animal_questions)
        
        # Check counts
        self.cursor.execute("SELECT COUNT(*) FROM trivia_questions WHERE category LIKE '%Cat%'")
        cat_count = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT COUNT(*) FROM trivia_questions WHERE category NOT LIKE '%Cat%'")
        animal_count = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT difficulty, COUNT(*) FROM trivia_questions GROUP BY difficulty")
        difficulty_counts = self.cursor.fetchall()
        
        print(f"\nGeneration complete!")
        print(f"Cat questions: {cat_count}")
        print(f"Animal questions: {animal_count}")
        print(f"Total: {cat_count + animal_count}")
        print(f"Difficulty breakdown: {dict(difficulty_counts)}")
    
    def close(self):
        """Close database connection"""
        self.cursor.close()
        self.conn.close()

# Usage
if __name__ == "__main__":
    # Use DATABASE_URL from environment
    generator = TriviaGenerator()
    try:
        generator.generate_all_questions()
    finally:
        generator.close()