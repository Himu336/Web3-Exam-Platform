import React, { useState } from 'react';

const ManageQuestions = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data - would come from API in a real app
  const questions = [
    {
      id: 1,
      text: 'What is the time complexity of quicksort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctOption: 1,
      subject: 'Data Structures',
      difficulty: 'medium',
      status: 'approved',
      faculty: 'Dr. Smith'
    },
    {
      id: 2,
      text: 'Which HTML tag is used to define an internal style sheet?',
      options: ['<style>', '<script>', '<css>', '<link>'],
      correctOption: 0,
      subject: 'Web Development',
      difficulty: 'easy',
      status: 'approved',
      faculty: 'Prof. Johnson'
    },
    {
      id: 3,
      text: 'What is the primary key constraint in a database?',
      options: [
        'A key that can be null',
        'A key that can have duplicate values',
        'A key that uniquely identifies each record',
        'A key that references another table'
      ],
      correctOption: 2,
      subject: 'Database Systems',
      difficulty: 'easy',
      status: 'pending',
      faculty: 'Dr. Wilson'
    },
    {
      id: 4,
      text: 'Which protocol is used for secure communication over the internet?',
      options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
      correctOption: 2,
      subject: 'Networking',
      difficulty: 'medium',
      status: 'rejected',
      faculty: 'Prof. Brown'
    }
  ];

  // Filter questions based on active tab
  const filteredQuestions = activeTab === 'all' 
    ? questions 
    : questions.filter(q => q.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Create Question
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'approved', 'pending', 'rejected'].map(tab => (
            <button
              key={tab}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'all' ? ' Questions' : ''}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select className="border rounded-md px-3 py-2">
          <option value="">All Subjects</option>
          <option value="data-structures">Data Structures</option>
          <option value="web-development">Web Development</option>
          <option value="database">Database Systems</option>
          <option value="networking">Networking</option>
        </select>
        <select className="border rounded-md px-3 py-2">
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select className="border rounded-md px-3 py-2">
          <option value="">All Faculty</option>
          <option value="smith">Dr. Smith</option>
          <option value="johnson">Prof. Johnson</option>
          <option value="wilson">Dr. Wilson</option>
          <option value="brown">Prof. Brown</option>
        </select>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search questions..." 
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map(question => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between">
              <span className={`text-xs px-2 py-1 rounded-full 
                ${question.status === 'approved' ? 'bg-green-100 text-green-800' : 
                  question.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}
              >
                {question.status}
              </span>
              <span className="text-sm text-gray-500">
                Faculty: {question.faculty}
              </span>
            </div>
            
            <h3 className="mt-3 text-lg font-medium">{question.text}</h3>
            
            <div className="mt-4 space-y-2">
              {question.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded ${
                    index === question.correctOption
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {option}
                  {index === question.correctOption && 
                    <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                  }
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                  {question.subject}
                </span>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded">
                  {question.difficulty}
                </span>
              </div>
              
              <div className="flex space-x-3">
                {question.status === 'pending' && (
                  <>
                    <button className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                  </>
                )}
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredQuestions.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">❓</div>
          <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
          <p className="mt-1 text-gray-500">
            {activeTab === 'all' 
              ? "There are no questions in the database yet." 
              : `There are no ${activeTab} questions.`}
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQuestions.length}</span> of{' '}
            <span className="font-medium">{filteredQuestions.length}</span> questions
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
          <button className="px-3 py-1 border rounded-md text-sm bg-purple-600 text-white">1</button>
          <button className="px-3 py-1 border rounded-md text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions; 