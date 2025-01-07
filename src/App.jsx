import { useState } from "react";
import "./App.css";
import QuestionCard from "./components/QuestionCard";
import QuizStart from "./components/QuizStart";
import ScoreSummary from "./components/ScoreSummary";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <QuestionCard />
      <QuizStart />
      <ScoreSummary />
    </>
  );
}

export default App;
