import React from 'react';

const ManageExams = () => {
  // Mock data - would come from API in a real app
  const exams = [
    { 
      id: 1, 
      title: 'Data Structures', 
      duration: '2 hours', 
      totalQuestions: 50,
      startDate: '2023-09-15',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Algorithm Design', 
      duration: '3 hours', 
      totalQuestions: 40,
      startDate: '2023-10-05',
      status: 'upcoming'
    },
    { 
      id: 3, 
      title: 'Web Development', 
      duration: '1.5 hours', 
      totalQuestions: 30,
      startDate: '2023-08-20',
      status: 'completed'
    },
    { 
      id: 4, 
      title: 'Database Systems', 
      duration: '2.5 hours', 
      totalQuestions: 45,
      startDate: '2023-09-30',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Exams</h1>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Create New Exam
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <select className="border rounded-md px-3 py-2">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search exams..." 
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{exam.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full 
                ${exam.status === 'active' ? 'bg-green-100 text-green-800' : 
                  exam.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'}`}
              >
                {exam.status}
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration:</span>
                <span>{exam.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Questions:</span>
                <span>{exam.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Start Date:</span>
                <span>{exam.startDate}</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button className="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
              <button className="text-gray-600 hover:text-gray-900 text-sm">View Results</button>
              <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for when there are no exams */}
      {exams.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900">No exams found</h3>
          <p className="mt-1 text-gray-500">Get started by creating a new exam</p>
          <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Create New Exam
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">4</span> exams
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

export default ManageExams; 