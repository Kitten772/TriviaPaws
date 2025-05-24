import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { TriviaQuestion } from "@shared/schema";
import { GameState, TriviaState, Difficulty, Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function useTriviaGame() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<TriviaState>({
    gameState: "welcome",
    questions: [],
    currentQuestion: null,
    currentQuestionIndex: 0,
    totalQuestions: 10,
    score: 0,
    loading: false,
    hasAnswered: false,
    selectedAnswer: null,
    isCorrect: false,
    timer: 30,
    timerInterval: null,
    timerEnabled: false,
    difficulty: "medium",
    category: "cats",
    gameId: null,
  });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
      }
    };
  }, [gameState.timerInterval]);

  // Start game mutation
  const startGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/trivia/start",
        {
          difficulty: gameState.difficulty,
          category: gameState.category,
          questionCount: gameState.totalQuestions,
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      // Check if data exists and has the expected format
      if (!data || !data.gameId) {
        toast({
          title: "Error starting game",
          description: "Received invalid data from the server. Please try again.",
          variant: "destructive",
        });
        setGameState((prev) => ({ ...prev, loading: false }));
        return;
      }
      
      // Initialize with empty questions array, will load from query
      setGameState((prev) => ({
        ...prev,
        gameState: "question",
        score: 0,
        currentQuestionIndex: 0,
        questions: [], // Will load from query
        gameId: data.gameId,
        loading: false,
        hasAnswered: false,
        selectedAnswer: null,
      }));
    },
    onError: (error) => {
      toast({
        title: "Error starting game",
        description: error.message || "Failed to start the game. Please try again.",
        variant: "destructive",
      });
      setGameState((prev) => ({ ...prev, loading: false }));
    },
  });

  // Get questions query
  const { data: questionsData } = useQuery({
    queryKey: ["/api/trivia/questions", gameState.gameId],
    enabled: !!gameState.gameId && gameState.gameState === "question",
  });

  // Stop game mutation
  const stopGameMutation = useMutation({
    mutationFn: async () => {
      if (!gameState.gameId) return;
      
      return apiRequest(
        "POST",
        "/api/trivia/stop",
        { gameId: gameState.gameId }
      );
    },
    onSuccess: () => {
      finishGame();
    },
    onError: (error) => {
      toast({
        title: "Error stopping game",
        description: error.message || "Failed to stop the game properly.",
        variant: "destructive",
      });
      // Still finish the game locally
      finishGame();
    },
  });

  // Load the current question
  const loadCurrentQuestion = useCallback((index: number, questions: TriviaQuestion[]) => {
    // Safety check for empty questions array or invalid index
    if (!questions || !Array.isArray(questions) || questions.length === 0 || index >= questions.length) {
      console.error("Cannot load question: Invalid questions array or index", { 
        questionsLength: questions?.length, 
        index 
      });
      return;
    }
    
    // Make sure we normalize the correctIndex property
    const question = questions[index];
    
    // Verify the question is a valid object
    if (!question || typeof question !== 'object') {
      console.error("Invalid question object at index", index);
      return;
    }
    
    // Create a normalized question with safe defaults for any missing properties
    const normalizedQuestion = {
      ...question,
      id: question.id || `temp-${index}`,
      text: question.text || question.question || "Question text unavailable",
      options: Array.isArray(question.options) ? question.options : ["Option 1", "Option 2", "Option 3", "Option 4"],
      // Make sure correctIndex is always properly set
      correctIndex: typeof question.correctIndex === 'number' ? 
                    question.correctIndex : 
                    typeof question.correct_index === 'number' ?
                    question.correct_index : 0,
    };
    
    setGameState((prev) => ({
      ...prev,
      loading: false,
      currentQuestion: normalizedQuestion,
      hasAnswered: false,
      selectedAnswer: null,
    }));

    if (gameState.timerEnabled) {
      startTimer();
    }
  }, [gameState.timerEnabled]);

  // Effects to update questions when data changes
  useEffect(() => {
    if (questionsData?.questions && questionsData.questions.length > 0) {
      setGameState(prev => ({
        ...prev,
        questions: questionsData.questions
      }));
      
      // If we have the current index, load that question
      if (gameState.currentQuestionIndex < questionsData.questions.length) {
        loadCurrentQuestion(gameState.currentQuestionIndex, questionsData.questions);
      }
    }
  }, [questionsData, loadCurrentQuestion, gameState.currentQuestionIndex]);

  // Set difficulty
  const setDifficulty = (difficulty: Difficulty) => {
    setGameState((prev) => ({ ...prev, difficulty }));
  };

  // Set category
  const setCategory = (category: Category) => {
    setGameState((prev) => ({ ...prev, category }));
  };

  // Start the game
  const startGame = () => {
    setGameState((prev) => ({ ...prev, loading: true }));
    startGameMutation.mutate();
  };

  // Stop the game
  const stopGame = () => {
    if (gameState.timerInterval) {
      clearInterval(gameState.timerInterval);
    }
    stopGameMutation.mutate();
  };

  // Finish the game (move to results screen)
  const finishGame = () => {
    setGameState((prev) => ({ 
      ...prev, 
      gameState: "finished",
      loading: false,
      timerInterval: null,
    }));
  };

  // Restart the game
  const restartGame = () => {
    startGame();
  };

  // Go back to welcome screen
  const goToWelcome = () => {
    setGameState((prev) => ({ 
      ...prev, 
      gameState: "welcome" 
    }));
  };

  // Select an answer
  const selectAnswer = (index: number) => {
    if (gameState.hasAnswered || !gameState.currentQuestion) return;

    // Fix: Check both possible correct answer property names
    const correctIndex = 
      gameState.currentQuestion.correctIndex !== undefined 
        ? gameState.currentQuestion.correctIndex 
        : gameState.currentQuestion.correct_index;
    
    const isCorrect = index === correctIndex;
    
    setGameState((prev) => ({
      ...prev,
      hasAnswered: true,
      selectedAnswer: index,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    if (isCorrect) {
      showConfetti();
    }

    clearTimer();
  };

  // Move to the next question
  const nextQuestion = () => {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex >= gameState.totalQuestions) {
      finishGame();
      return;
    }
    
    setGameState((prev) => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      loading: true,
    }));
    
    // Small delay to show loading state
    setTimeout(() => {
      loadCurrentQuestion(nextIndex, gameState.questions);
    }, 500);
  };

  // Start the timer
  const startTimer = () => {
    clearTimer();
    
    setGameState((prev) => ({ ...prev, timer: 30 }));
    
    const interval = setInterval(() => {
      setGameState((prev) => {
        const newTimer = prev.timer - 1;
        
        if (newTimer <= 0) {
          clearInterval(interval);
          return {
            ...prev,
            timer: 0,
            hasAnswered: true,
            isCorrect: false,
            timerInterval: null,
          };
        }
        
        return {
          ...prev,
          timer: newTimer,
        };
      });
    }, 1000);
    
    setGameState((prev) => ({ ...prev, timerInterval: interval }));
  };

  // Clear the timer
  const clearTimer = () => {
    if (gameState.timerInterval) {
      clearInterval(gameState.timerInterval);
      setGameState((prev) => ({ ...prev, timerInterval: null }));
    }
  };

  // Create a confetti effect for correct answers
  const showConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#F7F9FB'];
    const container = document.querySelector('main');
    
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      
      container.appendChild(confetti);
      
      // Animate confetti
      confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${Math.random() * 300 + 200}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(.37,.74,.15,1)',
        fill: 'forwards'
      });
      
      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  };

  return {
    ...gameState,
    setDifficulty,
    setCategory,
    startGame,
    stopGame,
    restartGame,
    goToWelcome,
    selectAnswer,
    nextQuestion,
    isLoading: startGameMutation.isPending || gameState.loading,
  };
}
