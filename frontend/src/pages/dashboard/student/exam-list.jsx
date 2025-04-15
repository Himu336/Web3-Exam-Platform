import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamList = () => {
  const navigate = useNavigate();

  const handleStartExam = (examId) => {
    navigate(`/student/exam-confirmation/${examId}`);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Available Exams</h3>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold">Data Structures</h4>
          <p className="text-gray-600 mt-1">Duration: 2 hours</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Start Time: 10:00 AM</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Start Exam
            </button>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold">Web Development</h4>
          <p className="text-gray-600 mt-1">Duration: 1.5 hours</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Start Time: 2:00 PM</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamList;
