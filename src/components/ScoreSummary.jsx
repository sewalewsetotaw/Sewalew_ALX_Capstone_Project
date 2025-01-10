import React from "react";

function ScoreSummary({ score, total, onRestart }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="block w-full max-w-md p-4 border rounded bg-white shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <p className="text-xl mb-6">
          Your Score: <span className="font-bold">{score}</span> / {total}
        </p>
        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
}

export default ScoreSummary;
