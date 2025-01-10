import React, { useState } from "react";
import "./App.css";
import QuizStart from "./components/QuizStart";
import QuestionCard from "./components/QuestionCard";
import ScoreSummary from "./components/ScoreSummary";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const startQuiz = (category, difficulty, amount) => {
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
        } else {
          alert(
            "No questions available for the selected options. Please try different settings."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
        alert("Failed to load quiz questions. Please try again.");
      });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      setQuizStarted(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizComplete(false);
    setQuestions([]);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="App">
      {!quizStarted && !quizComplete && <QuizStart onStart={startQuiz} />}
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
          onRestart={resetQuiz}
        />
      )}
    </div>
  );
}

export default App;
