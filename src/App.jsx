import React, { useState } from "react";
import "./App.css";
import QuizStart from "./components/QuizStart";
import QuestionCard from "./components/QuestionCard";
import ScoreSummary from "./components/ScoreSummary";
import QuizHistory from "./components/QuizHistory";
function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizConfig, setQuizConfig] = useState({
    category: "",
    difficulty: "",
    amount: 5,
  });
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // State to toggle history display
  const [quizHistory, setQuizHistory] = useState([]); // State to track quiz history
  const startQuiz = (category, difficulty, amount) => {
    setQuizConfig({ category, difficulty, amount });
    setLoading(true);
    fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setQuestions(data.results);
          setQuizStarted(true);
          setQuizComplete(false);
          setCurrentQuestionIndex(0);
          setScore(0);
          setUserAnswers([]); // Reset user answers
        } else {
          alert(
            "No questions available for the selected options. Please try different settings."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
        alert("Failed to load quiz questions. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  // const handleAnswer = (isCorrect) => {
  //   if (isCorrect) setScore(score + 1);
  // };
  const handleAnswer = (isCorrect, selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers((prev) => [
      ...prev,
      { question: currentQuestion.question, selectedOption, isCorrect },
    ]);
    if (isCorrect) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      setQuizStarted(false);
      // Update quiz history on quiz completion
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
  // Restart the quiz with the same category and difficulty
  const retakeQuiz = () => {
    setTimeout(() => {
      startQuiz(quizConfig.category, quizConfig.difficulty, quizConfig.amount);
    }, 90);
  };

  // Start a new quiz by resetting everything
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizComplete(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers([]); // Reset user answers
  };

  return (
    <div className="App">
      {loading && (
        <p className="text-2xl font-bold text-center mt-10">Loading quiz...</p>
      )}
      {!quizStarted && !quizComplete && (
        <>
          <QuizStart onStart={startQuiz} />
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            {showHistory ? "Hide Quiz History" : "Show Quiz History"}
          </button>
          {showHistory && <QuizHistory history={quizHistory} />}
        </>
      )}
      {quizStarted && !quizComplete && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
        />
      )}
      {quizComplete && (
        <ScoreSummary
          score={score}
          total={questions.length}
          userAnswers={userAnswers}
          onRetake={retakeQuiz}
          onNewTopic={resetQuiz}
        />
      )}
    </div>
  );
}

export default App;
