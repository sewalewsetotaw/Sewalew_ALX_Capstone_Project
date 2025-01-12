import React, { useState, useEffect } from "react";
import QuizHistory from "./QuizHistory";

const QuizStart = ({ onStart, history }) => {
  // State hooks to manage different parts of the quiz setup
  const [categories, setCategories] = useState([]); // List of available categories
  const [filteredCategories, setFilteredCategories] = useState([]); // Filtered categories based on search
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering categories
  const [difficulty, setDifficulty] = useState("medium"); // Selected difficulty
  const [category, setCategory] = useState(""); // Selected category
  const [amount, setAmount] = useState(5); // Number of questions
  const [showHistory, setShowHistory] = useState(false); // State to show quiz history 
  const [loading, setLoading] = useState(false); // State to show loading state
  const [error, setError] = useState(""); // Error message in case of failure

  // Fetch categories from API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // Set loading to true before fetching data
      setError(""); // Reset error state
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        if (!response.ok) {
          throw new Error("Failed to fetch categories."); // Throw error if response is not okay
        }
        const data = await response.json();
        setCategories(data.trivia_categories || []); // Set categories state with fetched data
        setFilteredCategories(data.trivia_categories || []); // Initialize filtered categories with all categories
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completion
      }
    };
    fetchCategories(); 
  }, []); 

  // Filter categories based on search query whenever it changes
  useEffect(() => {
    const filtered = categories.filter(
      (cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()), // Filter categories based on search query
    );
    setFilteredCategories(filtered); 
  }, [searchQuery, categories]); 

  // Function to start the quiz, called when the user clicks "Start Quiz"
  const handleStart = () => {
    // Validation to ensure category is selected and amount is within valid range
    if (!category || amount < 1 || amount > 50) {
      alert("Please select a valid category and number of questions.");
      return; // If invalid, prevent quiz start
    }
    onStart(category, difficulty, amount); // Pass selected values to parent component for quiz start
  };

  return (
    <div className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="block w-full max-w-md rounded border bg-gray-500 p-4 shadow-lg">
        <div className="mb-8 flex items-center justify-center space-x-2 sm:mb-12 sm:space-x-4">
          <h1 className="text-3xl font-bold">Quiz App</h1>
        </div>

        <div className="p-4">
          {loading && <p>Loading categories...</p>}{" "}
          {/* Show loading message while fetching categories */}
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error if fetching fails */}
          {!loading && !error && (
            <>
              {/* Search input to filter categories */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                placeholder="Search for quiz topics..."
                className="mb-4 block w-full rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search quiz topics"
              />
              {/* Category selection dropdown */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)} 
                className="mb-4 block w-full rounded border p-2"
                aria-label="Select category"
              >
                <option value="">Select Category</option>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option> // Show message if no categories are available
                )}
              </select>
              {/* Difficulty selection dropdown */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)} 
                className="mb-4 block w-full rounded border p-2"
                aria-label="Select difficulty"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {/* Number of questions input */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))} 
                className="mb-4 block w-full rounded border p-2"
                min="1"
                max="50"
                aria-label="Number of questions"
              />
              {/* Start quiz button */}
              <button
                onClick={handleStart}
                className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Start Quiz
              </button>

              {/* Button to show quiz history */}
              <div className="mt-6">
                <button
                  onClick={() => setShowHistory(true)} // Set showHistory to true to open history 
                  className="w-full rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                  Show Quiz History
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quiz history  */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <QuizHistory history={history} />{" "}
            {/* Render quiz history component */}
            {/* Close button for modal */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowHistory(false)} // Close the history 
                className="rounded bg-red-500 px-6 py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizStart;
