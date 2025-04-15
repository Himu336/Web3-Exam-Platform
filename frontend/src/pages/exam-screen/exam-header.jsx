import React from 'react';
import ExamTimer from './exam-timer';

const ExamHeader = ({ examTitle }) => {
  return (
    <div className="w-full bg-white shadow-sm border-b">
      <div className="w-full flex items-center justify-between px-8 py-2">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-blue-600">Web3-Exam-Platform</span>
          </div>
          <h1 className="text-gray-700 text-sm">
            {examTitle || 'Test for Goal - Legislation'}
            <div className="text-xs text-gray-500">
              Test status: Not finished...
            </div>
          </h1>
        </div>

        {/* Timer and User Info */}
        <div className="flex items-center space-x-6">
          <ExamTimer initialTime={6 * 60 * 60} /> {/* 6 hours in seconds */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <img 
                src="/user-avatar.png" 
                alt="User" 
                className="w-6 h-6 rounded-full"
              />
            </div>
            <span className="text-sm text-gray-600">Welcome [Student]...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;
