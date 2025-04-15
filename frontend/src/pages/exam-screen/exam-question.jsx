import React, { useState, useEffect } from 'react';

const ExamQuestion = ({ 
  questionNumber, 
  questionText, 
  options,
  selectedOption,
  onSave,
  onMarkForReview,
  onPrevious,
  onFinalSubmit
}) => {
  const [currentSelection, setCurrentSelection] = useState(selectedOption);

  useEffect(() => {
    setCurrentSelection(selectedOption);
  }, [selectedOption]);

  const handleOptionSelect = (optionIndex) => {
    setCurrentSelection(optionIndex);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <span className="font-medium text-lg">Q {questionNumber}</span>
        <p className="mt-3 text-gray-700">{questionText}</p>
      </div>

      <div className="flex-1">
        {options.map((option, index) => (
          <div 
            key={index}
            className="mb-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => handleOptionSelect(index)}
          >
            <label className="flex items-center p-4 cursor-pointer w-full">
              <input
                type="radio"
                name={`question-${questionNumber}`}
                checked={currentSelection === index}
                onChange={() => handleOptionSelect(index)}
                className="w-4 h-4 text-blue-600 mr-4"
              />
              <span className="flex-1">{option}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between">
        <div className="space-x-4">
          <button 
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={onPrevious}
          >
            Previous
          </button>
          <button 
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={onMarkForReview}
          >
            Mark for Review & Next
          </button>
        </div>

        <div className="space-x-4">
          <button 
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => onSave(currentSelection)}
          >
            Save & Next
          </button>
          <button 
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onFinalSubmit}
          >
            Final Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamQuestion;
