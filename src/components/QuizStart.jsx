import React, { useState, useEffect } from "react";
const QuizStart = ({ onStart }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(5);

  // Fetch categories from API
  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        setFilteredCategories(data.trivia_categories || []);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleStart = () => {
    if (!category || amount < 1) {
      alert("Please select a category and valid number of question.");
      return;
    }
    onStart(category, difficulty, amount);
    console.log(`Hello ${category} ${difficulty} ${amount}`);
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="block w-full max-w-md p-4 border rounded bg-white shadow-lg">
        <div className="flex items-center space-x-2 sm:space-x-4 mb-8 sm:mb-12">
          <img
            src="../image/q1.jpg"
            alt="Logo"
            className="w-12  sm:w-16 sm:h-16 bg-red-100 max-w-full h-auto"
          />
          <h1 className="text-3xl font-bold">Quiz App</h1>
        </div>

        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for quiz topics..."
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="">Select Category</option>
            {filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
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
      </div>
    </div>
  );
};

export default QuizStart;
