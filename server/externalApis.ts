/**
 * External API integrations for trivia questions
 * This will fetch questions from various online trivia APIs
 */

import { TriviaQuestion } from "@shared/schema";
import { z } from "zod";

// Define interfaces for external APIs
interface OpenTriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTriviaResponse {
  response_code: number;
  results: OpenTriviaQuestion[];
}

/**
 * Fetches random trivia questions from the Open Trivia DB API
 * @param difficulty Difficulty level for questions
 * @param amount Number of questions to fetch
 * @returns Array of TriviaQuestion objects
 */
export async function fetchOpenTriviaDbQuestions(
  difficulty: string,
  amount: number = 5
): Promise<TriviaQuestion[]> {
  try {
    // Map our difficulty to OpenTriviaDB difficulty
    const mappedDifficulty = difficulty.toLowerCase();
    
    // Fetch from Open Trivia DB (a free, public trivia API)
    // Animal category is ID 27 in Open Trivia DB
    const url = `https://opentdb.com/api.php?amount=${amount}&category=27&difficulty=${mappedDifficulty}&type=multiple`;
    
    console.log(`Fetching from Open Trivia DB: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API response error: ${response.status} ${response.statusText}`);
    }
    
    const data: OpenTriviaResponse = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error(`Open Trivia DB returned error code: ${data.response_code}`);
    }
    
    // Convert the response to our TriviaQuestion format
    return data.results.map(q => {
      // Decode HTML entities (the API returns encoded HTML)
      const decoded = {
        question: decodeHtmlEntities(q.question),
        correct_answer: decodeHtmlEntities(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities)
      };
      
      // Create an array with all options (correct + incorrect)
      const allOptions = [
        decoded.correct_answer,
        ...decoded.incorrect_answers
      ];
      
      // Shuffle the options so the correct answer isn't always first
      const shuffledOptions = shuffleArray(allOptions);
      
      // Find the index of the correct answer in the shuffled array
      const correctIndex = shuffledOptions.indexOf(decoded.correct_answer);
      
      return {
        question: decoded.question,
        options: shuffledOptions,
        correctIndex: correctIndex,
        explanation: `The correct answer is ${decoded.correct_answer}.`,
        category: q.category,
        difficulty: q.difficulty
      };
    });
  } catch (error) {
    console.error("Error fetching from Open Trivia DB:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches random trivia questions from the Ninja Trivia API
 * This is an example of another API integration - can be enabled if we get API key
 */
export async function fetchNinjaTrivia(
  difficulty: string,
  amount: number = 5,
  category: string = "animals"
): Promise<TriviaQuestion[]> {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/trivia?category=${category}&limit=${amount}`, {
      headers: {
        'X-Api-Key': process.env.NINJA_API_KEY || ''
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ninja API response error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform to our format
    return data.map((q: any, i: number) => {
      // Generate 3 incorrect options (this API only returns the question and answer)
      // For a real implementation, we'd need to generate better fake options
      const fakeOptions = [`Option A`, `Option B`, `Option C`];
      
      // Add correct answer at random position
      const correctIndex = Math.floor(Math.random() * 4);
      const options = [...fakeOptions];
      options.splice(correctIndex, 0, q.answer);
      
      return {
        question: q.question,
        options: options,
        correctIndex: correctIndex,
        explanation: `The correct answer is ${q.answer}.`,
        category: "Animal Trivia",
        difficulty: difficulty
      };
    });
  } catch (error) {
    console.error("Error fetching from Ninja Trivia API:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches animal trivia questions from the OpenAI API if configured
 */
export async function fetchOpenAIQuestions(
  difficulty: string,
  amount: number = 5, 
  category: string = "animals"
): Promise<TriviaQuestion[]> {
  try {
    // Only attempt this if we have the keys defined
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    
    // Import OpenAI here to avoid issues if key isn't available
    const { generateTriviaQuestions } = await import("./openai");
    
    const result = await generateTriviaQuestions(
      difficulty as any,
      category === "cats" ? "cats" : "mixed",
      amount
    );
    
    // The format from our OpenAI service already matches our TriviaQuestion type
    return result.questions;
  } catch (error) {
    console.error("Error generating questions with OpenAI:", error);
    return [];
  }
}

/**
 * Function to shuffle an array randomly
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Decodes HTML entities like &quot; to their actual characters
 */
function decodeHtmlEntities(html: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// For Node.js environment where document isn't available
if (typeof document === 'undefined') {
  const decodeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&mdash;': '-',
    '&ndash;': '-',
    '&hellip;': '...'
  };
  
  global.decodeHtmlEntities = function(html: string): string {
    return html.replace(/&[\w\d#]{2,5};/g, (match) => decodeMap[match] || match);
  };
}