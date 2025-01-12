import React from "react";

const ScoreSummary = ({ score, total, userAnswers, onRetake, onNewTopic }) => {
  // Calculate the number of correct answers
  const correctAnswers = userAnswers.filter(
    (answer) => answer.isCorrect, // Filter answers that are correct
  ).length;

  // Calculate the number of incorrect answers by subtracting correct from total
  const incorrectAnswers = userAnswers.length - correctAnswers;

  return (
    <div className="my-4 flex h-screen items-center justify-center px-4">
      <div className="block w-full max-w-sm rounded-lg border bg-gray-500 p-4 text-center shadow-lg sm:max-w-lg sm:p-6">
        {/* Title of the result page */}
        <h1 className="mb-6 text-2xl font-extrabold text-blue-600 sm:text-4xl">
          Quiz Completed!
        </h1>

        {/* Display score */}
        <p className="mb-4 text-xl font-semibold text-gray-700 sm:text-2xl">
          Your Score: <span className="text-green-600">{score}</span> /{" "}
          <span className="text-gray-800">{total}</span>
        </p>

        {/* Display number of correct and incorrect answers */}
        <p className="mb-8 text-base text-gray-600 sm:text-lg">
          <span className="font-medium text-green-600">
            {correctAnswers} Correct
          </span>{" "}
          and{" "}
          <span className="font-medium text-red-600">
            {incorrectAnswers} Incorrect
          </span>
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {/* Button to retake the quiz */}
          <button
            onClick={onRetake} // Trigger the retake function passed as a prop
            className="rounded-lg bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600"
          >
            Retake Quiz
          </button>

          {/* Button to choose a new topic */}
          <button
            onClick={onNewTopic} // Trigger the new topic function passed as a prop
            className="rounded-lg bg-gray-300 px-5 py-2 text-gray-800 transition hover:bg-gray-400"
          >
            Choose New Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;
