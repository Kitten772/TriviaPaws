import { Card, CardContent } from "@/components/ui/card";

export default function TriviaWelcome({ triviaGame }) {
  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Cat image */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full bg-[#FFD166] flex items-center justify-center shadow-lg border-4 border-[#FFD166]">
          <i className="ri-user-smile-line text-6xl text-[#292F36]"></i>
        </div>
      </div>
      
      <h2 className="font-heading font-bold text-3xl mb-4">Welcome to Purrfect Trivia!</h2>
      <p className="mb-8 text-gray-600">Test your knowledge about cats and other animals in this fun trivia game. How many questions can you answer correctly?</p>
      
      <div className="mb-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-heading font-bold text-xl mb-3">Choose difficulty:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => triviaGame.setDifficulty("easy")} 
                className={`px-4 py-2 rounded-full bg-green-100 text-green-800 font-heading font-semibold hover:bg-green-200 transition-colors ${triviaGame.difficulty === "easy" ? "ring-2 ring-[#FF6B6B]" : ""}`}>
                Easy
              </button>
              <button 
                onClick={() => triviaGame.setDifficulty("medium")} 
                className={`px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-heading font-semibold hover:bg-yellow-200 transition-colors ${triviaGame.difficulty === "medium" ? "ring-2 ring-[#FF6B6B]" : ""}`}>
                Medium
              </button>
              <button 
                onClick={() => triviaGame.setDifficulty("hard")} 
                className={`px-4 py-2 rounded-full bg-red-100 text-red-800 font-heading font-semibold hover:bg-red-200 transition-colors ${triviaGame.difficulty === "hard" ? "ring-2 ring-[#FF6B6B]" : ""}`}>
                Hard
              </button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-heading font-bold text-xl mb-3">Focus on:</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => triviaGame.setCategory("cats")} 
                className={`px-4 py-2 rounded-full bg-[#FF6B6B] bg-opacity-10 text-[#FF6B6B] font-heading font-semibold hover:bg-opacity-20 transition-colors ${triviaGame.category === "cats" ? "ring-2 ring-[#FF6B6B]" : ""}`}>
                Mostly Cats
              </button>
              <button 
                onClick={() => triviaGame.setCategory("mixed")} 
                className={`px-4 py-2 rounded-full bg-[#4ECDC4] bg-opacity-10 text-[#4ECDC4] font-heading font-semibold hover:bg-opacity-20 transition-colors ${triviaGame.category === "mixed" ? "ring-2 ring-[#FF6B6B]" : ""}`}>
                Mixed Animals
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <button 
        onClick={triviaGame.startGame}
        disabled={triviaGame.isLoading}
        className="bg-[#FF6B6B] text-white py-3 px-8 rounded-full font-heading font-bold text-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] disabled:opacity-70 disabled:cursor-not-allowed">
        {triviaGame.isLoading ? (
          <div className="flex items-center">
            <i className="ri-loader-2-line animate-spin mr-2"></i>
            <span>Loading...</span>
          </div>
        ) : (
          "Start Playing"
        )}
      </button>
    </div>
  );
}
