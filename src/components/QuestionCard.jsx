import React, { useState } from "react";

// Helper function to decode HTML entities in the question and options
const decodeHtmlEntities = (html) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
};

const QuestionCard = ({ question, onAnswer, onNext }) => {
  // State to track the selected answer, correctness of the answer.
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

  // Handle when an answer option is selected
  const handleAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === question.correct_answer; // Check if the selected answer is correct
    setSelectedOption(selectedAnswer); // Set the selected option
    setIsAnswerCorrect(isCorrect); // Set whether the answer is correct or not
    onAnswer(isCorrect); // Pass the result to the parent component
  };

  // Shuffle options to randomize their order for each question
  const shuffledOptions = [
    ...question.incorrect_answers, 
    question.correct_answer, 
  ].sort(() => Math.random() - 0.5);

  // Handle the "Next" button click to move to the next question
  const handleNext = () => {
    setSelectedOption(null); // Reset selected option
    setIsAnswerCorrect(null); // Reset the answer correctness
    onNext(); // Call the "onNext" function passed from the parent
  };

  return (
    <div className="flex h-screen items-center justify-center px-4 sm:px-6">
      <div className="max-auto block w-full max-w-lg rounded border bg-gray-500 p-4 shadow-lg">
        {/* Display the question */}
        <h2 className="mb-6 text-lg font-bold sm:text-xl md:text-2xl">
          {decodeHtmlEntities(question.question)}{" "}
          {/* Decode and display the question text */}
        </h2>

        {/* Display answer options */}
        <div className="max-auto grid w-full gap-4 p-8">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedOption === option; // Check if the current option is selected
            const isCorrect = isAnswerCorrect && isSelected; // Check if the selected option is correct
            const isIncorrect = isSelected && !isAnswerCorrect; // Check if the selected option is incorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)} // Call handleAnswer when the option is clicked
                disabled={selectedOption !== null} // Disable button after an answer is selected
                className={`block w-full items-center justify-between rounded border p-2 ${
                  // Dynamic class for button styling
                  isCorrect
                    ? "border-green-600 bg-green-500 text-white" 
                    : isIncorrect
                      ? "border-red-600 bg-red-500 text-white" 
                      : "bg-gray-100 hover:bg-blue-200" 
                }`}
              >
                <span>{decodeHtmlEntities(option)}</span>{" "}
                {/* Decode and display the option */}
              </button>
            );
          })}
        </div>

        {/* "Next" button, displayed once an answer is selected */}
        {selectedOption && (
          <button
            onClick={handleNext} // Call handleNext when the button is clicked
            className="float-right mx-auto mt-6 block rounded-full bg-blue-500 text-white sm:px-12 sm:py-4"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
