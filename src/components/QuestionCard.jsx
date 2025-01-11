import React, { useState } from "react";

const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};

const QuestionCard = ({ question, onAnswer, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === question.correct_answer;
    setSelectedOption(selectedAnswer);
    setIsAnswerCorrect(isCorrect);
    onAnswer(isCorrect);
  };

  const shuffledOptions = [
    ...question.incorrect_answers,
    question.correct_answer,
  ].sort(() => Math.random() - 0.5);

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    onNext();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="block w-full max-auto p-4 border rounded bg-white shadow-lg">
        {/* Question */}
        <h2 className="text-xl font-bold mb-6">
          {decodeHtmlEntities(question.question)}
        </h2>
        {/* Options */}
        <div className="grid gap-4 w-full p-8 max-auto">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = isAnswerCorrect && isSelected;
            const isIncorrect = isSelected && !isAnswerCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null} // Disable after an answer is selected
                className={`block w-full p-2 border rounded  justify-between items-center ${
                  isCorrect
                    ? "bg-green-500 text-white border-green-600"
                    : isIncorrect
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-gray-100 hover:bg-blue-200"
                }`}
              >
                <span>{decodeHtmlEntities(option)}</span>
                {isSelected && (
                  <span className="text-2xl">
                    {isCorrect ? "✔" : isIncorrect ? "✖" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* Next Button */}
        {selectedOption && (
          <button
            onClick={handleNext}
            className="mt-6 bg-blue-500 text-white px-12 py-4 rounded-full float-right"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
