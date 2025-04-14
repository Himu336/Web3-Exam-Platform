import React from 'react';

const QuestionGrid = ({ 
  totalQuestions, 
  currentQuestion,
  answeredQuestions,
  markedForReview,
  onQuestionSelect 
}) => {
  const renderQuestionButton = (questionNum) => {
    const isCurrentQuestion = currentQuestion === questionNum;
    const isAnswered = answeredQuestions.includes(questionNum);
    const isMarkedForReview = markedForReview.includes(questionNum);

    let buttonClass = "w-8 h-8 rounded text-sm font-medium ";
    
    if (isCurrentQuestion) {
      buttonClass += "bg-red-500 text-white";
    } else if (isMarkedForReview) {
      buttonClass += "bg-purple-500 text-white";
    } else if (isAnswered) {
      buttonClass += "bg-green-500 text-white";
    } else {
      buttonClass += "bg-gray-200 text-gray-700";
    }

    return (
      <button
        key={questionNum}
        className={buttonClass}
        onClick={() => onQuestionSelect(questionNum)}
      >
        Q{questionNum}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-blue-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-6">QUESTIONS</h2>
      
      <div className="grid grid-cols-5 gap-3 overflow-y-auto">
        {Array.from({ length: totalQuestions }, (_, i) => renderQuestionButton(i + 1))}
      </div>

      <div className="mt-auto pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Answered but Marked for Review</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>Not Answered but Marked for Review</span>
          </div>
        </div>

        <div className="bg-white rounded p-3 mt-4">
          <div className="flex justify-between items-center">
            <span>Un-Attempted Question</span>
            <span className="font-bold">20</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionGrid;
