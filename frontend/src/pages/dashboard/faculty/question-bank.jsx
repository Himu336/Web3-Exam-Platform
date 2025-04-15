import React, { useEffect, useState } from 'react';
import { useQuestions } from '../../../contexts/QuestionContext';

const QuestionBank = () => {
  const { questions, loading, error, fetchMyQuestions, deleteQuestion } = useQuestions();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await fetchMyQuestions();
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadQuestions();
  }, [fetchMyQuestions]);

  // Show loading indicator only on initial load
  if (isInitialLoad && loading) {
    return <div className="flex justify-center items-center h-64">Loading questions...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded-md text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">My Questions</h2>
          <div className="flex items-center">
            {loading && !isInitialLoad && (
              <div className="mr-3">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            <div className="text-sm text-gray-500">Total: {questions.length} questions</div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            You haven't created any questions yet. Go to Create Question to add your first question.
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div className="font-medium text-gray-800">{question.question_text}</div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingQuestion(question)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this question?')) {
                          deleteQuestion(question.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {question.options && (
                    Array.isArray(question.options)
                      ? question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md ${
                            index === question.correct_option_index
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {option.text}
                          {index === question.correct_option_index && ' (Correct)'}
                        </div>
                      ))
                      : typeof question.options === 'string'
                        ? (() => {
                            try {
                              const parsedOptions = JSON.parse(question.options);
                              return parsedOptions.map((option, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md ${
                                    index === question.correct_option_index
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {option.text}
                                  {index === question.correct_option_index && ' (Correct)'}
                                </div>
                              ));
                            } catch (e) {
                              return <div className="p-2 bg-gray-100 rounded-md text-gray-500">Unable to display options</div>;
                            }
                          })()
                        : <div className="p-2 bg-gray-100 rounded-md text-gray-500">Option data not available</div>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-md mr-2">
                    {question.subject}
                  </span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-md mr-2">
                    {question.topic}
                  </span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-md mr-2">
                    {question.difficulty}
                  </span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-md">
                    {question.marks} mark{question.marks !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mt-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      question.is_approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {question.is_approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank; 