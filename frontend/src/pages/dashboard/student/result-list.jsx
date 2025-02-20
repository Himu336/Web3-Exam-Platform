const ResultList = () => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Examination Results</h3>
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold">Data Structures</h4>
              <p className="text-gray-600 mt-1">Exam Date: Feb 15, 2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              85/100
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-semibold">Web Development</h4>
              <p className="text-gray-600 mt-1">Exam Date: Feb 10, 2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              92/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultList;
