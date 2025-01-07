import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
function QuizStart() {
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(5);
  const [question, setQuestion] = useState([]);

  // Fetch categories from API
  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories || []))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);
  const handleStart = () => {
    if (!category || amount < 1) {
      alert("Please select a category and valid question amount.");
      return;
    }
    // Fetch quiz questions from API
    fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setQuestion(data.results); // Store fetched questions in state
          console.log("Quiz questions fetched successfully:", data.results);
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
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="block w-full max-w-md p-4 border rounded bg-white shadow-lg">
        <div className="flex items-center space-x-2 sm:space-x-4 mb-8 sm:mb-12">
          <img
            src="../image/q1.jpg"
            alt="Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 max-w-full h-auto"
          />
          <h1 className="text-3xl font-bold">Quiz App</h1>
        </div>

        <div className="p-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
            min="1"
            max="50"
          />
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Start Quiz
          </button>
        </div>
        {/* Pass questions to QuestionCard */}
        {question && <QuestionCard questions={question} />}
      </div>
    </div>
  );
}

export default QuizStart;
