import { Card, CardContent } from "@/components/ui/card";

export default function TriviaResults({ triviaGame }) {
  const { score, totalQuestions, restartGame, goToWelcome } = triviaGame;
  
  // Calculate score percentage for conditional content
  const scorePercentage = (score / totalQuestions) * 100;
  
  return (
    <div className="text-center max-w-lg mx-auto">
      <div className="mb-8">
        {/* Show different images based on score */}
        <div className="mb-4">
          {scorePercentage >= 70 ? (
            <div className="w-32 h-32 mx-auto rounded-full bg-[#6BFF6B] flex items-center justify-center shadow-lg border-4 border-[#6BFF6B]">
              <i className="ri-emotion-laugh-line text-6xl text-[#292F36]"></i>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-[#FF6B6B] flex items-center justify-center shadow-lg border-4 border-[#FF6B6B]">
              <i className="ri-emotion-normal-line text-6xl text-white"></i>
            </div>
          )}
        </div>
        
        <h2 className="font-heading font-bold text-3xl mb-4">
          {scorePercentage >= 70 && "Purrfect Job!"}
          {scorePercentage < 70 && scorePercentage >= 40 && "Not Bad!"}
          {scorePercentage < 40 && "Keep Learning!"}
        </h2>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-2xl font-heading font-bold mb-2">Your Score:</p>
            <div className="flex items-center justify-center text-4xl font-bold text-[#FF6B6B]">
              <span>{score}</span>
              <span className="mx-2">/</span>
              <span>{totalQuestions}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-1">
                Correct answers: <span className="font-semibold text-green-600">{score}</span>
              </p>
              <p className="text-gray-600">
                Incorrect answers: <span className="font-semibold text-red-600">{totalQuestions - score}</span>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {scorePercentage >= 70 ? (
          <p className="mb-8 text-gray-600">Great job! You really know your animal facts. Ready for another round?</p>
        ) : (
          <p className="mb-8 text-gray-600">Every trivia game is a chance to learn something new about our animal friends. Want to try again?</p>
        )}
        
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={restartGame}
            className="bg-[#FF6B6B] text-white py-3 px-8 rounded-full font-heading font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg">
            Play Again
          </button>
          <button 
            onClick={goToWelcome}
            className="bg-white text-[#292F36] py-3 px-8 rounded-full font-heading font-bold text-lg border border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow">
            Change Settings
          </button>
        </div>
      </div>
    </div>
  );
}
