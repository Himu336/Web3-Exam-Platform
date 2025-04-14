import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExamHeader from './exam-header';
import ExamQuestion from './exam-question';
import QuestionGrid from './question-grid';

const ExamScreen = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [markedForReview, setMarkedForReview] = useState([]);
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});

  // Example exam data - replace with API call
  const mockExamData = {
    id: examId,
    title: "Test for Goal - Legislation",
    duration: 6 * 60 * 60, // 6 hours in seconds
    questions: [
      {
        id: 1,
        text: "Distance between two shafts shall not be less than __________ ?",
        options: ["7 M", "10.5 M", "13.5 M", "15.5 M", "18.5 M"]
      },
      // Add more questions as needed
    ]
  };

  useEffect(() => {
    // Simulate API call to fetch exam data
    setExamData(mockExamData);
  }, [examId]);

  const handleSaveAnswer = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: option
    }));
    setAnsweredQuestions(prev => [...new Set([...prev, currentQuestion])]);
    
    // Move to next question if available
    if (currentQuestion < mockExamData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview(prev => [...new Set([...prev, currentQuestion])]);
    if (currentQuestion < mockExamData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinalSubmit = () => {
    // Add confirmation dialog
    if (window.confirm('Are you sure you want to submit the exam?')) {
      // Submit exam logic here
      navigate('/student/dashboard');
    }
  };

  if (!examData) {
    return <div className="flex items-center justify-center h-screen">Loading exam...</div>;
  }

  const currentQuestionData = mockExamData.questions[currentQuestion - 1];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ExamHeader 
        examTitle={examData.title} 
        initialTime={examData.duration}
      />
      
      {/* Main content area - takes remaining height */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Question section */}
        <div className="w-3/4 h-full overflow-y-auto border-r border-gray-200">
          <div className="p-8">
            <ExamQuestion 
              questionNumber={currentQuestion}
              questionText={currentQuestionData.text}
              options={currentQuestionData.options}
              selectedOption={answers[currentQuestion]}
              onSave={handleSaveAnswer}
              onMarkForReview={handleMarkForReview}
              onPrevious={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
              onFinalSubmit={handleFinalSubmit}
            />
          </div>
        </div>
        
        {/* Question grid section */}
        <div className="w-1/4 h-full overflow-y-auto">
          <div className="p-4 h-full">
            <QuestionGrid 
              totalQuestions={mockExamData.questions.length}
              currentQuestion={currentQuestion}
              answeredQuestions={answeredQuestions}
              markedForReview={markedForReview}
              onQuestionSelect={setCurrentQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamScreen; 