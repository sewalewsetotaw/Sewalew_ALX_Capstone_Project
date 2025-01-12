import React, { useState } from "react";
import "./App.css";
import QuizStart from "./components/QuizStart";
import QuestionCard from "./components/QuestionCard";
import ScoreSummary from "./components/ScoreSummary";

function App() {
  // State hooks to manage different parts of the quiz
  const [questions, setQuestions] = useState([]); // Store quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index for current question
  const [score, setScore] = useState(0); // Store user's score
  const [quizStarted, setQuizStarted] = useState(false); // State to track if quiz has started
  const [quizComplete, setQuizComplete] = useState(false); // State to track if quiz is complete
  const [userAnswers, setUserAnswers] = useState([]); // Store user's answers
  const [quizConfig, setQuizConfig] = useState({
    category: "",
    difficulty: "",
    amount: 5,
  }); // Quiz settings (category, difficulty, amount of questions)
  const [loading, setLoading] = useState(false); // State to track if quiz is loading
  const [quizHistory, setQuizHistory] = useState([]); // Track quiz history (previous quizzes)
  const [error, setError] = useState(null); // Handle errors during quiz fetching

  // Function to start the quiz by fetching questions based on selected options
  const startQuiz = async (category, difficulty, amount) => {
    setQuizConfig({ category, difficulty, amount });
    setLoading(true); // Set loading state before fetching data
    setError(null); // Reset error state before starting a new quiz

    try {
      // Fetch quiz questions from Open Trivia Database API
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`,
      );
      const data = await response.json();

      // Check if data exists and contains results
      if (data.results && data.results.length > 0) {
        setQuestions(data.results); // Set questions if available
        setQuizStarted(true); // Mark quiz as started
        setQuizComplete(false); // Ensure quiz is not marked as complete yet
        setCurrentQuestionIndex(0); // Start from the first question
        setScore(0); // Reset score at the start
        setUserAnswers([]); // Reset previous user answers
      } else {
        setError(
          "No questions available for the selected options. Please try different settings.", // Error handling if no questions are found
        );
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setError("Failed to load quiz questions. Please try again."); // Error handling for failed fetch
    } finally {
      setLoading(false); // Set loading state to false after fetch completion
    }
  };

  // Function to handle the user's answer and update the score
  const handleAnswer = (isCorrect, selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex]; // Get current question
    setUserAnswers((prev) => [
      ...prev,
      { question: currentQuestion.question, selectedOption, isCorrect }, // Store user's selected answer and correctness
    ]);
    if (isCorrect) setScore(score + 1); // Increment score if answer is correct
  };

  // Function to move to the next question, or complete the quiz if last question
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); 
    } else {
      setQuizComplete(true); // Mark quiz as complete when all questions answered
      setQuizStarted(false); // Mark quiz as not started
      // Add quiz summary to quiz history when complete
      const newQuiz = {
        date: new Date().toLocaleString(),
        category: quizConfig.category,
        difficulty: quizConfig.difficulty,
        score,
        total: questions.length,
      };
      setQuizHistory((prev) => [...prev, newQuiz]); 
    }
  };

  // Function to allow the user to retake the quiz
  const retakeQuiz = () => {
    setTimeout(() => {
      startQuiz(quizConfig.category, quizConfig.difficulty, quizConfig.amount); // Retake quiz with the same settings
    }, 90); // Delay to show result before retaking
  };

  // Function to reset the quiz and return to the start state
  const resetQuiz = () => {
    setQuizStarted(false); // Reset quiz started state
    setQuizComplete(false); // Reset quiz complete state
    setQuestions([]); // Clear questions
    setCurrentQuestionIndex(0); // Reset question index
    setScore(0); // Reset score
    setUserAnswers([]); // Clear user answers
    setError(null); // Reset error state
  };

  return (
    <div className="App">
      <div className="quiz-container mx-auto max-w-3xl p-4">
        {/* Display loading state while fetching quiz questions */}
        {loading && (
          <p className="mt-10 text-center text-2xl font-bold">
            Loading quiz...
          </p>
        )}
        {/* Display error message if there's an error fetching quiz data */}
        {error && (
          <div className="error-message mt-4 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={
                () =>
                  startQuiz(
                    quizConfig.category,
                    quizConfig.difficulty,
                    quizConfig.amount,
                  ) // Retry fetching quiz
              }
              className="retry-button mt-4 bg-blue-500 p-2 text-white"
            >
              Retry
            </button>
          </div>
        )}
        {/* Show the quiz start component if quiz has not started and not completed */}
        {!quizStarted && !quizComplete && !error && (
          <QuizStart onStart={startQuiz} history={quizHistory} />
        )}
        {/* Show the question card if quiz is started and not complete */}
        {quizStarted && !quizComplete && (
          <QuestionCard
            question={questions[currentQuestionIndex]} // Current question
            onAnswer={handleAnswer} // Answer selection handler
            onNext={nextQuestion} // Move to next question handler
          />
        )}
        {/* Show the score summary if quiz is complete */}
        {quizComplete && (
          <ScoreSummary
            score={score} // Final score
            total={questions.length} // Total questions in the quiz
            userAnswers={userAnswers} // List of user answers
            onRetake={retakeQuiz} // Retake quiz handler
            onNewTopic={resetQuiz} // Reset quiz handler
          />
        )}
      </div>
    </div>
  );
}

export default App;
