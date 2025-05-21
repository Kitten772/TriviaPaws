import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TriviaQuestion({ triviaGame }) {
  const { 
    loading, 
    currentQuestion, 
    currentQuestionIndex, 
    totalQuestions, 
    hasAnswered, 
    selectedAnswer, 
    isCorrect, 
    timerEnabled, 
    timer, 
    selectAnswer, 
    nextQuestion 
  } = triviaGame;

  // Options label mapping
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-bounce mb-4">
            <i className="ri-paw-print-fill text-5xl text-[#FF6B6B]"></i>
          </div>
          <p className="text-lg text-gray-600 font-heading">Loading next question...</p>
        </div>
      )}
      
      {/* Question Content */}
      {!loading && currentQuestion && (
        <div className="w-full">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-[#FF6B6B] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
            ></div>
          </div>
          
          {/* Question Counter */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">{`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}</span>
            
            {/* Timer (if enabled) */}
            {timerEnabled && (
              <div className="flex items-center bg-[#292F36] bg-opacity-10 rounded-full px-3 py-1">
                <i className="ri-time-line mr-1 text-[#292F36]"></i>
                <span className="font-mono font-semibold">{timer}</span>
              </div>
            )}
          </div>
          
          {/* Question Card */}
          <Card className="mb-6 overflow-hidden">
            {/* Question Header */}
            <CardHeader className="bg-[#4ECDC4] p-4 text-white">
              <span className="text-xs uppercase tracking-wider font-bold">{currentQuestion.category || 'Animal Trivia'}</span>
            </CardHeader>
            
            {/* Question Text */}
            <CardContent className="p-6">
              <h2 className="font-heading font-bold text-xl md:text-2xl mb-4">{currentQuestion.question}</h2>
              
              {/* Question Image (if available) */}
              {currentQuestion.image && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={currentQuestion.image}
                    alt={currentQuestion.question}
                    className="rounded-lg max-h-64 object-cover shadow"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button 
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={hasAnswered}
                className={`option-btn p-4 bg-white border-2 border-gray-200 rounded-lg text-left transition-all duration-200 flex items-center hover:border-[#FF6B6B] focus:outline-none focus:border-[#FF6B6B] ${
                  hasAnswered && index === currentQuestion.correctIndex 
                    ? 'correct-answer' 
                    : hasAnswered && selectedAnswer === index && index !== currentQuestion.correctIndex 
                      ? 'incorrect-answer' 
                      : ''
                }`}
              >
                <span className="bg-[#FFD166] w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold mr-3">{optionLabels[index]}</span>
                <span className="font-heading">{option}</span>
              </button>
            ))}
          </div>
          
          {/* Feedback Area */}
          {hasAnswered && (
            <div className="mb-6 text-center">
              {isCorrect ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                  <p className="font-heading font-bold text-lg">Correct! 🎉</p>
                  <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                  <p className="font-heading font-bold text-lg">Oops! That's not right. 😿</p>
                  <p className="mt-2 text-sm">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Next Question Button */}
          {hasAnswered && (
            <div className="text-center">
              <button 
                onClick={nextQuestion}
                className="bg-[#4ECDC4] text-white py-2 px-6 rounded-full font-heading font-bold hover:bg-opacity-90 transition-all shadow hover:shadow-md">
                Next Question
                <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
