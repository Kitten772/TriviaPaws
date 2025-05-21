import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Generate trivia questions
export async function generateTriviaQuestions(
  difficulty: string,
  category: string,
  count: number = 10
): Promise<any> {
  try {
    // Create a specific prompt based on the category and difficulty
    let prompt = `Generate ${count} animal trivia questions`;
    
    if (category === "cats") {
      prompt += ` primarily about cats (at least 70% should be cat-related, and the rest about other animals)`;
    } else {
      prompt += ` about various animals including cats, dogs, birds, reptiles, and marine life`;
    }
    
    // Add difficulty level instructions
    if (difficulty === "easy") {
      prompt += `. The questions should be basic facts that most people would know, suitable for children or beginners.`;
    } else if (difficulty === "medium") {
      prompt += `. The questions should be moderately difficult, requiring some knowledge about animals.`;
    } else if (difficulty === "hard") {
      prompt += `. The questions should be challenging and include specific details, scientific names, or uncommon facts.`;
    }
    
    prompt += `
For each question, provide:
1. A clear question text
2. Four multiple-choice options (only one correct)
3. The index of the correct answer (0-3)
4. A brief explanation of the correct answer
5. A category label (e.g., "Cat Breeds", "Cat Behavior", "Wild Cats", "Dog Facts", etc.)

Return the data as a JSON object with an array of "questions" where each question has the following properties:
- question (string)
- options (array of 4 strings)
- correctIndex (number, 0-3)
- explanation (string)
- category (string)

The questions should be diverse and educational.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Failed to generate trivia questions");
    }

    const data = JSON.parse(content);
    return data;
  } catch (error) {
    console.error("Error generating trivia questions:", error);
    throw error;
  }
}
