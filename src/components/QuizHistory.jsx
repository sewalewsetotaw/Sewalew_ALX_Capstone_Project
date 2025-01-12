import React, { useEffect, useState } from "react";

const QuizHistory = ({ history }) => {
  // State to store category names by category id
  const [categories, setCategories] = useState({});

  useEffect(() => {
    // Fetch categories from the Open Trivia Database API when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json(); // Parse the response as JSON
        if (data.trivia_categories) {
          // Convert the categories array into an object for easier lookups by category ID
          const categoryMap = data.trivia_categories.reduce((map, category) => {
            map[category.id] = category.name; // Store category name by id
            return map;
          }, {});
          setCategories(categoryMap); // Set categories in state
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error); // Handle errors if the API request fails
      }
    };

    fetchCategories(); // Call the async function to fetch the categories
  }, []);

  // Calculate the total number of quizzes in history
  const quizCount = history.length;

  // Calculate the best score by finding the maximum score from history
  const bestScore = Math.max(...history.map((quiz) => quiz.score), 0);

  // Calculate the average score, ensuring it is a valid number by dividing by quizCount (or 0 if no quizzes)
  const averageScore = (
    history.reduce((sum, quiz) => sum + quiz.score, 0) / quizCount || 0
  ).toFixed(2); // Round to 2 decimal places

  return (
    <div className="rounded-lg bg-gray-300 p-4 shadow-md">
      {/* Displaying total quizzes, best score, and average score */}
      <p className="mb-4">
        <strong>Total Quizzes:</strong> {quizCount}
      </p>
      <p className="mb-4">
        <strong>Best Score:</strong> {bestScore}
      </p>
      <p className="mb-4">
        <strong>Average Score:</strong> {averageScore}
      </p>
      <div className="max-h-60 overflow-auto">
        {/* Table to display history of quizzes */}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-400">
              <th className="border-b px-4 py-2">Date</th>
              <th className="border-b px-4 py-2">Topic</th>
              <th className="border-b px-4 py-2">Difficulty</th>
              <th className="border-b px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate over each quiz in history to display its details in a table row */}
            {history.map((quiz, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-blue-100"
                }`} // Alternate row colors for better readability
              >
                <td className="px-4 py-2 text-sm sm:text-base">{quiz.date}</td>
                {/* Display category name using the categories object */}
                <td className="px-4 py-2 text-sm sm:text-base">
                  {categories[quiz.category]}
                </td>
                {/* Display difficulty of the quiz */}
                <td className="px-4 py-2 text-sm capitalize sm:text-base">
                  {quiz.difficulty}
                </td>
                {/* Display the score and total possible score */}
                <td className="px-4 py-2 text-sm font-medium text-gray-800 sm:text-base">
                  {quiz.score} / {quiz.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizHistory;
