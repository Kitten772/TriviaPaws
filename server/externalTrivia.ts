/**
 * External API integration for trivia questions
 */

import { TriviaQuestion } from "@shared/schema";

/**
 * Fetches animal trivia questions from Open Trivia Database
 */
export async function fetchExternalTriviaQuestions(
  difficulty: string,
  amount: number = 2
): Promise<TriviaQuestion[]> {
  try {
    // Map difficulty
    const mappedDifficulty = difficulty.toLowerCase();
    
    // Open Trivia DB API - Animals category is 27
    const url = `https://opentdb.com/api.php?amount=${amount}&category=27&difficulty=${mappedDifficulty}&type=multiple`;
    console.log(`Fetching from Open Trivia DB: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0 || !data.results || !data.results.length) {
      throw new Error("No questions received from API");
    }
    
    // Convert to our format
    return data.results.map((q: any) => {
      // Create combined options array with correct answer and incorrect answers
      const allOptions = [
        decodeHtml(q.correct_answer),
        ...q.incorrect_answers.map(decodeHtml)
      ];
      
      // Shuffle options so correct answer isn't always first
      const shuffledOptions = shuffleArray(allOptions);
      
      // Find position of correct answer
      const correctIndex = shuffledOptions.indexOf(decodeHtml(q.correct_answer));
      
      return {
        question: decodeHtml(q.question),
        options: shuffledOptions,
        correctIndex: correctIndex,
        explanation: `The correct answer is: ${decodeHtml(q.correct_answer)}`,
        category: decodeHtml(q.category),
        difficulty: q.difficulty
      };
    });
  } catch (error) {
    console.error("Error fetching external trivia:", error);
    return []; // Return empty array on error
  }
}

/**
 * Helper to decode HTML entities
 */
function decodeHtml(html: string): string {
  try {
    // Simple regex-based HTML entity decoder
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&ndash;/g, '-')
      .replace(/&mdash;/g, '—');
  } catch (e) {
    return html;
  }
}

/**
 * Shuffles array elements randomly
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}