/**
 * Fix for Render deployment issues
 * 
 * This script fixes two main issues:
 * 1. Duplicate questions appearing
 * 2. Correct answers always in the top-left corner
 * 
 * Add this code to your Render deployment
 */

// Function to properly shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  // Create a copy of the array to avoid modifying the original
  const newArray = [...array];
  
  // Perform Fisher-Yates shuffle
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
}

// Function to clean question text for better duplicate detection
function cleanQuestionText(question) {
  if (!question) return '';
  
  // Remove ALL numbers from the entire question
  let cleanedQuestion = question;
  
  // Remove all digits
  cleanedQuestion = cleanedQuestion.replace(/\d+/g, '');
  
  // Remove extra spaces and normalize punctuation
  cleanedQuestion = cleanedQuestion.replace(/\s+/g, ' ');
  cleanedQuestion = cleanedQuestion.replace(/\s*([,.?!:;])\s*/g, '$1 ');
  cleanedQuestion = cleanedQuestion.replace(/\s+/g, ' ');
  
  // Remove any remaining leading or trailing whitespace
  cleanedQuestion = cleanedQuestion.trim();
  
  return cleanedQuestion;
}

// Function to fix option shuffling and track the new correctIndex
function fixOptionShuffling(question) {
  // Ensure we have valid options array
  const options = Array.isArray(question.options) 
    ? question.options 
    : typeof question.options === 'string' 
      ? JSON.parse(question.options) 
      : ["Option A", "Option B", "Option C", "Option D"];
  
  // Determine correct answer
  const correctIndex = typeof question.correctIndex === 'number' 
    ? question.correctIndex 
    : 0;
  
  // Get the correct answer before shuffling
  const correctAnswer = options[correctIndex];
  
  // Create a new shuffled copy of the options
  const shuffledOptions = shuffleArray(options);
  
  // Find where the correct answer ended up after shuffling
  const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswer);
  
  // Return question with properly shuffled options
  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex
  };
}

// Function to remove duplicate questions from an array
function removeDuplicates(questions) {
  const uniqueQuestions = [];
  const seenQuestions = new Set();
  
  for (const question of questions) {
    const cleanText = cleanQuestionText(question.question).toLowerCase();
    
    if (!seenQuestions.has(cleanText)) {
      seenQuestions.add(cleanText);
      uniqueQuestions.push(question);
    }
  }
  
  return uniqueQuestions;
}

/**
 * HOW TO USE THIS CODE:
 * 
 * 1. For fixing option shuffling:
 *    - Find where your code prepares questions for the client
 *    - Add this line for each question:
 *      question = fixOptionShuffling(question);
 * 
 * 2. For removing duplicates:
 *    - Find where you select questions for a game
 *    - After selecting questions, add:
 *      questions = removeDuplicates(questions);
 * 
 * EXAMPLE IMPLEMENTATION:
 * 
 * // When starting a new game
 * app.post("/api/trivia/start", async (req, res) => {
 *   // ... your existing code to get questions ...
 *   
 *   // Remove duplicates
 *   questions = removeDuplicates(questions);
 *   
 *   // Shuffle options for each question
 *   questions = questions.map(question => fixOptionShuffling(question));
 *   
 *   // ... rest of your code ...
 * });
 */