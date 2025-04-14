import React, { useEffect, useState } from 'react';
import { useResults } from '../../../contexts/ResultContext';

const Results = () => {
  const { results, loading, error, fetchAllResults, validateResult } = useResults();
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchAllResults();
  }, [fetchAllResults]);

  const handleValidateResult = async (id, totalMarks) => {
    try {
      await validateResult(id, { totalMarks });
      setSelectedResult(null);
    } catch (err) {
      console.error('Failed to validate result:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading results...</div>;
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded-md text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Exam Results</h2>
          <div className="text-sm text-gray-500">Total: {results.length} results</div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No results found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.student_name}</div>
                      <div className="text-sm text-gray-500">{result.student_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.total_marks} / {result.exam_total_marks}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'validated' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {result.status !== 'validated' && (
                        <button
                          onClick={() => setSelectedResult(result)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Validate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Validation Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Validate Result</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Validate result for {selectedResult.student_name} on {selectedResult.title}
                </p>
                <div className="mt-4">
                  <label className="block text-sm text-gray-700">
                    Total Marks:
                    <input 
                      type="number" 
                      defaultValue={selectedResult.total_marks}
                      min={0}
                      max={selectedResult.exam_total_marks}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      id="totalMarks"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4 px-4 py-3">
                <button
                  onClick={() => setSelectedResult(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleValidateResult(
                    selectedResult.id, 
                    parseInt(document.getElementById('totalMarks').value)
                  )}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700"
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results; 