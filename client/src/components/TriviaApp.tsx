import { useEffect } from "react";
import TriviaWelcome from "./TriviaWelcome";
import TriviaQuestion from "./TriviaQuestion";
import TriviaResults from "./TriviaResults";
import { useTriviaGame } from "@/hooks/useTriviaGame";

export default function TriviaApp() {
  const triviaGame = useTriviaGame();

  // Set page title based on game state
  useEffect(() => {
    let title = "Purrfect Trivia - Animal Quiz Game";
    
    if (triviaGame.gameState === "question") {
      title = `Question ${triviaGame.currentQuestionIndex + 1} - Purrfect Trivia`;
    } else if (triviaGame.gameState === "finished") {
      title = `Your Score: ${triviaGame.score}/${triviaGame.totalQuestions} - Purrfect Trivia`;
    }
    
    document.title = title;
  }, [triviaGame.gameState, triviaGame.currentQuestionIndex, triviaGame.score, triviaGame.totalQuestions]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB]">
      {/* Header Section */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="ri-footprint-line text-3xl text-[#FF6B6B] mr-2"></i>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-[#292F36]">Purrfect Trivia</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {triviaGame.gameState !== "welcome" && (
              <div className="bg-[#FFD166] rounded-full py-1 px-4 flex items-center">
                <i className="ri-award-fill text-[#292F36] mr-1"></i>
                <span className="font-heading font-bold">{triviaGame.score}</span>
              </div>
            )}
            
            {(triviaGame.gameState !== "welcome" && triviaGame.gameState !== "finished") && (
              <button 
                onClick={triviaGame.stopGame}
                className="bg-[#FF6B6B] text-white rounded-full py-1 px-4 flex items-center hover:bg-red-500 transition-colors shadow-sm">
                <i className="ri-stop-circle-line mr-1"></i>
                <span className="font-heading font-semibold">Stop</span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center justify-center">
        {triviaGame.gameState === "welcome" && <TriviaWelcome triviaGame={triviaGame} />}
        {triviaGame.gameState === "question" && <TriviaQuestion triviaGame={triviaGame} />}
        {triviaGame.gameState === "finished" && <TriviaResults triviaGame={triviaGame} />}
      </main>
      
      {/* Footer Section */}
      <footer className="bg-white py-4 px-6 shadow-inner">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Purrfect Trivia. Powered by databases and apis. 🐾</p>
        </div>
      </footer>
    </div>
  );
}
