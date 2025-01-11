import React from "react";

const ScoreSummary = ({ score, total, userAnswers, onRetake, onNewTopic }) => {
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const incorrectAnswers = userAnswers.length - correctAnswers;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="block w-full max-w-lg p-6 border rounded-lg bg-white shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6">
          Quiz Completed!
        </h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Your Score: <span className="text-green-600">{score}</span> /{" "}
          <span className="text-gray-800">{total}</span>
        </p>
        <p className="text-lg text-gray-600 mb-8">
          <span className="font-medium text-green-600">
            {correctAnswers} Correct
          </span>{" "}
          and{" "}
          <span className="font-medium text-red-600">
            {incorrectAnswers} Incorrect
          </span>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetake}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Retake Quiz
          </button>
          <button
            onClick={onNewTopic}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Choose New Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;
