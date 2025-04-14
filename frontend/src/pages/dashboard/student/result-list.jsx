const ResultList = () => {
  // Sample data - replace with actual data from API
  const examResults = [
    {
      id: 1,
      subject: 'Data Structures',
      studentName: 'John Doe',
      rollNumber: 'CS2023001',
      faculty: 'Dr. Sarah Wilson',
      marks: 85,
      totalMarks: 100,
      grade: 'A',
      examDate: '2024-02-15'
    },
    {
      id: 2,
      subject: 'Web Development',
      studentName: 'John Doe',
      rollNumber: 'CS2023001',
      faculty: 'Prof. Michael Brown',
      marks: 92,
      totalMarks: 100,
      grade: 'A+',
      examDate: '2024-02-10'
    },
    {
      id: 3,
      subject: 'Database Systems',
      studentName: 'John Doe',
      rollNumber: 'CS2023001',
      faculty: 'Dr. Emily Chen',
      marks: 78,
      totalMarks: 100,
      grade: 'B+',
      examDate: '2024-02-05'
    }
  ];

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-emerald-100 text-emerald-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-indigo-100 text-indigo-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Examination Results</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
            Download Results
          </button>
          <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            View Analytics
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Average Score</div>
          <div className="text-2xl font-bold text-slate-800">85%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Highest Grade</div>
          <div className="text-2xl font-bold text-slate-800">A+</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Exams Taken</div>
          <div className="text-2xl font-bold text-slate-800">3</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="text-sm text-slate-500">Pass Rate</div>
          <div className="text-2xl font-bold text-slate-800">100%</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Sr. No.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Marks
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {examResults.map((result, index) => (
                <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{result.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{result.rollNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{result.faculty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {result.marks}/{result.totalMarks}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {new Date(result.examDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <div>
            <p className="text-sm text-slate-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
              <span className="font-medium">3</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultList;
