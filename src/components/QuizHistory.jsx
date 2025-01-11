import React, { useEffect, useState } from "react";

const QuizHistory = ({ history }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    // Fetch categories when the component mounts
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.trivia_categories) {
          // Convert the category array into an object for easier lookups
          const categoryMap = data.trivia_categories.reduce((map, category) => {
            map[category.id] = category.name;
            return map;
          }, {});
          setCategories(categoryMap);
        }
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  const quizCount = history.length;
  const bestScore = Math.max(...history.map((quiz) => quiz.score), 0);
  const averageScore = (
    history.reduce((sum, quiz) => sum + quiz.score, 0) / quizCount || 0
  ).toFixed(2);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Quiz History</h2>
      <p className="mb-4">
        <strong>Total Quizzes:</strong> {quizCount}
      </p>
      <p className="mb-4">
        <strong>Best Score:</strong> {bestScore}
      </p>
      <p className="mb-4">
        <strong>Average Score:</strong> {averageScore}
      </p>
      <div className="overflow-auto max-h-60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-400">
              <th className="border-b px-4 py-2">Date</th>
              <th className="border-b px-4 py-2">Topic|Category</th>
              <th className="border-b px-4 py-2">Difficulty</th>
              <th className="border-b px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {history.map((quiz, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-blue-100"
                }`}
              >
                <td className="px-4 py-2">{quiz.date}</td>
                <td className="px-4 py-2">
                  {categories[quiz.category] || "Unknown Category"}
                </td>
                <td className="px-4 py-2 capitalize">{quiz.difficulty}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
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
