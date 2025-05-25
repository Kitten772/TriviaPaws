import psycopg2
import random
import hashlib
import os
import json
from typing import List, Dict, Any

# Core trivia questions with reliable formatting
CAT_QUESTIONS = [
    {
        "question": "Which famous internet cat was known for its grumpy facial expression?",
        "options": ["Lil Bub", "Grumpy Cat", "Maru", "Keyboard Cat"],
        "correctIndex": 1,
        "explanation": "Grumpy Cat (real name Tardar Sauce) became famous for her permanently grumpy facial expression caused by feline dwarfism.",
        "category": "Famous Cats",
        "difficulty": "easy"
    },
    {
        "question": "What is the average lifespan of an indoor cat?",
        "options": ["5-8 years", "10-15 years", "15-20 years", "20-25 years"],
        "correctIndex": 1,
        "explanation": "Indoor cats typically live between 10-15 years, though some may live up to 20 years.",
        "category": "Cat Facts",
        "difficulty": "easy"
    },
    {
        "question": "Which of these cat breeds is known for having no fur?",
        "options": ["Persian", "Maine Coon", "Sphynx", "Siamese"],
        "correctIndex": 2,
        "explanation": "The Sphynx cat is known for being hairless, although they may have a fine layer of fuzz.",
        "category": "Cat Breeds",
        "difficulty": "easy"
    },
    {
        "question": "How many toes does a normal cat have on its front paws?",
        "options": ["4", "5", "6", "7"],
        "correctIndex": 1,
        "explanation": "Most cats have 5 toes on their front paws and 4 on their back paws, for a total of 18.",
        "category": "Cat Anatomy",
        "difficulty": "medium"
    },
    {
        "question": "What is a group of cats called?",
        "options": ["A clowder", "A murder", "A pride", "A pack"],
        "correctIndex": 0,
        "explanation": "A group of cats is called a clowder, while a group of kittens is called a kindle.",
        "category": "Cat Terminology",
        "difficulty": "medium"
    },
    {
        "question": "What is the scientific name for domestic cats?",
        "options": ["Felis catus", "Canis lupus", "Felis domesticus", "Panthera leo"],
        "correctIndex": 0,
        "explanation": "The scientific name for the domestic cat is Felis catus.",
        "category": "Cat Science",
        "difficulty": "medium"
    },
    {
        "question": "How fast can a domestic cat run?",
        "options": ["20 mph", "30 mph", "45 mph", "60 mph"],
        "correctIndex": 1,
        "explanation": "Domestic cats can run up to 30 mph (48 km/h) for short distances.",
        "category": "Cat Abilities",
        "difficulty": "medium"
    },
    {
        "question": "What is the record for the world's oldest cat?",
        "options": ["29 years", "38 years", "42 years", "50 years"],
        "correctIndex": 1,
        "explanation": "The oldest cat on record was Creme Puff, who lived to be 38 years old.",
        "category": "Cat Records",
        "difficulty": "hard"
    },
    {
        "question": "Which civilization was the first to domesticate cats?",
        "options": ["Ancient Egypt", "Ancient Greece", "Mesopotamia", "Ancient China"],
        "correctIndex": 0,
        "explanation": "The ancient Egyptians were the first to domesticate cats around 4,000 years ago.",
        "category": "Cat History",
        "difficulty": "hard"
    },
    {
        "question": "What percentage of a cat's bones are in its tail?",
        "options": ["5%", "10%", "15%", "20%"],
        "correctIndex": 1,
        "explanation": "About 10% of a cat's bones are in its tail, which contains 19-23 vertebrae.",
        "category": "Cat Anatomy",
        "difficulty": "hard"
    }
]

ANIMAL_QUESTIONS = [
    {
        "question": "Which animal has the longest lifespan?",
        "options": ["Elephant", "Tortoise", "Parrot", "Whale"],
        "correctIndex": 1,
        "explanation": "Some tortoise species can live over 150 years, with the oldest confirmed tortoise living to 188 years.",
        "category": "Animal Lifespans",
        "difficulty": "easy"
    },
    {
        "question": "Which cat has the loudest roar?",
        "options": ["Lion", "Tiger", "Jaguar", "Leopard"],
        "correctIndex": 1,
        "explanation": "Tigers have the loudest roar among big cats, which can be heard up to 2 miles away.",
        "category": "Wild Cats",
        "difficulty": "easy"
    },
    {
        "question": "What is a baby rabbit called?",
        "options": ["Kit", "Pup", "Cub", "Joey"],
        "correctIndex": 0,
        "explanation": "A baby rabbit is called a kit or kitten. They're born hairless and with their eyes closed.",
        "category": "Animal Babies",
        "difficulty": "easy"
    },
    {
        "question": "Which animal has the best sense of smell?",
        "options": ["Dog", "Bear", "Shark", "Elephant"],
        "correctIndex": 0,
        "explanation": "Dogs have up to 300 million olfactory receptors in their noses, compared to about 6 million in humans.",
        "category": "Animal Senses",
        "difficulty": "medium"
    },
    {
        "question": "Which bird can fly backwards?",
        "options": ["Eagle", "Hummingbird", "Penguin", "Ostrich"],
        "correctIndex": 1,
        "explanation": "Hummingbirds are the only birds that can fly backwards, upside down, and hover in mid-air.",
        "category": "Bird Facts",
        "difficulty": "medium"
    },
    {
        "question": "What is the fastest land animal?",
        "options": ["Cheetah", "Lion", "Gazelle", "Ostrich"],
        "correctIndex": 0,
        "explanation": "Cheetahs can reach speeds of up to 70 mph (113 km/h) for short bursts.",
        "category": "Animal Speed",
        "difficulty": "medium"
    },
    {
        "question": "How many hearts does an octopus have?",
        "options": ["1", "2", "3", "8"],
        "correctIndex": 2,
        "explanation": "Octopuses have three hearts: one main heart that pumps blood through the body and two branchial hearts that pump blood through the gills.",
        "category": "Marine Life",
        "difficulty": "medium"
    },
    {
        "question": "Which animal never sleeps?",
        "options": ["Giraffe", "Bullfrog", "Dolphin", "Ant"],
        "correctIndex": 1,
        "explanation": "Bullfrogs don't sleep. They remain alert at all times, though they do rest.",
        "category": "Animal Sleep",
        "difficulty": "hard"
    },
    {
        "question": "What is a group of lions called?",
        "options": ["A pack", "A pride", "A herd", "A flock"],
        "correctIndex": 1,
        "explanation": "A group of lions is called a pride, which typically consists of related females, their cubs, and a small number of adult males.",
        "category": "Animal Groups",
        "difficulty": "hard"
    },
    {
        "question": "Which animal has the largest brain relative to its body size?",
        "options": ["Human", "Elephant", "Dolphin", "Ant"],
        "correctIndex": 2,
        "explanation": "Dolphins have the largest brain relative to their body size among all animals, even larger than humans proportionally.",
        "category": "Animal Brains",
        "difficulty": "hard"
    }
]

def generate_question_hash(question: str) -> str:
    """Generate unique hash for question to prevent duplicates"""
    return hashlib.sha256(question.lower().strip().encode()).hexdigest()

def add_questions_to_db():
    """Add our core set of trivia questions to the database"""
    # Connect to the database
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL environment variable not set")
        return
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Create table if it doesn't exist
    cursor.execute("""
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
    conn.commit()
    
    # Get existing question hashes
    cursor.execute("SELECT question_hash FROM trivia_questions")
    existing_hashes = {row[0] for row in cursor.fetchall()}
    print(f"Found {len(existing_hashes)} existing questions in the database")
    
    # Insert cat questions
    cat_count = 0
    for q in CAT_QUESTIONS:
        q_hash = generate_question_hash(q['question'])
        if q_hash not in existing_hashes:
            random_bucket = random.randint(1, 100)
            try:
                cursor.execute("""
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
                cat_count += 1
            except Exception as e:
                print(f"Error inserting cat question: {e}")
                conn.rollback()
    
    # Insert animal questions
    animal_count = 0
    for q in ANIMAL_QUESTIONS:
        q_hash = generate_question_hash(q['question'])
        if q_hash not in existing_hashes:
            random_bucket = random.randint(1, 100)
            try:
                cursor.execute("""
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
                animal_count += 1
            except Exception as e:
                print(f"Error inserting animal question: {e}")
                conn.rollback()
    
    # Commit changes
    conn.commit()
    
    # Get difficulty counts
    cursor.execute("SELECT difficulty, COUNT(*) FROM trivia_questions GROUP BY difficulty")
    difficulty_counts = cursor.fetchall()
    
    # Get category counts
    cursor.execute("SELECT category, COUNT(*) FROM trivia_questions GROUP BY category ORDER BY COUNT(*) DESC")
    category_counts = cursor.fetchall()
    
    print(f"Added {cat_count} new cat questions and {animal_count} new animal questions")
    print(f"Difficulty distribution: {dict(difficulty_counts)}")
    print(f"Top categories: {dict(category_counts[:5])}")
    
    # Close connection
    cursor.close()
    conn.close()

if __name__ == "__main__":
    add_questions_to_db()